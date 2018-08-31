const express = require('express');
const debug = require('debug')('app:adminRoutes');
const { MongoClient } = require('mongodb');

const adminRouter = express.Router();

const books = [
  {
    title: 'book1',
    genre: 'genre1',
    author: 'author1',
    read: false
  },
  {
    title: 'book2',
    genre: 'genre2',
    author: 'author2',
    read: false
  },
  {
    title: 'book3',
    genre: 'genre3',
    author: 'author3',
    read: false
  },
  {
    title: 'book4',
    genre: 'genre4',
    author: 'author4',
    read: false
  },
  {
    title: 'book5',
    genre: 'genre5',
    author: 'author5',
    read: false
  },
  {
    title: 'book6',
    genre: 'genre6',
    author: 'author6',
    read: false
  },
  {
    title: 'book7',
    genre: 'genre7',
    author: 'author7',
    read: false
  },
  {
    title: 'book8',
    genre: 'genre8',
    author: 'author8',
    read: false
  }
];

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(books);
          debug(response);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return adminRouter;
}


module.exports = router;
