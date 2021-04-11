const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {

    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var result = num1 + num2;
    
    res.send("The result of the request is " + result);
})

app.listen(port, function(req, res) {
    console.log("Server is running on port 3000");
})