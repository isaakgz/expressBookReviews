const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
// const { isValid } = require("./auth_users.js");
const regd_users = express.Router();

let users = [];


// a function to check if the username is valid
const isValid = (username)=>{ 
  if (!username || username === "" || username === "undefined" || username === null ) {
    return false;
  } else {
    return true;
  }
}

// a function to check if the user is registered
const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.filter((user)=>user.username ===username && user.password === password);
  if (user.length === 0){
    return false;
  } else{
    return true;
  }




}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password){
    return res.status(400).json({message: "MUst provide username and password"});
  }
  if (!isValid(username)){
    return res.status(400).json({message: "Invalid username"});
  }
  if (!authenticatedUser(username,password)){
    return res.status(401).json({message: "Invalid credential , please try again"});
  } else{

    //create a token
    const token  = jwt.sign({data:password}, "secretekey", {expiresIn: 60 * 60});

    //store the token in session storage
    req.session.authorization = {
      token: token,
      username: username
    }

    //send the token to the client
    return res.status(200).json({message: "User logged in", token: token});
 }
  
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const { review} = req.query;
  const username  = req.session.authorization["username"];
  let book = Object.values(books).filter((book)=>book.isbn === isbn);
  if (book.length === 0){
    return res.status(404).json({message: "Book not found"});
  }
  if (!review){
    return res.status(400).json({message: "Must provide a review"});
  }

    if(book[0].reviews.username === username){
      book[0].reviews.username = username;
      book[0].reviews.review = review;
      return res.status(400).json({message: "You have updated your review",  review:book[0].reviews}); 
    } else{
      book[0].reviews.username = username;
      book[0].reviews.review = review;
      
      return res.status(200).json({message: "Review added", review: review, review :book[0].reviews});
    }
  }); 

  //delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];

    let book = Object.values(books).filter((book) => book.isbn === isbn);
    if (book.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book[0].reviews[username]) {
      return res.status(400).json({ message: "You have not reviewed this book" });
    }

    delete book[0].reviews[username];

    return res.status(200).json({ message: "Review deleted", review: book[0].reviews });
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
