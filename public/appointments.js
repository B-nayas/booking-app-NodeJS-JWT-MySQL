

function list () {
  try {
    
    db.query("SELECT tablesreserved FROM `02/06/2022` WHERE email = ?;", [decoded.email], (error, results) => {
      if (results.length > 0) {
        console.log(results.length);
        document.getElementById("table").insertRow().innerHTML =
   '<td>12/12/12</td> <td>1</td> <td><button class="button_delete" type="submit" role="button" value="Eliminar">Eliminar</button></td>';

        }else{
          res.render('table-room');
          console.log(results.length);
          console.log('error tabla de reservas');
        }
      })



  } catch (error) {
    console.log(error)
  }}






// document.getElementById("tablaprueba").insertRow(-1).innerHTML = '<td></td><td></td><td></td><td></td>';

// const listReserve = async (req, res) => {
//   try {
//     const decoded = await promisify(jwt.verify)(
//      req.cookies.jwt,
//      process.env.JWT_SECRET
//     );
 
//     db.query("SELECT tablesreserved FROM 01/06/2022 WHERE email = ?", [decoded.email], (error, results) => {
//       if (results > 0) {
//         let createRows = () => {
//           var x = document.createElement("TR");
//           document.getElementById("table").appendChild(x);
        
//           var y1 = document.createElement("TD");
//           var t1 = document.createTextNode("01/06/2022");
//           var y2 = document.createElement("TD");
//           var t2 = document.createTextNode(results);
//           var y3 = document.createElement("TD");
//           var y4 = document.createElement("button");

//           y1.appendChild(t1);
//           y2.appendChild(t2);
//           y3.appendChild(t3);

//         }
//         createRows();


//         }else{
//           console.log('error tabla de reservas');
//         }
//       })



//   } catch (error) {
//     console.log(error)
//   }}


// listReserve();