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
exports.WsClient = void 0;
class WsClient {
    constructor(user, onMessageCallback) {
        this.onPayloadReceived = (payloadData) => __awaiter(this, void 0, void 0, function* () {
            console.log('Payload: ');
            // TODO validate input data
            console.log(payloadData);
            this.onMessageCallback(this.user, payloadData);
        });
        this.onConnectionClosed = (connection) => {
            console.log('Connection closed: ' + connection);
            this.closeConnection(connection);
        };
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
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const connection of this.connections) {
                yield this.sendOnOneConnection(connection, message);
            }
        });
    }
    sendOnOneConnection(connection, message) {
        return new Promise((resolve, reject) => {
            try {
                connection.send(message, (error) => {
                    if (error) {
                        this.closeConnection(connection);
                    }
                    resolve();
                });
            }
            catch (e) {
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
        }
        catch (e) {
            console.log('Error at terminating connection');
        }
        this.connections.delete(connection);
    }
}
exports.WsClient = WsClient;
//# sourceMappingURL=ws-client.js.map