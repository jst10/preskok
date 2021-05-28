import express = require('express');
import {UserController} from './controllers/user-controller';
import {wsServer} from './controllers/ws-server';
import {MessageController} from './controllers/message-controller';

var cors = require('cors')

const bodyParser = require('body-parser');

const app: express.Application = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/users', function (req, res) {
  const users = UserController.getUsers()
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify(users));
});

app.get('/messages', function (req, res) {
  const message = MessageController.getMessage()
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify(message));
});


app.post('/users', function (req, res) {
  console.log('Got body:', req.body);
  if (!req.body.username || !req.body.password) {
    res.status(400).send("No username or password provided");
  } else {
    const user = UserController.authenticateOrCreate(req.body.username, req.body.password);
    res.setHeader('Content-Type', 'application/json');
    res.status(201).end(JSON.stringify(user));
  }
})

wsServer.init().then(() => {
  app.listen(3000, function () {
    console.log('App is listening on port 3000!');
  });
});
