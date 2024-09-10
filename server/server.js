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

app.get("/home/login",(req,res)=>{

    res.send("<h1>Login from here</h1>.")
})

app.get("/home/signup",(req,res)=>{

    res.send("<h1>Signup from here</h1>.")
})
app.listen(port,()=>{

    console.log("server is listening to port : 8080");
})
