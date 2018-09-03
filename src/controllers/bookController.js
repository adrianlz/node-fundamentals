const debug = require('debug')('app:bookController');
const { MongoClient, ObjectID } = require('mongodb');

function bookController(bookService, nav) {
  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        const col = await db.collection('books');

        const books = await col.find().toArray();
        debug(books);
        res.render('bookListView', {
          nav,
          title: 'Library',
          books
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function getById(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    const { id } = req.params;
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        const col = await db.collection('books');

        const book = await col.findOne({ _id: new ObjectID(id) });
        debug(book);
        book.details = await bookService.getBookById(book.bookId);
        res.render('bookView', {
          nav,
          title: 'Library',
          book
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      debug('not logged in...redirecting to home page');
      res.redirect('/');
    }
  }

  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = bookController;
