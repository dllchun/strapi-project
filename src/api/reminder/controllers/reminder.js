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

      const sanitizedEntity = await this.sanitizeOutput(newReminder, ctx);
      return this.transformResponse(sanitizedEntity);

      //send a post request to create new reminder
    },

    async testRoute(ctx) {
      const body = await strapi.service("api::reminder.reminder").openai(ctx);
      return body;
    },
  })
);
