const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const mainController = require("../controllers/mainController");

//Rutas de las vistas de la aplicacion
router.get("/" , (req, res) => {
  res.render("login", {alert1:0, alert2:0, alert3:0});
});
router.get("/login", (req, res) => {
  res.render("login", {alert1:0, alert2:0, alert3:0});
});
router.get("/register", (req, res) => {
  res.render("register", {alert4:0, alert5:0, alert6:0, alert7:0});
});
router.get("/table-room", authController.isAuthenticated, (req, res) => {
  res.render("table-room");
});
router.get("/appointments", authController.isAuthenticated, mainController.listReserve, (req, res) => {
  res.render("appointments", {email: null, day1: null, day2: null, day3: null, day4: null});
});
router.get("/error-register", (req, res) => {
  res.render("error-register");
});
router.get("/admin",  authController.isAdmin, mainController.listReserveAll,  (req, res) => {
  res.render("admin", {results: null});
});
router.get("/settings",  authController.isAuthenticated, (req, res) => {
  res.render("settings", {alert7:0});
});

 
//Ruta para los métodos de la aplicación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/settings', authController.change_password);
router.get('/logout', authController.logout);
router.post("/table-room", mainController.createReserve);
router.get('/occupied-tables', mainController.getOccupiedTables);


//exportamos los modulos
module.exports = router;
