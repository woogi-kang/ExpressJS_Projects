const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-taewook:kbs940826@voko-ftetb.mongodb.net/todolistDB", {useNewUrlParser: true , useUnifiedTopology: true});

const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Welcome to your todoList!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this button to delete an item."
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

    //let day = date.getDate();
    //res.render("list", {listTitle: day, newListItems: items});

    Item.find({}, function(err, foundItems) {

        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if(err) {
                    console.log("Error inserting");
                } else {
                    console.log("Success!");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

app.get("/:customListName", function(req, res) {

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if(!foundList) {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                //Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    })
});

app.post("/", function(req, res) {

    //const item = req.body.newItem;

    // if(req.body.list == "Work List") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    //Finding directory for post request
    if(listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res) {

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today") {
        Item.findByIdAndRemove({_id: checkedItemId}, function(err) {
            if(!err) {
                console.log("Delete success");
            } 
        })
    
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: { _id: checkedItemId}}}, function(err, result){
            if(!err) {
                res.redirect("/" + listName);
            }   
        });
    }
})

let port = process.env.PORT;
if(port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully.");
});
