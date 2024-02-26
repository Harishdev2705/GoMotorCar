// const admin = require("firebase-admin")
// const serviceAcount = require("../creds/configFile.json");

const { firebaseApp } = require("../helper/firebase");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAcount)
// })

const sendNotificationIOSAndAndroid = async ( fcmToken, title, data ) => {

    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    const options =  notification_options
    const message = {
        notification: {
           data: data.toString(),
           title: title
        },
        data: {
            data: data.toString(),
            title: title
         },
      };

    firebaseApp.messaging().sendToDevice(fcmToken, message, options)
    .then(response => {
        console.log("Notification sent successfully")
    })
    .catch(error => {
        console.log(error);
    });

}

module.exports = {
    sendNotificationIOSAndAndroid
};
