let firebaseAdmin = require("firebase-admin");
const { firebaseDB } = require("../utility/config");
const serviceAccount = require('../creds/configFile.json');

const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
    // databaseURL: firebaseDB,
});

module.exports = {
    firebaseApp
}