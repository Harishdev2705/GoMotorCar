const axios = require('axios');

module.exports = function (deviceToken, title, body, image, type) {
  const FCM_SERVER_KEY = 'AAAAiI-aG1w:APA91bGcyvtLW_2agwao9oG7cQ_I8if02ku4UpWgWm_TbAw9BOIh7CJ3xOifp6X7GbuvyBwvr7vfmfPDQ0pZ-Grb-KXw16vC4YAbgTed0-hcTpSxyEthE21THsdGIsSwOnXHKLsRibSz'; // Replace with your actual FCM Server Key
  const headers = {
    Authorization: `key=${FCM_SERVER_KEY}`,
    'Content-Type': 'application/json',
  };
  
  const payload = {
    notification: {
      title,
      body,
      image,
      sound: 'default',
      tag: type,
    },
    to: deviceToken,
  };
  
  (async () => {
    try {
      const response = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
        headers,
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  })();
}


