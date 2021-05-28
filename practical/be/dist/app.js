"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const user_controller_1 = require("./controllers/user-controller");
const ws_server_1 = require("./controllers/ws-server");
const message_controller_1 = require("./controllers/message-controller");
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.get('/users', function (req, res) {
    const users = user_controller_1.UserController.getUsers();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(users));
});
app.get('/messages', function (req, res) {
    const message = message_controller_1.MessageController.getMessage();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(message));
});
app.post('/users', function (req, res) {
    console.log('Got body:', req.body);
    if (!req.body.username || !req.body.password) {
        res.status(400).send("No username or password provided");
    }
    else {
        const user = user_controller_1.UserController.authenticateOrCreate(req.body.username, req.body.password);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).end(JSON.stringify(user));
    }
});
ws_server_1.wsServer.init().then(() => {
    app.listen(3000, function () {
        console.log('App is listening on port 3000!');
    });
});
//# sourceMappingURL=app.js.map