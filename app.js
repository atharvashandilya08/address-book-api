const bodyParser = require("body-parser")
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const md5 = require("md5");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.URL);

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    addressBook: {type: Object, required: true}
});

const User = new mongoose.model("User", userSchema);

app.route("/")
    .get((req, res) => { 
        User.find({}, (err, results) => { 
            err ? res.send(err) : res.send(results) 
        }); 
    })
    .post((req,res)=>{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const addressBook = req.body.addressBook;
        const passwordEncrypted = md5(password);
        console.log(passwordEncrypted);
        const newUser = new User({
            username: username,
            password: passwordEncrypted,
            email: email,
            addressBook : addressBook
        });
        newUser.save(err=>{err?res.send(err):res.send("Successfully posted!")}); 
    })
    .delete((req,res)=>{
        User.deleteMany({}, err=>{err ? res.send(err) : res.send("Successfully deleted the whole database!")})
    });
app.route("/:username")
    .get((req, res)=>{
        const username = req.params.username;
        User.find({username: username}, (err, results)=>{
            err ? res.send(err) : res.send(results);
        })
    })
    .put((req, res)=>{
        const username = req.params.username;
        const dbUsername = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const addressBook = req.body.addressBook;
        const passwordEncrypted = md5(password);
        
        User.replaceOne({username: username}, {username:dbUsername, email: email, password:passwordEncrypted, addressBook:addressBook}, null, (err,results)=>{
            err ? res.send(err) : res.send(results);
        })
    })
    .patch((req, res)=>{
        const username = req.params.username;
        User.updateOne({username: username}, {$set: req.body}, err=>{
            err ? res.send(err) : res.send("Patch Success!");
        })
    })
    .delete((req, res)=>{
        const username = req.params.username
        User.deleteOne({username: username}, err=>{
            err ? res.send(err) : res.send("Delete Success!");
        })
    });

app.listen(3000, () => { console.log("Server Running Successfully!") });