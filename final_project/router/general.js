const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//function to check if the user is already registered
const doesUserExist = (username) => {
  const user = users.filter((user)=>user.username ===username);
  if(user.length === 0){
    return false;
  } else{
    return true;
  }
}

//route to register a user
public_users.post("/register", (req,res) => {
  const {username, password}  = req.body;

  //check if username and password are provided
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }

  //check if the username is already registered
  if(doesUserExist(username)) {
    return res.status(400).json({message: "User already exists"});
  } else{
    users.push({username, password});
    return res.status(200).json({message: "User registered successfully"});
  }

});


//task 1
// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books))
  
// });

//task 10 using async
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    res.send(JSON.stringify(response.data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//task 2
// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   if(!isbn){
//     return res.status(404).json({message: "Isbn should be provided"});
//   }
//   //convert object to array and filter the book based on isbn
//   const book = Object.values(books).filter(book => book.isbn === isbn);
//   if(book.length === 0){
//     return res.status(404).json({message: "Book not found"});
//   }else{
//     return res.status(200).json(book);
  
//   }
//  });


//task 11 using async
// Get book details based on ISBN

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({ message: "Isbn should be provided" });
  }
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    const book = response.data;
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


//   //task 3
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   if(!author){
//     return res.status(404).json({message: "Author should be provided"});
//   }
//   //convert object to array and filter the book based on author
//   const book  = Object.values(books).filter((book)=>book.author ===author);
//   //check if book is found
//   if  (book.length ===0){
//     return res.status(404).json({message: "Book not found with the author"});
//   } else{
//     return res.status(200).json(book);
//   }
// });

//task 12 using async
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res.status(404).json({ message: "Author should be provided" });
  }
  try {
    const response = await axios.get(`http://localhost:5000/books`);
    const books = response.data;
    const filteredBooks = books.filter((book) => book.author === author);
    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "Book not found with the author" });
    } else {
      return res.status(200).json(filteredBooks);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


//task 4
// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   if(!title){
//     return res.status(404).json({message: "Title should be provided"});
//   }
//   //convert object to array and filter the book based on title
//   const book = Object.values(books).filter((book)=>book.title ===title);
//   //check if book is found
//   if  (book.length ===0){
//     return res.status(404).json({message: "Book not found with the title"});
//   } else{
//     return res.status(200).json(book);
//   }
  
// });

//task 13 using async
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res.status(404).json({ message: "Title should be provided" });
  }
  axios.get(`http://localhost:5000/books`)
    .then(response => {
      const books = response.data;
      const filteredBooks = books.filter((book) => book.title === title);
      if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "Book not found with the title" });
      } else {
        return res.status(200).json(filteredBooks);
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn){
    return res.status(404).json({message: "Isbn should be provided"});
  }
  //convert object to array and filter the book based on isbn
  const book = Object.values(books).filter(book => book.isbn === isbn);
  if(book.length === 0){
    return res.status(404).json({message: "Book not found"});
  }else{
    return res.status(200).json(book[0].reviews);
  }
});

module.exports.general = public_users;
