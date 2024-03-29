const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const mainController = require("../controllers/mainController");

// Habilitar la lectura de solicitudes en formato JSON
router.use(express.json());

//Rutas de las vistas de la aplicacion
router.get("/" , authController.createTablesDB, (req, res) => {
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
router.get("/admin", authController.isAuthenticated, authController.isAdmin, (req, res) => {
  res.render("admin");
});
router.get("/settings",  authController.isAuthenticated, (req, res) => {
  res.render("settings", {alert7:0});
});


//Ruta para los métodos de la aplicación
router.post('/register', authController.register);
router.post('/', authController.login);
router.post('/settings', authController.change_password);
router.get('/logout', authController.logout);
router.post("/table-room", mainController.createReserve);
router.post("/get-occupied-tables", mainController.getOccupiedTables);
router.post("/listReserveUser", mainController.listReserveUser);
router.post("/listReserveAll", mainController.listReserveAll)
router.post("/cancelReserve", mainController.cancelReserve);


//exportamos los modulos
module.exports = router;
