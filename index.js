const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const rawjs = require('raw.js');
const config = require('config.js');

const app = express();
const PORT = 3000;
const reddit = new rawjs("subreddit-carousel");
reddit.setupOAuth2(config.CLIENT_ID, config.SECRET, "http://www.example.com/redditoauth");

reddit.auth({"username": config.USER, "password": config.PW}, function(err, response) {
  if(err) {
    console.log("Unable to authenticate user: " + err);
  } else {
    console.log("User authetnicated!");
      // The user is now authenticated. If you want the temporary bearer token, it's available as response.access_token
      // and will be valid for response.expires_in seconds.
      // raw.js will automatically refresh the bearer token as it expires. Unlike web apps, no refresh tokens are available.
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.static(__dirname + '/client/dist'));
app.use('/assets', express.static(__dirname + '/client/src/assets'));

app.post('/api/saveMarker', (req, res) => {
  console.log(`geoJSON: ${JSON.stringify(req.body)}`);
})

app.listen(PORT, () => {console.log(`Listening on ${PORT}!`)});
