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
const { link } = require("fs");


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
app.set("view engine", "ejs");
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
        let { username, email, password, confirmpassword } = req.body;


        // Check if the passwords match
        if (password !== confirmpassword) {
            return res.render("./errors/notequal.ejs");
        }

        // Proceed with registration if passwords match
        const newUser = new User({ email, username });

        // Register user
        await User.register(newUser, password);

        // Flash success message and redirect to home
        req.flash("success", "User registered successfully.");
        let userId = newUser._id.toString();
        console.log
        // console.log(newUser._id);
        return res.redirect(`/profile/${userId}`);

    } catch (error) {
        // Flash error message and render the error page
        req.flash("error", error.message);
        return res.render("./errors/signuperror.ejs");
    }
});

app.get("/loginerror", (req, res) => {

    res.render("./errors/loginerror.ejs");
})
// Login route (GET)
app.get("/login", async (req, res) => {

    await res.render("login.ejs");
});

// Login route (POST)
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/loginerror",
    failureFlash: true
}), async (req, res) => {

    try {
        let user = req.body;
        console.log(user);
        if(!user){
            res.redirect("/loginerror");
        }
        await res.render("./user/userprofile.ejs",{user});  
    } catch (error) {
        res.render("./errors/loginerror.ejs");
    }
}); 


//admin route 

app.get("/admin",(req,res)=>{
    res.render("./admin/admin.ejs");
})

app.get("/assist", async (req, res) => {
    await res.redirect("https://fitnutri.onrender.com/");
});

//user profile route

app.get("/profile/:id", async (req, res) => {

    try {

        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            res.send("user doesn't exists");
            return res.redirect("/signup");
        }
        await res.render("./user/userprofile.ejs", { user });
    } catch (error) {
        console.log(error.message);
        res.redirect("/signup");
    }

});

app.get("/profile/:id/details",async (req,res)=>{

    res.render("./user/details.ejs");
});

app.get("/userprofiledemo",(req,res)=>{

    res.render("./user/userprofiledemo.ejs");
})
// Start server

app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});
