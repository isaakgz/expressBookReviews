const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


app.use("/customer/auth/*", function auth(req,res,next){

    //check if the user is authenticated
    if (req.session.authorization){
       const token = req.session.authorization["token"];
        //verify the token
        jwt.verify(token, 'secretekey', (err, user)=>{
            //check if the token is valid
            if(err){
                return res.status(403).json({message:"invalid token"})
            } else{
                req.user = user;
                next();
            }
        })
        } else{
            res.status(403).json({message:"user not authenticated"})

        }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
