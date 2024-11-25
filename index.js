require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Step 1: Create session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

// Step 2: Use passport middleware
app.use(passport.session());
app.use(passport.initialize());

// Step 3: Initialize Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback", // Match with server port
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// step:4 serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});



// step 5 : starts creating routes

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect:'/profile',
  failureRedirect: "/" 
}));

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${req.user.displayName}`);
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
