import {User} from '../models/user';

const WebSocket = require('ws');
import {v4 as uuidv4} from 'uuid';
import {WsClient} from './ws-client';
import {UserController} from './user-controller';
import {Payload} from '../models/payload';
import {PayloadEntity} from '../enums/payload-entity';
import {PayloadAction} from '../enums/payload-action';
import {Message} from '../models/message';
import {MessageController} from './message-controller';


const clients: { [key: string]: WsClient } = {};
let wss;

export namespace wsServer {

  export async function init() {
    const port = 4000;
    console.log('Starting web socket server on: ' + port);
    wss = new WebSocket.Server({port: port, verifyClient: verifyClient});
    wss.on('connection', (connection, req) => {
      connection.id = uuidv4();
      console.log('Connection opened' + connection.id);
      connection.isAlive = true;
      const user: User = req.user;

      if (!clients.hasOwnProperty(user.id)) {
        clients[user.id] = new WsClient(user, onPayloadCallback);
      }
      clients[user.id].insertConnection(connection);
    });
  }

  function onPayloadCallback(user, payload) {
    MessageController.createMessage(payload);
    sendPayloadToAll({user, payload});
  }

  // TODO
  function handlePayload(user: User, payload: Payload) {
    switch (payload.entity) {
      case PayloadEntity.MESSAGE:
        handleMessagePayload(user, payload);
        break;
      case PayloadEntity.USER:
        handleUserPayload(user, payload);
        break;
    }
  }

  // TODO
  function handleMessagePayload(user: User, payload: Payload) {
    const data: Message = payload.data as Message;
    switch (payload.action) {
      case PayloadAction.CREATE:
        break;
      case PayloadAction.DELETE:
        break;
      case PayloadAction.UPDATE:
        break;
    }
  }

  // TODO
  function handleUserPayload(user: User, payload: Payload) {
    const data: User = payload.data as User;
    switch (payload.action) {
      case PayloadAction.CREATE:
        break;
      case PayloadAction.DELETE:
        break;
      case PayloadAction.UPDATE:
        break;
    }
  }

  export function dropUser(userId: string) {
    const client = clients[userId];
    if (client) {
      client.closeAllConnections();
      delete clients[userId];
    }
  }

  export function sendPayload(payload: any, recipients: string[]) {
    for (const recipient of recipients) {
      const client: WsClient = clients[recipient];
      if (client) {
        client.send(JSON.stringify(payload));
      }
    }
  }

  export function sendPayloadToAll(payload: any) {
    for (const client of Object.values(clients)) {
      client.send(JSON.stringify(payload));
    }
  }

  function getQueryParamsFromUrl(url) {
    const result = {};
    if (url && url.length) {
      if (url.indexOf('?') != -1) {
        url = url.substring(url.indexOf('?') + 1)
      }
      const params = url.split('&')
      for (const param of params) {
        const data = param.split('=');
        result[data[0]] = data[1];
      }
    }
    return result;
  }

  function verifyClient(info, callback: Function) {
    console.log('Verify client')
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
      console.log(params)
      // let b64string = info.req.headers.authorization.split(' ')[1];
      // let buf = Buffer.from(b64string, 'base64'); // Ta-da
      // let userPass = buf.toString().split(':');
      info.req.user = UserController.authenticateOrCreate(params['username'], params['password']);
      callback(true);
    } catch (error) {
      console.log('Not ok something in auth data');
      callback(false, 401, 'Unauthorized');
    }
  }
}
