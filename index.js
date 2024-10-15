require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const dns = require('dns');
const { error } = require('console');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let db = []

app.post('/api/shorturl', function(req, res) {
  const { url } = req.body
  try {
    if(!url){
      return res.json({error: "invalid url"})
    }
    const parsedurl = new URL(url);
    const host = parsedurl.hostname
    dns.lookup(host, (err, address, family) => {
      if(err){
        return res.json({error: "invalid url"})
      }
      db.push({original_url: url, short_url: 1})
      return res.json({ original_url: url, short_url: 1})
    })
    
  } catch (error) {
    console.log(error)
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  const params  = parseInt(req.params.id)
  try {
    console.log(params)
    const urlEntry = db.find(entry => entry.short_url === params);
    if(urlEntry){
      res.redirect(urlEntry.original_url)
    }
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
