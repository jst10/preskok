import {User} from '../models/user';


export namespace MessageController {
  const messages = [];

  export function getMessage(): User[] {
    return messages;
  }

  export function createMessage(message) {
    messages.push(message);
    return message;
  }
}


