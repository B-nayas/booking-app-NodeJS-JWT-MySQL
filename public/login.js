const jwt = require("jsonwebtoken");
const db = require("../database/connectiondb");
const { promisify } = require("util");

document.getElementById("login_button").onclick = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
        db.query("SELECT admin FROM users WHERE email = ?", [decoded.email], (error, results) => {
          if (results[0].admin == 1) {
            res.redirect('admin');
            }else if (results[0].admin == 0){
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

  

  location.href = "/login";


