module.exports = {
  reminderCall: {
    task: async () => {
      console.log("loading reminderCall");
      const currentTime = new Date();
      const timestamp = currentTime.toISOString().slice(0, 16);
      const reminderToBePublished = await strapi.db
        .query("api::reminder.reminder")
        .findMany({
          where: {
            publishedAt: {
              $null: true,
            },
            remind_date_formatted: {
              $eq: timestamp,
            },
          },
        });
      await Promise.all(
        reminderToBePublished.map(async (reminder) => {
          const updateReminder = strapi
            .service("api::reminder.reminder")
            .update(reminder.id, {
              data: {
                publishedAt: new Date(),
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

  regularCall: {
    task: async () => {
      console.log("loading regular cron");
      const currentTime = new Date();
      const timestamp = currentTime.toISOString().slice(0, 16);
      const regularReminderToBeCalled = await strapi.db
        .query("api::reminder.reminder")
        .findMany({
          where: {
            publishedAt: {
              $notNull: true,
            },
            regular_7days: {
              $eq: true,
            },
            remind_date_formatted: {
              $eq: timestamp,
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
