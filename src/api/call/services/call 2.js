"use strict";

/**
 * call service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::call.call", ({ strapi }) => ({
  async call({ phoneFrom, phoneTo, callContent }) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    client.calls
      .create({
        twiml: `<Response><Say>${callContent}</Say></Response>`,
        to: phoneTo,
        from: phoneFrom,
      })
      .then((call) => console.log(call.sid));
  },
}));
