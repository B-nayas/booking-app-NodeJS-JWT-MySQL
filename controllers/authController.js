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
    const register_agecheck = req.body.register_agecheck;
    let register_passencrypt = await bcryptjs.hash(register_password, 8);
    if (!register_email || !register_name || !register_lastname || !register_password) {
      res.render("register", { alert4: 1, alert5: 0, alert6:0, alert7:0});
      console.log("Error de entrada de datos en el registro, debe completar los campos.");
    } else if(!register_agecheck) {
      res.render("register", { alert4: 0, alert5: 0, alert6:1, alert7:0});
      console.log("Error, debe ser mayor de edad para registrarse.");
    } else {
      db.query(
        "INSERT INTO usuarios SET ?",
        {
          email: register_email,
          name: register_name,
          lastname: register_lastname,
          password: register_passencrypt,
        },
        (error, results) => {
          if (error) {
            res.render("register", { alert4: 0, alert5: 0, alert6:0, alert7:1});
            console.log("Error email duplicado.");
          } else {
            res.render("register", { alert4: 0, alert5: 1, alert6:0, alert7:0 });
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
 
exports.login = async (req, res) => {
  try {
    const email = req.body.login_email;
    const password = req.body.login_pass;

    if (!email || !password) {
      res.render("login", { alert1: 1, alert2: 0, alert3: 0 });
      console.log("Error de entrada de datos en el login. Campos vacíos.");
      return;
    }

    const sql = "SELECT password, admin FROM usuarios WHERE email = ?";
    db.query(sql, [email], async (error, results) => {
      const isAdmin = results[0].admin === 1;
      const token = jwt.sign({ email: isAdmin ? "admin" : email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIME_EXP,
      });
      const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 100000),
        httpOnly: true,
      };
      res.cookie("jwt", token, cookieOptions);

      if (!results || results.length == 0 || !(await bcryptjs.compare(password, results[0].password))) {
        res.render("login", { alert1: 0, alert2: 1, alert3: 0 });
        console.log("Contraseña/Usuario incorrectos.");
      }
      else if (isAdmin) {
        res.render("admin");
        console.log("Login de administrador correcto.");
      } else {
        res.redirect('/table-room');
        console.log("Login de usuario correcto.");
      }
    });
  } catch (error) {
    console.log(error, "Error de entrada de datos.");
    res.render("login", { alert1: 0, alert2: 1, alert3: 0 });
  }
};




// exports.login = async (req, res) => {
//   try {
//     const email = req.body.login_email;
//     const password = req.body.login_pass;
//     if (!email || !password) {
//       res.render("login", { alert1: 1, alert2: 0, alert3: 0 });
//       console.log("Error de entrada de datos en el login. Campos vacíos.");
//     } else {
//       db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (error, results) => {
//         if (results[0].admin === 1) {
//           db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (error, adminResults) => {
//             if (!adminResults || adminResults.length == 0 || !(await bcryptjs.compare(password, adminResults[0].password))) {
//               res.render("login", { alert1: 0, alert2: 1, alert3: 0 });
//               console.log("Login de empleado incorrecto.");
//             } else {
//               const id = adminResults[0].id;
//               const token = jwt.sign({ email: id }, process.env.JWT_SECRET, {
//                 expiresIn: process.env.JWT_TIME_EXP,
//               });
//               const cookieOptions = {
//                 expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 100000),
//                 httpOnly: true,
//               };
//               res.cookie("jwt", token, cookieOptions);
//               res.render("admin");
//               console.log("Login de administrador correcto.");
//             }
//           });
//         } else if (!results || results.length == 0 || !(await bcryptjs.compare(password, results[0].password))) {
//           res.render("login", { alert1: 0, alert2: 1, alert3: 0 });
//           console.log("Contraseña/Usuario incorrectos.");
//         } else {
//           const email = results[0].email;
//           const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_TIME_EXP,
//           });

//           const cookieOptions = {
//             expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 100000),
//             httpOnly: true,
//           };

//           res.cookie("jwt", token, cookieOptions);
//           res.redirect('/table-room');
//           console.log("Login de usuario correcto.");
//         }
//       });
//     }
//   } catch (error) {
//     console.log(error, "Error de entrada de datos.");
//   }
// };
 

//Método para el login
// exports.login = async (req, res) => {
//   try {
//     const email = req.body.login_email;
//     const password = req.body.login_pass;
//     if (!email || !password) {
//       res.render("login", { alert1: 1, alert2: 0, alert3: 0 });
//       console.log("Error de entrada de datos en el login. Campos vacíos.");
//     } else {
//       db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (error, results) => {
//         if (results.length <= 0) {
//           const id = req.body.login_email;
//           const pass = req.body.login_pass;
//           db.query("SELECT * FROM employees WHERE id = ?", [id], async (error, results) => {
//             if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].password))) {
//               res.render("login", { alert1: 0, alert2: 1, alert3: 0 });
//               console.log("Login de empleado incorrecto.");
//             } else {
//               const id = results[0].id;
//               const token = jwt.sign({ email: id }, process.env.JWT_SECRET, {
//                 expiresIn: process.env.JWT_TIME_EXP,
//               });
//               const cookieOptions = {
//                 expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 100000),
//                 httpOnly: true,
//               };
//               res.cookie("jwt", token, cookieOptions);
//               db.query("SELECT * FROM reservas", (error, results) => {
//                 res.render("admin", {
//                   results: results,
//                 });
//               });
//               console.log("Login de empleado correcto.");
//             }
//           });
//         } else if (results.length == 0 || !(await bcryptjs.compare(password, results[0].password))) {
//           res.render("login", { alert1: 0, alert2: 1, alert3: 0 });
//           console.log("Contraseña/Usuario incorrectos.");
//         } else {
//           const email = results[0].email;
//           const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_TIME_EXP,
//           });

//           const cookieOptions = {
//             expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 100000),
//             httpOnly: true,
//           };

//           res.cookie("jwt", token, cookieOptions);
//           res.redirect('/table-room');
//           console.log("Login de usuario correcto.");
//         }
//       });
//     }
//   } catch (error) {
//     console.log(error, "Error de entrada de datos.");
//   }
// };

//Método para restringir acceso a usuarios no registrados
exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      db.query("SELECT * FROM usuarios WHERE email = ?", [decoded.email], (error, results) => {
        if (results) {
          // console.log(JSON.stringify(results));
          req.admin = results[0];
          return next();
        }
      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/");
  }
};

//Método para restringir el acceso a usuarios no administradores
exports.isAdmin = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      db.query("SELECT name FROM usuarios WHERE email = ?", [decoded.email], (error, results) => {
        console.log(results);
        if (results[0].admin === 1) {
          res.render("admin");
        } else {
          res.status(200).send();
        }
      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/");
  }
};

//Método para el cambio de contraseña
exports.change_password = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    const change_password = req.body.change_pass;
    let change_passencrypt = await bcryptjs.hash(change_password, 8);

    if (!change_password) {
      res.render("settings", { alert7: 1 });
      console.log("Debe completar campo de contraseña.");
    } else {
      db.query("UPDATE usuarios SET password = ? WHERE email = ?", [change_passencrypt, decoded.email], (error, results) => {
        if (error) {
          res.render("settings", { alert7: 0 });
          console.log("ERROR.");
        } else {
          res.render("settings", { alert7: 1 });
          console.log("Contraseña cambiada correctamente.");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//Método para salir del sistema
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
};

// Creamos la tabla de usuarios y reservas la primera vez que visitamos la pagina principal
exports.createTablesDB = (req, res, next) => {
  const usuarios = `
  CREATE TABLE IF NOT EXISTS usuarios (
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) DEFAULT NULL,
    lastname VARCHAR(100) DEFAULT NULL,
    password VARCHAR(100) DEFAULT NULL,
    admin TINYINT DEFAULT '0',
    PRIMARY KEY (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`;
  db.query(usuarios, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Tabla usuarios creada o ya existente.");
    }
  });
  const mesas = `
  CREATE TABLE IF NOT EXISTS mesas (
    id INT NOT NULL,
    capacidad INT NOT NULL,
    estado SET('libre', 'ocupada') NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`;
  db.query(mesas, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Tabla mesas creada o ya existente.");
    }
  });
  const reservas = `
  CREATE TABLE IF NOT EXISTS reservas (
    id INT NOT NULL AUTO_INCREMENT,
    fecha DATE NOT NULL,
    mesa_id INT NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    KEY mesa_id (mesa_id),
    KEY cliente_email (cliente_email),
    CONSTRAINT reservas_ibfk_1 FOREIGN KEY (mesa_id) REFERENCES mesas(id),
    CONSTRAINT reservas_ibfk_2 FOREIGN KEY (cliente_email) REFERENCES usuarios(email)
  ) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`;
  db.query(reservas, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Tabla reservas creada o ya existente.");
    }
  });
  return next();
};


 