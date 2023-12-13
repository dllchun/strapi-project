"use strict";

/**
 * reminder controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::reminder.reminder",
  ({ strapi }) => ({
    async createReminder(ctx) {
      const newReminder = await strapi
        .service("api::reminder.reminder")
        .create(ctx);

      // const recipientPhone = newReminder.care_recipient_phone;
      // const reminderContent = newReminder.title;
      // try {
      //   if (recipientPhone) {
      //     console.log("loading call service");
      //     await strapi.service("api::call.call").call({
      //       twiml: `<Response><Say voice="Google.yue-HK-Standard-A" >${reminderContent}</Say></Response>`,
      //       to: recipientPhone,
      //     });
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      const sanitizedEntity = await this.sanitizeOutput(newReminder, ctx);
      return this.transformResponse(sanitizedEntity);

      //send a post request to create new reminder
    },
  })
);
