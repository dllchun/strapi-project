"use strict";

/**
 * reminder service
 */
const moment = require("moment");
const { OpenAI } = require("openai");

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
      remind_end_date,
    } = ctx.request.body.data;

    const user = ctx.state.user;
    const remind_date_formatted = remind_date.toString().slice(0, 16);

    //Define the Event End Date

    let total_day = 0;

    if (regular_7days) {
      total_day = 7;
    }

    const remind_end_date_full = moment(remind_date)
      .add(total_day, "days")
      .toDate();

    const remind_end_date_formatted = remind_end_date_full
      .toISOString()
      .slice(0, 16);

    // Create a service
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
        remind_end_date: remind_end_date_full,
        remind_end_date_formatted: remind_end_date_formatted,
        publishedAt: Date.now(),
        caregiver: user.id,
      },
      populate: "*",
    });
  },

  async openai(ctx) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
      ],
    });

    ctx.body = response.choices[0].message.content; // Display the generated response
    // ctx.body = "Hello Wolrd";

    return await ctx.body;
  },
}));
