"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-reminders",
      handler: "reminder.createReminder",
    },
  ],
};
