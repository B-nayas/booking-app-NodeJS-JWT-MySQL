const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const mainController = require("../controllers/mainController");

//Token para saber el usuario



//Rutas de las vistas de la aplicacion
router.get("/",authController.createTablesDB, (req, res) => {
  res.render("index");
});
router.get("/login", (req, res) => {
  res.render("login", {alert1:0, alert2:0, alert3:0});
});
router.get("/register", (req, res) => {
  res.render("register", {alert4:0, alert5:0});
});
router.get("/table-room", authController.isAuthenticated, (req, res) => {
  res.render("table-room");
});
router.get("/appointments",  authController.isAuthenticated, mainController.listReserve, (req, res) => {
  res.render("appointments", {email: null, tables: null, date: null});
});
router.get("/error-register", (req, res) => {
  res.render("error-register");
});
router.get("/admin",  authController.isAdmin,  (req, res) => {
  res.render("admin");
});
router.get("/settings",  authController.isAuthenticated, (req, res) => {
  res.render("settings", {alert7:0});
});


router.post('/table-room', mainController.createReserve);

//Ruta para los métodos
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/settings', authController.change_password);
router.get('/logout', authController.logout);


//exportamos los modulos
module.exports = router;
