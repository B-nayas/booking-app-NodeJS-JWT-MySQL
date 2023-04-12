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
  const clientIdQuery = "SELECT email FROM usuarios WHERE email = ?";
  const reserve = {
    clientemail: email,
    tableIds: req.body.tableIds,
    date: req.body.date,
  };
  console.log('mainController Reserva: ', reserve);
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
            console.log('mainController ERROR: Ya existe una reserva en la misma fecha y mesa');
            res.status(400).send('ERROR: Ya existe una reserva en la misma fecha y mesa');
          } else {
            // Insertar la reserva en la base de datos
            const queryInsertReserve = `
            INSERT INTO reservas (fecha, mesa_id, cliente_email, capacidad) SELECT STR_TO_DATE(?, '%Y-%m-%d'), ?, ?, mesas.capacidad FROM mesas WHERE mesas.id = ?`;
            reserve.tableIds.forEach(tableId => {
              db.query(queryInsertReserve, [formattedDate, tableId, reserve.clientemail, tableId], (error, results, fields) => {
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
exports.listReserveUser = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const rows = await new Promise((resolve, reject) => {
    db.query(
      "SELECT fecha, mesa_id, capacidad FROM reservas WHERE cliente_email = ?",
      [decoded.email],
      (error, results) => {
        resolve(results);
      }
    );
    });
    const listreserves = rows.map(list => ({ fecha: list.fecha, id: list.mesa_id, capacidad: list.capacidad }));
    res.header("Content-Type",'application/json');
    res.json(listreserves);
  } catch (error) {
    console.log("Error tabla de reservas");
  }
};
  
//Método para listar las reservas totales vistas por el administrador
exports.listReserveAll = async (req, res) => {
  try {
    db.query('SELECT * FROM reservas', (error, result) => {
      if (error) {
        throw error;
      } else {
        const rows = Array.isArray(result) ? result : [];
        const reservas = rows.map(list => ({
          fecha: list.fecha,
          id: list.mesa_id,
          capacidad: list.capacidad,
          email: list.cliente_email
        }));
        res.header("Content-Type", "application/json");
        res.json(reservas);
      }
    });    
  } catch (error) {
    console.log("Error tabla de reservas", error);
  }
};


//Método para obtener las mesas que están ocupadas en una fecha determinada
exports.getOccupiedTables = async (req, res) => {
  try {
    // Convertir la fecha al formato adecuado
    const dateParts = req.body.date.split('/');
    const year = parseInt(dateParts[2]);
    const monthIndex = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[0]);
    const date = new Date(year, monthIndex, day);
    const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    // Comprobar si hay reservas existentes en la misma fecha y mesa
    const queryCheckReserve = `SELECT mesa_id FROM reservas WHERE fecha = ?`;
    const rows = await new Promise((resolve, reject) => {
      db.query(queryCheckReserve, [formattedDate], (error, results, fields) => {
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
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.cancelReserve = async (req, res) => {
  try {
    const reservaId = req.body.reservaId;
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM reservas WHERE id = ? AND cliente_email = ?",
        [reservaId, decoded.email],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.status(200).json({ message: "Reserva cancelada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cancelar la reserva" });
  }
};
