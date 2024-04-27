const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const engine = require('ejs-mate');
const methodOverride=require("method-override");
const ExpressError=require("./utils/expressError.js");
const router=require("../majorproject/routes/listing.js");
const session= require("express-sessions");
const cookieParser=require("cookie-parser");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());

// const sessionOptions={
//     secret:"omissweetboy",
//     resave: false,
//     saveUninitialised:true,
// };

// app.use(session(sessionOptions));

const mongo_url='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
console.log("error");
});


async function main(){
    await mongoose.connect(mongo_url);
}





app.get("/",(req,res)=>{
   
    res.send(`hi , i am root`);
});


app.use("/listings",router);


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


app.listen(8080,()=>{
    console.log("listening to the port");
});
