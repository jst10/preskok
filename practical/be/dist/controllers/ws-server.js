"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsServer = void 0;
const WebSocket = require('ws');
const uuid_1 = require("uuid");
const ws_client_1 = require("./ws-client");
const user_controller_1 = require("./user-controller");
const payload_entity_1 = require("../enums/payload-entity");
const payload_action_1 = require("../enums/payload-action");
const message_controller_1 = require("./message-controller");
const clients = {};
let wss;
var wsServer;
(function (wsServer) {
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            const port = 4000;
            console.log('Starting web socket server on: ' + port);
            wss = new WebSocket.Server({ port: port, verifyClient: verifyClient });
            wss.on('connection', (connection, req) => {
                connection.id = uuid_1.v4();
                console.log('Connection opened' + connection.id);
                connection.isAlive = true;
                const user = req.user;
                if (!clients.hasOwnProperty(user.id)) {
                    clients[user.id] = new ws_client_1.WsClient(user, onPayloadCallback);
                }
                clients[user.id].insertConnection(connection);
            });
        });
    }
    wsServer.init = init;
    function onPayloadCallback(user, payload) {
        message_controller_1.MessageController.createMessage(payload);
        sendPayloadToAll({ user, payload });
    }
    // TODO
    function handlePayload(user, payload) {
        switch (payload.entity) {
            case payload_entity_1.PayloadEntity.MESSAGE:
                handleMessagePayload(user, payload);
                break;
            case payload_entity_1.PayloadEntity.USER:
                handleUserPayload(user, payload);
                break;
        }
    }
    // TODO
    function handleMessagePayload(user, payload) {
        const data = payload.data;
        switch (payload.action) {
            case payload_action_1.PayloadAction.CREATE:
                break;
            case payload_action_1.PayloadAction.DELETE:
                break;
            case payload_action_1.PayloadAction.UPDATE:
                break;
        }
    }
    // TODO
    function handleUserPayload(user, payload) {
        const data = payload.data;
        switch (payload.action) {
            case payload_action_1.PayloadAction.CREATE:
                break;
            case payload_action_1.PayloadAction.DELETE:
                break;
            case payload_action_1.PayloadAction.UPDATE:
                break;
        }
    }
    function dropUser(userId) {
        const client = clients[userId];
        if (client) {
            client.closeAllConnections();
            delete clients[userId];
        }
    }
    wsServer.dropUser = dropUser;
    function sendPayload(payload, recipients) {
        for (const recipient of recipients) {
            const client = clients[recipient];
            if (client) {
                client.send(JSON.stringify(payload));
            }
        }
    }
    wsServer.sendPayload = sendPayload;
    function sendPayloadToAll(payload) {
        for (const client of Object.values(clients)) {
            client.send(JSON.stringify(payload));
        }
    }
    wsServer.sendPayloadToAll = sendPayloadToAll;
    function getQueryParamsFromUrl(url) {
        const result = {};
        if (url && url.length) {
            if (url.indexOf('?') != -1) {
                url = url.substring(url.indexOf('?') + 1);
            }
            const params = url.split('&');
            for (const param of params) {
                const data = param.split('=');
                result[data[0]] = data[1];
            }
        }
        return result;
    }
    function verifyClient(info, callback) {
        console.log('Verify client');
        const params = getQueryParamsFromUrl(info.req.url);
        if (!params || !params['username'] || !params['password']) {
            console.log('Unauthorized attempt to connecting on ws');
            callback(false, 401, 'Unauthorized');
        }
        // if (!info.req.headers.authorization) {
        //   console.log('Unauthorized attempt to connecting on ws');
        //   callback(false, 401, 'Unauthorized');
        // }
        try {
            console.log(params);
            // let b64string = info.req.headers.authorization.split(' ')[1];
            // let buf = Buffer.from(b64string, 'base64'); // Ta-da
            // let userPass = buf.toString().split(':');
            info.req.user = user_controller_1.UserController.authenticateOrCreate(params['username'], params['password']);
            callback(true);
        }
        catch (error) {
            console.log('Not ok something in auth data');
            callback(false, 401, 'Unauthorized');
        }
    }
})(wsServer = exports.wsServer || (exports.wsServer = {}));
//# sourceMappingURL=ws-server.js.map