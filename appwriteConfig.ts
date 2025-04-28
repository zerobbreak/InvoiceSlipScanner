import { Client, Databases } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("680e7ba900293eaf3b0f")
  .setPlatform("com.company.SlipScanner")

export const databases = new Databases(client);
export const DATABASE_ID = "680e7e88002c6e981ae4"; // Replace with your Appwrite database ID
export const COLLECTION_ID = {
  DOCUMENTS: "680e8c01001de16e6151",
  BUDGETS: "680e8d49002988bf8d4e",
  CATEGORIES: "680e8e080032a7f2c5fd",
};