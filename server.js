var fs = require('fs');
var express = require("express");
var app = express();

var port = 3000;
var staticFolder = './';

app.use(express.static(staticFolder));
app.listen(port);
console.log("Listening post: " + port);
