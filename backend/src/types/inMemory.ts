export interface UrlEntry {
  id: string;
  url: string;
  // domain: string;
  alias: string;
  updated: Date;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  urls: UrlEntry[];
}
