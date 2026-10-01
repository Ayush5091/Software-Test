const { defineConfig } = require("cypress");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretgymbookingjwtkey1234567890";

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      on("task", {
        generateToken(payload) {
          const userPayload = payload || {
            id: "test-user-id",
            role: "member",
            name: "Test Member",
            email: "test@fitbook.com"
          };
          return jwt.sign(userPayload, JWT_SECRET, { expiresIn: "7d" });
        }
      });
      return config;
    },
  },
});
