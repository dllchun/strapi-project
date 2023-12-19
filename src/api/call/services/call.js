"use strict";

/**
 * call service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::call.call", ({ strapi }) => ({
  async call({ twiml, to }) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const callFrom = process.env.TWILIONUM;
    const client = require("twilio")(accountSid, authToken);

    client.calls
      .create({
        twiml,
        to,
        from: callFrom,
      })
      .then((call) => console.log(call.status));

    return await strapi.entityService.create("api::call.call", {
      data: {
        phone_to: to,
        timestamp: Date.now(),
        publishedAt: Date.now(),
      },
    });
  },
}));
