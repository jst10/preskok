import {User} from '../models/user';

import {v4 as uuidv4} from 'uuid';

export namespace UserController {
  const usersDictById: {} = {};
  const usersDictByUsernamePassword: {} = {}; // since I do not have slat hashes this will be good enough

  export function getUsers(): User[] {
    return Object.values(usersDictById);
  }

  export function createUser(username, password) {
    const userId = uuidv4();
    const user = new User(userId, username, password);
    const key = getUserKey(username, password);
    usersDictById[user.id] = user;
    usersDictByUsernamePassword[key] = user;
    // TODO notify all of them that new user was created
    return user;
  }

  export function getUser(userId: string): User {
    return usersDictById[userId];
  }

  export function authenticateOrCreate(username, password): User {
    const key = getUserKey(username, password);
    if (usersDictByUsernamePassword.hasOwnProperty(key)) {
      return usersDictByUsernamePassword[key]
    } else {
      return createUser(username, password)
    }
  }

  function getUserKey(username, password): string {
    return username + '-' + password;
  }
}


