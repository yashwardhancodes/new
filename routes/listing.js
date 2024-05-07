const express=require("express");
const router=express.Router();
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


const wrapAsync=require("../utils/wrapAsync.js");
const listing=require("C:/Users/TheYashvardhan/Desktop/map/ac/majorproject/models/listing.js");
const ExpressError=require("../utils/expressError.js");
const {isLoggedIn}=require("../middleware.js");


//index route
router.get("/",async (req,res)=>{
    const allListings=await listing.find({});
    res.render("../views/listings/index.ejs",{allListings});
    
   });

//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("../views/listings/new.ejs");
  });


//show route

router.get("/:id",async (req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id).populate("owner");
    if(!Listing){
      req.flash("error","listing you requested for does not exists");
      res.redirect("/listings");

    }
    res.render("../views/listings/show.ejs",{Listing});
});



//create Route
router.post("/",upload.single('listing[image]'),wrapAsync (async(req,res,next)=>{
   
    let url=req.file.path;
    let filename=req.file.filename;
   
    if(!req.body.listing){
      throw new ExpressError(400,"Send valid data for listing");
   }
   const newListing=new listing(req.body.listing);
   newListing.image={url,filename};
   newListing.owner=req.user._id;   
   await newListing.save();
   req.flash("success","new listing created");
   res.redirect('/listings')


}));



//edit route
router.get("/:id/edit",isLoggedIn,async (req,res)=>{
const {id}=req.params;
const Listing=await listing.findById(id);
res.render("listings/edit.ejs",{Listing});
});



//update route
router.put("/:id",isLoggedIn,upload.single('listing[image]'),wrapAsync(async(req,res,next)=>{
if(!req.body.listing){
   throw new ExpressError(400,"Send valid data for listing");
}
const {id}=req.params;
   const Listing= await listing.findById(id);
   if(!res.locals.currUser && Listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error , you dont have the right to update the listing");
      res.redirect(`/listings/${id}`);
   }

   if(typeof req.file !=="undefined"){
   let product = await listing.findByIdAndUpdate(id,{...req.body.listing});
   let url=req.file.path;
    let filename=req.file.filename;
    product.image={url,filename};
    await product.save();
   }
   res.redirect("/listings")


}));

//delete route
router.delete("/:id",isLoggedIn,async(req,res)=>{
let {id}=req.params;
let deletedlisting=await listing.findByIdAndDelete(id);
console.log(deletedlisting);
res.redirect("/listings");
});

module.exports=router;