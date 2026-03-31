import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();

client
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69ca31ec0035ad745411");

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };