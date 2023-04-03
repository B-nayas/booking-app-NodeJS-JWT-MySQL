const db = require("../database/connectiondb");
const jwt = require("jsonwebtoken");
const { CLIENT_RENEG_WINDOW } = require("tls");
const { promisify } = require("util");

// Método para crear las reservas de usuarios
exports.createReserve = async (req, res) => {
  const email = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const clientIdQuery = "SELECT email FROM clientes WHERE email = ?";
  const reserve = {
    clientemail: email,
    tableIds: req.body.tableIds,
    date: req.body.date,
  };
  console.log('Reserva: ', reserve);
  try {
    // Obtener el ID del cliente que realiza la reserva
    db.query(clientIdQuery, [email.email], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error al obtener el email del cliente');
      } else if (results.length === 0) {
        res.status(404).send('Cliente no encontrado');
      } else {
        reserve.clientemail = results[0].email;
        
        // Cambiar el estado de cada mesa a "ocupada"
        reserve.tableIds.forEach(tableId => {
          const queryUpdateTable = `UPDATE mesas SET estado = 'ocupada' WHERE id = ?`;
          db.query(queryUpdateTable, [tableId], (error, results, fields) => {
            if (error) {
              console.log(error);
              res.status(500).send('Error al cambiar el estado de la mesa');
            }
          });
        });

        // Convertir la fecha al formato adecuado
        const dateStr = req.body.date;
        const [day, month, year] = dateStr.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        // Insertar la reserva en la base de datos
        const query = `INSERT INTO reservas (fecha, mesa_id, cliente_email) VALUES (STR_TO_DATE(?, '%Y-%m-%d'), ?, ?)`;
        reserve.tableIds.forEach(tableId => {
          db.query(query, [formattedDate, tableId, reserve.clientemail], (error, results, fields) => {
            if (error) {
              console.log(error);
              res.status(500).send('Error al insertar la reserva');
            }
          });
        });

        res.status(200).send('Reserva creada correctamente');
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener el email del cliente');
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



 