import { Client, Databases } from 'appwrite';

export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('YOUR_PROJECT_ID'); // Replace with your Appwrite project ID

export const databases = new Databases(client);
export const DATABASE_ID = 'YOUR_DATABASE_ID'; // Replace with your Appwrite database ID
export const COLLECTION_ID = 'YOUR_COLLECTION_ID'; // Replace with your Appwrite collection ID
