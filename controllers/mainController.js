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
        "UPDATE reservedtables SET ?? = ? WHERE email = ?;", [reserve.date, reserve.tables, reserve.email],
      );

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

    // var someVar = [];
    // function setValue(value) {
    //   someVar = value;
    //   console.log(someVar);
    // }
   
    db.query(
        "SELECT `01/06/2022` FROM reservedtables WHERE email = ?",
        [decoded.email],
        (error, results) => {
          var aresults = JSON.stringify(results[0]);
          var [aresults1, aresults2] = aresults.split(':');
          aresults2 = aresults2.replace(/['"}]+/g, '');
          db.query(
        "SELECT `02/06/2022` FROM reservedtables WHERE email = ?",
        [decoded.email],
        (error, results) => {
          var bresults = JSON.stringify(results[0]);
          var [bresults1, bresults2] = bresults.split(':');
          bresults2 = bresults2.replace(/['"}]+/g, '');
          db.query(
            "SELECT `03/06/2022` FROM reservedtables WHERE email = ?",
            [decoded.email],
            (error, results) => {
              var cresults = JSON.stringify(results[0]);
              var [cresults1, cresults2] = cresults.split(':');
              cresults2 = cresults2.replace(/['"}]+/g, '');
              db.query(
                "SELECT `04/06/2022` FROM reservedtables WHERE email = ?",
                [decoded.email],
                (error, results) => {
                  var dresults = JSON.stringify(results[0]);
                  var [dresults1, dresults2] = dresults.split(':');
                  dresults2 = dresults2.replace(/['"}]+/g, '');
                  res.render("appointments" , {email: decoded.email, 
                    day1: aresults2, day2: bresults2, day3: cresults2, day4: dresults2});



                })



            })



        })
          // const result = JSON.parse(JSON.stringify(results));
          // var {'01/06/2022': a, '02/06/2022': b, '03/06/2022': c, '04/06/2022': d} = result;
          // console.log(a);
          // result.forEach((x) => {
          // console.log(x);
          //           });

          
          // const reserved = JSON.stringify(results[0]);
          // console.log(reserved);

          // var [a, b, c, d] = reserved.split('","');
          // console.log(a);
          // console.log(b);
          // console.log(c);
          // console.log(d);


          // res.render("appointments" , {email: decoded.email, reserved: reserved});
        })

  } catch (error) {
    console.log('Error tabla de reservas');
  }
};




// exports.createReserve = async (req, res) => {
//   const email = await promisify(jwt.verify)(
//     req.cookies.jwt,
//     process.env.JWT_SECRET
//   );
//   const reserve = {
//     email: email.email,
//     tables: req.body.tables,
//     date: req.body.date
//   }
//   try {
//       db.query(
//         "UPDATE ?? SET tablesreserved = ?, day = ? WHERE email = ?;", [reserve.date, reserve.tables, reserve.date, reserve.email],
//       )
//     res.render('appointments', {email: reserve.email});
// } catch (error) {
//   console.log(error)
//   }
// };

 