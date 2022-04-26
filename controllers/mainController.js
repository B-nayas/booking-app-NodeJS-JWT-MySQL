const db = require("../database/connectiondb");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

//Método para crear las reservas de usuarios
exports.createReserve = async (req, res) => {
  const email = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const reserve = {
    email: email.email,
    tables: req.body.tables,
    date: req.body.date,
  };
  try {
    db.query("UPDATE reservedtables SET ?? = ? WHERE email = ?;", [
      reserve.date,
      reserve.tables,
      reserve.email,
    ]);
  } catch (error) {
    console.log(error);
  }
};

//Método para listar las reservas que tiene un usuario
exports.listReserve = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    db.query(
      "SELECT day010622 FROM reservedtables WHERE email = ?",
      [decoded.email],
      (error, results) => {
        var aresults = results[0].day010622;
        db.query(
          "SELECT day020622 FROM reservedtables WHERE email = ?",
          [decoded.email],
          (error, results) => {
            var bresults = results[0].day020622;
            db.query(
              "SELECT day030622 FROM reservedtables WHERE email = ?",
              [decoded.email],
              (error, results) => {
                var cresults = results[0].day030622;
                db.query(
                  "SELECT day040622 FROM reservedtables WHERE email = ?",
                  [decoded.email],
                  (error, results) => {
                    var dresults = results[0].day040622;
                    res.render("appointments", {
                      email: decoded.email,
                      day1: aresults,
                      day2: bresults,
                      day3: cresults,
                      day4: dresults,
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.log("Error tabla de reservas");
  }
};

//Método para listar las reservas totales vistas por el administrador
exports.listReserveAll = async (req, res) => {
  try {
    db.query("SELECT * FROM reservedtables", (error, results) => {
      res.render("admin", {
        results: results,
      });
    });
  } catch (error) {
    console.log("Error tabla de reservas");
  }
};
