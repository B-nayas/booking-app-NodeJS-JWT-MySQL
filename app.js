//Express
const express = require("express");
const app = express();

// Cookies
const cookieParser = require("cookie-parser"); 
app.use(cookieParser()); 

//Capturar los datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Dotenv para leer las variables de entorno de la base de datos
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

//Directorio publico
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

//Html incluido en los ejs
app.set("view engine", "ejs");


// Para eliminar la cache y evitar que el usuario pueda volver 
// a cargar la pagina o ir atrás una vez se haya deslogeado.
app.use(function(req, res, next) {
  if (!req.email)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});


//Rutas de la aplicacion
app.use("/", require("./routes/router"));

//Puerto de la aplicacion en localhost
app.listen(3000, function (req, res) {
  console.log("SERVER UP - localhost:3000");
});
 
//test 