const express = require('express');
const router = express.Router();

// Ruta principal - Home
router.get('/', (req, res) => {
  res.render('home');
});

// Ruta para la página Control
router.get('/control', (req, res) => {
  res.render('control');
});

// Ruta para la página Comunicacion
router.get('/comunicacionU', (req, res) => {
  res.render('comunicacionU');
});

// Ruta para la página Comunicacion
router.get('/comunicacionB', (req, res) => {
  res.render('comunicacionB');
});

module.exports = router;
