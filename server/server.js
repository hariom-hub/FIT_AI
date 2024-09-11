const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
app.set("views engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));


//home route
app.get("/home",(req,res)=>{

    res.render("home.ejs");
})

app.get("/login",(req,res)=>{

    res.send("login.ejs");
})

app.get("/signup",(req,res)=>{

    res.send("signup.ejs");
})
app.listen(port,()=>{

    console.log("server is listening to port : 8080");
})
