const express = require('express');
const Router  = new express.Router();


/* GET users listing. */
Router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = exports = Router;

