module.exports = ({ env }) => ({
  scheduler: {
    enabled: true,
    config: {
      contentTypes: {
        "api::page.page": {},
      },
    },
  },
});
