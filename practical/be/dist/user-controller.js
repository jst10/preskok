"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var UserController;
(function (UserController) {
    const usersDict = {};
    function getUsers() {
        return Object.values(usersDict);
    }
    function addUser(user) {
        if (usersDict.hasOwnProperty(user.id)) {
            usersDict[user.id] = usersDict;
        }
    }
    function removeUser() {
        return Object.values(usersDict);
    }
    function getUser(userId) {
        return usersDict[userId];
    }
})(UserController = exports.UserController || (exports.UserController = {}));
//# sourceMappingURL=user-controller.js.map