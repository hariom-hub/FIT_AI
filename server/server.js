const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


const mongoUrl = 'mongodb://127.0.0.1:27017/Fit_AI';
main().then(() => {

    console.log("db connected successfully");
}).catch((error) => {
    console.log(error);
});

async function main() {

    await mongoose.connect(mongoUrl);
}

app.use(flash());
app.use(passport.initialize());

const sessionOptions = {
    secret: 'SECRET_SESSION_KEY', // Replace with a strong, unique secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` if using HTTPS
};

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session(sessionOptions));

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get("/", (req, res) => {

    res.send("<h1>You are on the root path</h1>");
});


app.get("/home", (req, res) => {

    res.render("home.ejs");
})

app.get("/login", (req, res) => {

    res.render("login.ejs");
})


//route to signup(enter signup details)
app.get("/signup", (req, res) => {

    res.render("signup.ejs");
});

//post route to submit the form

app.post("/signup",async (req,res)=>{

    try{

        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        res.redirect("/home");
        req.flash("success","user registered successfully.");
    }catch(error){
        alert("user with a same username already exists");
        res.redirect("/signup");
    }

})

app.listen(port, () => {

    console.log("server is listening to port : 8080");
})
