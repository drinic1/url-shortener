export interface UrlEntry {
  id: string;
  url: string;
  // domain: string;
  alias: string;
  updated: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  // password: string;
  urls: UrlEntry[];
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}

export interface ErrorMessage {
  header: string;
  message: string;
}

export class MessageError {
  constructor(header: string, message: string) {
    this.header = header;
    this.message = message;
  }
  header: string;
  message: string;
}
