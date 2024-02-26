const {
    twilioAccoutSid,
    twilioAuthToken,
    twilioPhoneNumber,
} = require("../utility/config");

const client = require("twilio")(twilioAccoutSid, twilioAuthToken, {
    logLevel: "debug",
});

/**
 * @description - This function is used to send the sms
 * @param {string} to - mobile Number to which the sms is to be sent
 * @param {string} from - mobile number from which the sms is to be sent
 * @param {string} body - body of the sms
 * @returns {promise} -- Returns the promise of send sms
 */

const sendMessage = async ({ to, body }) => {
    try {
        return await client.messages.create({
            body,
            from: '+18886875608',
            to: '+917078285593' ,
        });
    } catch (error) {
        logger.error(error);
        throw new Error(error.message);
    }
};
module.exports = {
    sendMessage
};