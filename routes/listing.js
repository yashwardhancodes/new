const express=require("express");
const router=express.Router();


const wrapAsync=require("../utils/wrapAsync.js");
const listing=require("C:/Users/TheYashvardhan/Desktop/map/ac/majorproject/models/listing.js");
const ExpressError=require("../utils/expressError.js");



//index route
router.get("/",async (req,res)=>{
    const allListings=await listing.find({});
    res.render("../views/listings/index.ejs",{allListings});
    
   });

//new route
router.get("/new",(req,res)=>{
    res.render("../views/listings/new.ejs");
  });


//show route

router.get("/:id",async (req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id);
    res.render("../views/listings/show.ejs",{Listing});
});



//create Route
router.post("/",wrapAsync (async(req,res,next)=>{
    if(!req.body.listing){
       throw new ExpressError(400,"Send valid data for listing");
    }
   const newListing=new listing(req.body.listing);
      
   await newListing.save();
   res.redirect('/listings')


}));

//edit route
router.get("/:id/edit",async (req,res)=>{
const {id}=req.params;
const Listing=await listing.findById(id);
res.render("listings/edit.ejs",{Listing});
});



//update route
router.put("/:id",wrapAsync(async(req,res,next)=>{
if(!req.body.listing){
   throw new ExpressError(400,"Send valid data for listing");
}
const 
{id}=req.params;
   await listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect("/listings")


}));

//delete route
router.delete("/:id",async(req,res)=>{
let {id}=req.params;
let deletedlisting=await listing.findByIdAndDelete(id);
console.log(deletedlisting);
res.redirect("/listings");
});

module.exports=router;