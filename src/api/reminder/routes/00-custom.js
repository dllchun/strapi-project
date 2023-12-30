"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-reminders",
      handler: "reminder.createReminder",
    },
    {
      method: "GET",
      path: "/test",
      handler: "reminder.testRoute",
    },
  ],
};
