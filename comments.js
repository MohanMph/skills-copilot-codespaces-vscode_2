// Create web server
// Create a web server that listens on port 3000 and serves a static website with comments
// The website should have a form to submit a new comment and list all comments below the form
// The comments should be stored in a file called comments.json
// The comments should persist when the server restarts

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/comments', (req, res) => {
  fs.readFile('comments.json', (err, data) => {
    if (err) {
      res.status(500).send('Could not read comments file');
      return;
    }

    const comments = JSON.parse(data);
    res.send(comments);
  });
});

app.post('/comments', (req, res) => {
  const comment = req.body.comment;

  if (!comment) {
    res.status(400).send('Comment is required');
    return;
  }

  fs.readFile('comments.json', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send('Could not read comments file');
      return;
    }

    const comments = JSON.parse(data || '[]');
    comments.push(comment);

    fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
      if (err) {
        res.status(500).send('Could not write comments file');
        return;
      }

      res.send('Comment added');
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});