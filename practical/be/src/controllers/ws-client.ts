import {User} from '../models/user';


export class WsClient {
  connections: Set<any>;
  user: User;
  onMessageCallback: Function;

  constructor(user: User, onMessageCallback) {
    this.connections = new Set();
    this.onMessageCallback = onMessageCallback;
    this.user = user;
  }

  insertConnection(connection) {
    this.connections.add(connection);
    connection.on('message', this.onPayloadReceived);
    connection.on('close', () => this.onConnectionClosed(connection));
    console.log('New connection from: ' + this.user.username);
  }

  onPayloadReceived = async (payloadData: string) => {
    console.log('Payload: ')
    // TODO validate input data
    console.log(payloadData)
    this.onMessageCallback(this.user, payloadData);

  }

  onConnectionClosed = (connection) => {
    console.log('Connection closed: ' + connection);
    this.closeConnection(connection);
  }

  async send(message) {
    for (const connection of this.connections) {
      await this.sendOnOneConnection(connection, message);
    }
  }

  private sendOnOneConnection(connection, message) {
    return new Promise((resolve, reject) => {
      try {
        connection.send(message, (error) => {
          if (error) {
            this.closeConnection(connection);
          }
          resolve();
        });
      } catch (e) {
        this.closeConnection(connection);
        resolve();
      }
    });
  }

  closeAllConnections() {
    for (const connection of this.connections) {
      this.closeConnection(connection);
    }
  }

  closeConnection(connection) {
    try {
      connection.terminate();
    } catch (e) {
      console.log('Error at terminating connection');
    }
    this.connections.delete(connection);
  }
}
