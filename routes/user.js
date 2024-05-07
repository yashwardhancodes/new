const express=require("express");
const Router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirecturl } = require("../middleware.js");

Router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

Router.post("/signup",wrapAsync(async(req,res)=>{
   try{
    let{username,email,password}=req.body;
    let fakeUser= new User({email,username});

   let registeredUser=await User.register(fakeUser,password);
   console.log(registeredUser);
   req.login(registeredUser,function(err){
    if(err){
        return next(err);
    }
    req.flash("success","user was registered successfully. welcome to wanderlust");
    res.redirect("/listings");
   })
 
   }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
   }

}));


Router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

Router.post("/login",saveRedirecturl,
passport.authenticate( "local",{failureRedirect:"/login",failureFlash:true}  ),
 async(req,res)=>{
          req.flash("success","welcome back to wanderlust!");
          let redirectUrl=res.locals.redirectUrl || "/listings";
          res.redirect(redirectUrl);
});

Router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
})


module.exports=Router;