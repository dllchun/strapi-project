module.exports = {
  reminderCall: {
    task: async () => {
      console.log("loading single reminder call");
      const currentTime = new Date();
      //Get only the time from currentTime (eg. 11:30)
      const timestamp = currentTime.toISOString().slice(0, 16);
      const reminderToBePublished = await strapi.db
        .query("api::reminder.reminder")
        .findMany({
          where: {
            regular_7days: {
              $eq: false,
            },
            regular_4weeks: {
              $eq: false,
            },
            remind_date_formatted: {
              $eq: timestamp,
            },
            cron_executed: {
              $eq: false,
            },
          },
        });
      await Promise.all(
        reminderToBePublished.map(async (reminder) => {
          const remind_counter = reminder.remind_counter;
          const updateReminder = strapi
            .service("api::reminder.reminder")
            .update(reminder.id, {
              data: {
                remind_counter: remind_counter + 1,
                updatedAt: Date.now(),
              },
            });

          const recipientPhone = reminder.care_recipient_phone;
          const reminderContent = reminder.title;

          try {
            if (recipientPhone) {
              console.log("loading call service");
              strapi.service("api::call.call").call({
                twiml: `<Response><Say voice="Google.yue-HK-Standard-A" >${reminderContent}</Say></Response>`,
                to: recipientPhone,
              });
            }
          } catch (err) {
            console.log(err);
          }
          return updateReminder;
        })
      );
    },
    options: {
      rule: "*/1 * * * *",
    },
  },

  regularSevenDayCall: {
    task: async () => {
      console.log("loading regular cron");
      const currentTime = new Date();
      const timestamp = currentTime.toISOString().slice(11, 16);
      const regularReminderToBeCalled = await strapi.db
        .query("api::reminder.reminder")
        .findMany({
          where: {
            regular_7days: {
              $eq: true,
            },
            regular_4weeks: {
              $eq: false,
            },
            remind_date_formatted: {
              $contains: timestamp,
            },
            regular_7days_counter: {
              $lte: 7,
            },
            cron_executed: {
              $eq: false,
            },
          },
        });
      await Promise.all(
        regularReminderToBeCalled.map(async (reminder) => {
          const regular_7days_counter = reminder.regular_7days_counter;
          const updateRegularReminder = await strapi
            .service("api::reminder.reminder")
            .update(reminder.id, {
              data: {
                regular_7days_counter: regular_7days_counter + 1,
                cron_executed: true,
                updatedAt: Date.now(),
              },
            });
          const recipientPhone = reminder.care_recipient_phone;
          const reminderContent = reminder.title;

          try {
            if (recipientPhone) {
              console.log("loading call service");
              strapi.service("api::call.call").call({
                twiml: `<Response><Say voice="Google.yue-HK-Standard-A" >${reminderContent}</Say></Response>`,
                to: recipientPhone,
              });
            }
          } catch (err) {
            console.log(err);
          }
          return updateRegularReminder;
        })
      );
    },
    options: {
      rule: "*/1 * * * *",
    },
  },

  resetCronExecuted: {
    task: async () => {
      console.log("loading reset cron executed cron");
      const cronTrueReminder = await strapi.db
        .query("api::reminder.reminder")
        .findMany({
          where: {
            cron_executed: {
              $eq: true,
            },
          },
        });
      await Promise.all(
        cronTrueReminder.map(async (reminder) => {
          return strapi.service("api::reminder.reminder").update(reminder.id, {
            data: {
              cron_executed: false,
            },
          });
        })
      );
    },
    options: {
      rule: "0 */24 * * * ",
    },
  },
};
