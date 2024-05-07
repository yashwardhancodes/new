module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error!, You must be logged in");
       return res.redirect("/login");
     }
     next();
}

module.exports.saveRedirecturl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    };
    next();
}