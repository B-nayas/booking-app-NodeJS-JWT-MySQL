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
    if(reserve.tables.length > 1){
      for(let i = 0 ; i < reserve.tables.length ; i++){
      db.query(
        "UPDATE ? SET ? WHERE email = ?", [reserve.date, {reserve.tables[i]:1}, reserve.email],
      )
    }
    } else {
      db.query(
        "UPDATE ? SET ? WHERE email = ?", [reserve.date, reserve.tables[0], reserve.email],
      )
    }} catch (error) {
    console.log(error)
  }
};