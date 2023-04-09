const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const mainController = require("../controllers/mainController");

// Habilitar la lectura de solicitudes en formato JSON
router.use(express.json());

//Rutas de las vistas de la aplicacion
router.get("/" , (req, res) => {
  res.render("login", {alert1:0, alert2:0, alert3:0});
});
router.get("/register", (req, res) => {
  res.render("register", {alert4:0, alert5:0, alert6:0, alert7:0});
});
router.get("/table-room", authController.isAuthenticated, (req, res) => {
  res.render("table-room");
});
router.get("/appointments", authController.isAuthenticated, (req, res) => {
  res.render("appointments");
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

router.get("/prueba",  (req, res) => {
  res.render("prueba");
});
 
//Ruta para los métodos de la aplicación
router.post('/register', authController.register);
router.post('/', authController.login);
router.post('/settings', authController.change_password);
router.get('/logout', authController.logout);
router.post("/table-room", mainController.createReserve);
router.post("/get-occupied-tables", mainController.getOccupiedTables);
router.post("/listReserveUser", mainController.listReserveUser);


//exportamos los modulos
module.exports = router;
