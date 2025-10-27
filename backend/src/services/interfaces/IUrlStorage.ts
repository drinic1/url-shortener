import { NewUrl } from "../../types/incoming";
import { UrlEntry } from "../../types/inMemory";

export interface IUrlStorage {
  getByAlias: (alias: string) => Promise<UrlEntry | undefined>;
  createEntry: (newUrl: NewUrl, userId: string) => Promise<UrlEntry>;
  updateAlias: (id: string, alias: string, userId: string) => Promise<void>;
  deleteEntry: (id: string, userId: string) => Promise<boolean>;
  getUniqueAlias: () => Promise<string>;
}
