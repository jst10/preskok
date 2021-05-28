"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../models/user");
const uuid_1 = require("uuid");
var UserController;
(function (UserController) {
    const usersDictById = {};
    const usersDictByUsernamePassword = {}; // since I do not have slat hashes this will be good enough
    function getUsers() {
        return Object.values(usersDictById);
    }
    UserController.getUsers = getUsers;
    function createUser(username, password) {
        const userId = uuid_1.v4();
        const user = new user_1.User(userId, username, password);
        const key = getUserKey(username, password);
        usersDictById[user.id] = user;
        usersDictByUsernamePassword[key] = user;
        // TODO notify all of them that new user was created
        return user;
    }
    UserController.createUser = createUser;
    function getUser(userId) {
        return usersDictById[userId];
    }
    UserController.getUser = getUser;
    function authenticateOrCreate(username, password) {
        const key = getUserKey(username, password);
        if (usersDictByUsernamePassword.hasOwnProperty(key)) {
            return usersDictByUsernamePassword[key];
        }
        else {
            return createUser(username, password);
        }
    }
    UserController.authenticateOrCreate = authenticateOrCreate;
    function getUserKey(username, password) {
        return username + '-' + password;
    }
})(UserController = exports.UserController || (exports.UserController = {}));
//# sourceMappingURL=user-controller.js.map