const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    var height = req.body.height;
    var weight = req.body.weight;

    var bmi = weight / (height * height);

    res.send("The BMI result is " + bmi);
})

app.listen(3000, function(req,res) {
    console.log("Server is running on port 3000");
})