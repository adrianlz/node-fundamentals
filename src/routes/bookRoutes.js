const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoute');

const bookRouter = express.Router();
let books = [];
function router(nav) {
  bookRouter.route('/').get((req, res) => {
    (async function query() {
      debug('pp1');
      const request = new sql.Request();
      const result = await request.query('select * from books');
      books = result.recordset;
      debug(`retrieved books from db: ${JSON.stringify(books)}`);
      res.render('bookListView', {
        nav,
        title: 'Library',
        books
      });
    }());
  });

  bookRouter.route('/:id')
    .get((req, res) => {
      // const { id } = req.params;
      res.render('bookView', {
        nav,
        title: 'Library',
        books: []
      });
    });
  return bookRouter;
}

module.exports = router;
