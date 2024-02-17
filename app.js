const express=require('express');
const app=express();
const PORT=8080;
//session requirements
const session=require('express-session');

//antentication requirements
const passport=require('passport');
const LocalStrategy=require('passport-local');
//model requiremnts
const User=require("./models/user.js");
const path=require('path');
const methodOverride=require('method-override');
//flash for messages
const flash=require('connect-flash');
app.use(flash());
//sessions
//session
const sessionOptions={
    secret:'supersecretcode',
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }

}
app.use(session(sessionOptions));
//all the requirements for ejs
const ejsMate=require('ejs-mate');
app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
//for user autentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//for mongodb
const mongoose = require('mongoose');
const MONGO_URL="mongodb+srv://yadlamaniymn2005:ymn336699@cluster0.ituafhp.mongodb.net/CM";
main().then(()=>{
    console.log("DB is runing");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}
//for local variables
app.use((req,res,next)=>{
    // res.locals.success=req.flash('success');
    // res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
});

//for port of the express
app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})
app.get("/",(req,res)=>{
    res.render("./login.ejs");
})
app.get("/login",(req,res)=>{
    res.render("./login.ejs");
})
app.post("/login",passport.authenticate('local',{failureRedirect:'/login', 
failureFlash: true}),(req,res)=>{
   
    
    
    res.redirect("/home");
})
app.get('/signup',(req,res)=>{
    res.render("./signup.ejs");
})
app.post('/signup',async(req,res)=>{
    
        let {username,email,password,phno}=req.body;
    const newUser=new User({email,username,phno});
   const registeredUser=await  User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        req.flash('error',"Invalid details");
    }
     
   res.redirect("/login");
   });
  
    
    
   
});

app.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are looged out!");
        
        res.redirect("/login");
        
    })
})
// app.get('/login-fail',(req,res)=>{
//     req.flash('error',"Invalid username or password");
//     res.render("./login-fail.ejs");
// })
app.get("/home",(req,res)=>{
    res.render("./home.ejs");
})