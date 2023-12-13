"use strict";

/**
 * reminder service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::reminder.reminder", ({ strapi }) => ({
  async create(ctx) {
    const {
      title,
      care_recipient,
      care_recipient_phone,
      remind_date,
      regular_7days,
      regular_4weeks,
      remind_counter,
    } = ctx.request.body.data;

    const user = ctx.state.user;
    const remind_date_formatted = remind_date.toString().slice(0, 16);

    return await strapi.entityService.create("api::reminder.reminder", {
      data: {
        title: title,
        care_recipient: care_recipient,
        care_recipient_phone: care_recipient_phone,
        remind_date: remind_date,
        remind_date_formatted: remind_date_formatted,
        regular_7days: regular_7days,
        regular_4weeks: regular_4weeks,
        remind_counter: remind_counter,
        caregiver: user.id,
      },
      populate: "*",
    });
  },
}));
