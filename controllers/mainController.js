const db = require("../database/connectiondb");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");



exports.createReserve = async (req, res) => {
  const email = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const reserve = {
    email: email.email,
    tables: req.body.tables,
    date: req.body.date
  }
  try {
      db.query(
        "UPDATE ?? SET tablesreserved = ?, day = ? WHERE email = ?;", [reserve.date, reserve.tables, reserve.date, reserve.email],
      )
    res.render('appointments', {email: reserve.email});
} catch (error) {
  console.log(error)
  }
};



exports.listReserve = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const date= ["01/06/2022", "02/06/2022", "03/06/2022", "04/06/2022"];

    db.query(
        "SELECT day, tablesreserved FROM ?? WHERE email = ?",
        [date[0], decoded.email],
        (error, results) => {
          console.log(results);
        })
    
    res.render("appointments" , {email: decoded.email});
  } catch (error) {
    res.render("appointments" , {error: error});
    console.log('error tabla de asdfsadf');
  }
};
