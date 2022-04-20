const jwt = require("jsonwebtoken");
const db = require("../database/connectiondb");
const { promisify } = require("util");

//Bcrypt para encriptar la contraseña
const bcryptjs = require("bcryptjs");
const { stringify } = require("querystring");

//Método para el registro
exports.register = async (req, res) => {
  try {
    const register_email = req.body.register_user_email;
    const register_name = req.body.register_user_name;
    const register_lastname = req.body.register_user_lastname;
    const register_password = req.body.register_user_pass;
    let register_passencrypt = await bcryptjs.hash(register_password, 8);
    if (
      !register_email ||
      !register_name ||
      !register_lastname ||
      !register_password
    ) {
      res.render("register", { alert4: 1, alert5: 0 });
      console.log(
        "Error de entrada de datos en el registro, debe completar los campos."
      );
    } else {
      db.query(
        "INSERT INTO users SET ?",
        {
          email: register_email,
          name: register_name,
          lastname: register_lastname,
          password: register_passencrypt,
        },
        (error, results) => {
          if (error) {
            res.render("error-register");
            console.log("Error email duplicado.");
          } else {
            res.render("register", { alert4: 0, alert5: 1 });
            console.log("Usuario creado correctamente.");
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    console.log("Error de entrada de datos.");
  }
};

//Método para el login
exports.login = async (req, res) => {
  try {
    const email = req.body.login_email;
    const password = req.body.login_pass;
    if (!email || !password) {
      res.render("login", { alert1: 1, alert2: 0, alert3: 0 });
      console.log("Error de entrada de datos en el login. Campos vacíos.");
    } else {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (error, results) => {
          const role = results[0].admin;
          if (
            results.length == 0 ||
            !(await bcryptjs.compare(password, results[0].password))
          ) {
            res.render("login", { alert1: 0, alert2: 1, alert3: 0 });
            console.log("Contraseña/Usuario incorrectos.");
          }
          else {
            const email = results[0].email;
            const admin = results[0].admin;
            const token = jwt.sign({email:email, admin:admin}, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_TIME_EXP,
            });

            const cookieOptions = {
              expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 100000),
              httpOnly: true,
            };
            if (role == 1) {
              res.cookie("jwt", token, cookieOptions);
              res.render("admin");
              console.log("Login de administrador correcto.");
            }else{
              res.cookie("jwt", token, cookieOptions);
            res.render("table-room", { alert1: 0, alert2: 0, alert3: 1 });
            console.log("Login de usuario correcto.");
            }
            
          }
        }
      );
    }
  } catch (error) {
    console.log(error, "Error de entrada de datos.");
  }
};

//Método para restringir acceso a usuarios no registrados
exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      db.query("SELECT * FROM users WHERE email = ?", [decoded.email], (error, results) => {
          if (results) {
            // console.log(JSON.stringify(results));
          req.admin = results[0];
          return next();
          } 
        })
    } catch (error) {
      console.log(error);
      return next();
    }
  }else{
    res.redirect('/login');
  }
};

//Método para restringir el acceso a usuarios no administradores
exports.isAdmin = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      db.query("SELECT admin FROM users WHERE email = ?", [decoded.email], (error, results) => {
        if (results[0].admin == 1) {
            return next()
          }else{
            res.redirect('table-room');
          }
        })
    } catch (error) {
      console.log(error);
      return next();
    }
  }else{
    res.redirect('/login');
  }
};

//Método para el cambio de contraseña
exports.change_password = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const change_password = req.body.change_pass;
    let change_passencrypt = await bcryptjs.hash(change_password, 8);

    if (!change_password) {
      res.render("settings", {alert7:1});
      console.log(
        "Debe completar campo de contraseña."
      );
    } else {
      db.query(
        "UPDATE users SET password = ? WHERE email = ?", [change_passencrypt, decoded.email],
        (error, results) => {
          if (error) {
            res.render("settings",  {alert7:0});
            console.log("ERROR.");
          }else{
            res.render("settings",  {alert7:1});
            console.log("Contraseña cambiada correctamente.");
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};


exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
}

exports.index = (req, res) => {
  return res.redirect("index");
}

//Creamos la tabla de usuarios la primera vez que visitamos la pagina principal
exports.createTable = (req, res, next) => {
  db.query("CREATE TABLE IF NOT EXISTS users (email VARCHAR(100) PRIMARY KEY, name VARCHAR(100), lastname VARCHAR(100), password VARCHAR(100), admin tinyint) ENGINE=INNODB;");
  return next();
}