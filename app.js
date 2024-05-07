if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const engine = require('ejs-mate');
const methodOverride=require("method-override");
const ExpressError=require("./utils/expressError.js");
const router=require("../majorproject/routes/listing.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const cookieParser=require("cookie-parser");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");



app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());







//const mongo_url='mongodb://127.0.0.1:27017/wanderlust';
const db_url=process.env.ATLAS_DB_URL;


const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo session store");
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true, 
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};


main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
console.log("error");
});


async function main(){
    await mongoose.connect(db_url);
}
app.get("/",(req,res)=>{
   
    res.send(`hi , i am root`);
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.get("/demouser",async(req,res)=>{
    let fakeUser= new User({
        email:"student@gmail.com",
        username:"delta-student",
    });

   let registeredUser=await User.register(fakeUser,"helloworld");
   res.send(registeredUser);
});



app.use("/listings",router);
app.use("/",userRouter);


// app.get("/listingSchema",async (req,res)=>{
//     let samplelisting=new listing({
//         title:"My new villa",
//         description:"bythe beach",
//         price:100,
//         location:"Calangutte,Goa",
//         country:"India",
//     });
//     await samplelisting.save();
//     console.log("samplelisting was saved");
//     res.send("succesfull testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})
//middleware to handle error
app.use((err,req,res,next)=>{
      let {statusCode=500,message="Something went wrong"}=err;
      res.status(statusCode).render("error.ejs",{err});
});


app.listen(3000,()=>{
    console.log("listening to the port");
});
