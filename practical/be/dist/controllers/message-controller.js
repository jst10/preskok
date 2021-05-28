"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
var MessageController;
(function (MessageController) {
    const messages = [];
    function getMessage() {
        return messages;
    }
    MessageController.getMessage = getMessage;
    function createMessage(message) {
        messages.push(message);
        return message;
    }
    MessageController.createMessage = createMessage;
})(MessageController = exports.MessageController || (exports.MessageController = {}));
//# sourceMappingURL=message-controller.js.map