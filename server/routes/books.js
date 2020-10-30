// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

  // Code to display add forms and passing a blank books variable to avoid errors 
  res.render('books/details', {
    title: 'Add Book',
    books: '', 
  })

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

  // code to process book entry
  let newBook = book({
    "Title": req.body.title,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre,
  });

  book.create(newBook, (err, book) =>{
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      // refresh the book list
      res.redirect('/books');
    }
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

  // code to pass existing book data and display book detail page to edit entry
  let id = req.params.id;
  book.findById(id, (err, editBook) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      //show the edit view
      res.render('books/details', {
        title: 'Edit Book', 
        books: editBook,
      })
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    // code to process updated values to the book entry 
    let id = req.params.id;

    let updateBook = book({
      _id: id,
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre,
    });

    book.updateOne({ _id: id }, updateBook, (err) => {
      if (err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the book list
        res.redirect('/books');
      }
    });

});

// GET - process the delete by book id
router.get('/delete/:id', (req, res, next) => {

  // code to find the book by id and delete it from db 
  let id = req.params.id;

  book.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the book list
      res.redirect('/books');
    }
  });

});


module.exports = router;
