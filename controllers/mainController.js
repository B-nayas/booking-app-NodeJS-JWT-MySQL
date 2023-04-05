const db = require("../database/connectiondb");
const jwt = require("jsonwebtoken");
const { CLIENT_RENEG_WINDOW } = require("tls");
const { promisify } = require("util");

//Método para creación de reservas
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

        // Convertir la fecha al formato adecuado
        const dateStr = req.body.date;
        const [day, month, year] = dateStr.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        // Comprobar si hay reservas existentes en la misma fecha y mesa
        const queryCheckReserve = `SELECT * FROM reservas WHERE fecha = STR_TO_DATE(?, '%Y-%m-%d') AND mesa_id IN (?)`;
        db.query(queryCheckReserve, [formattedDate, reserve.tableIds], (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(500).send('Error al comprobar la reserva');
          } else if (results.length > 0) {
            console.log('ERROR: Ya existe una reserva en la misma fecha y mesa');
            res.status(400).send('ERROR: Ya existe una reserva en la misma fecha y mesa');
          } else {
            // Insertar la reserva en la base de datos
            const queryInsertReserve = `INSERT INTO reservas (fecha, mesa_id, cliente_email) VALUES (STR_TO_DATE(?, '%Y-%m-%d'), ?, ?)`;
            reserve.tableIds.forEach(tableId => {
              db.query(queryInsertReserve, [formattedDate, tableId, reserve.clientemail], (error, results, fields) => {
                if (error) {
                  console.log(error);
                  res.status(500).send('Error al insertar la reserva');
                }
              });
            });

            res.status(200).send('Reserva creada correctamente');
          }
        });
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

// exports.getOccupiedTables = async (req, res) => {
//   try {
//     const query = "SELECT id FROM mesas WHERE estado = 'ocupada'";
//     const rows = await new Promise((resolve, reject) => {
//       db.query(query, (error, results, fields) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(results);
//         }
//       });
//     });
//     const occupiedTables = rows.map(table => ({id: table.id}));
//     res.header("Content-Type",'application/json');
//     res.json(occupiedTables);
//     console.log(occupiedTables);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// };

exports.getOccupiedTables = async (req, res) => {
  try {
    // Convertir la fecha al formato adecuado
    const dateStr = req.body.date;
    console.log(dateStr);
    const [day, month, year] = dateStr.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Comprobar si hay reservas existentes en la misma fecha y mesa
    const queryCheckReserve = `SELECT mesa_id FROM reservas WHERE fecha = STR_TO_DATE(?, '%Y-%m-%d') AND mesa_id IN (?)`;
    const rows = await new Promise((resolve, reject) => {
      db.query(queryCheckReserve, [formattedDate, reserve.tableIds], (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const occupiedTables = rows.map(reservation => ({id: reservation.mesa_id}));
    res.header("Content-Type",'application/json');
    res.json(occupiedTables);
    console.log(occupiedTables);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

