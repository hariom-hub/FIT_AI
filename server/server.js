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

// MongoDB connection
const mongoUrl = 'mongodb://127.0.0.1:27017/Fit_AI';
main().then(() => console.log("db connected successfully")).catch(console.log);

async function main() {
    await mongoose.connect(mongoUrl);
}

// Set up session and flash
app.use(session({
    secret: 'SECRET_SESSION_KEY',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());  // Required for persistent login sessions

// Set up view engine
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Passport LocalStrategy setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => {
    res.send("<h1>You are on the root path</h1>");
});

app.get("/home", (req, res) => {
    res.render("home.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Signup route
app.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        await User.register(newUser, password);
        req.flash("success", "User registered successfully.");
        res.redirect("/home");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
});

// Login route (GET)
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Login route (POST)
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/home");
});

// Start server
app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});
