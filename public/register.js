document.getElementById("back_login").onclick = function () {
  location.href = "/login";
};




// var mysql = require("mysql");
// var conexion = mysql.createConnection({
//   host: "localhost",
//   database: "showfood",
//   user: "adminshowfood",
//   password: "DAW2022",
// });

// conexion.connect(function (err) {
//   if (err) {
//     console.error("Error de conexion: " + err.stack);
//     return;
//   }
//   console.log("Conectado con el identificador " + conexion.threadId);
// });

// exports.signup = function(req, res){
//   message = '';
//   if(req.method == "POST"){
//      var post  = req.body;
//      var name= post.user_email;
//      var fname= post.user_name;
//      var lname= post.user_lastname;
//      var pass= post.user_pass;

//      var sql = "INSERT INTO `users`(`email`,`nombre`,`apellidos`,`contraseña`) VALUES ('" + fname + "','" + lname + "','" + name + "','" + pass + "')";

//      var query = db.query(sql, function(err, result) {

//         message = "Succesfully! Your account has been created.";
//         res.render('signup.ejs',{message: message});
//      });

//   } else {
//      res.render('signup');
//   }
// };