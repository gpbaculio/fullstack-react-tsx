import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from 'body-parser';
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
const main = express();
const contactsCollection = 'contacts';
main.use('/api', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// webApi is your functions name, and you will pass main as
// a parameter
// Add new contact
app.post('/contacts', (req, res) => {
  firebaseHelper.firestore.createNewDocument(db, contactsCollection, req.body);
  res.send('Create a new contact');
});
export const webApi = functions.https.onRequest(main);
