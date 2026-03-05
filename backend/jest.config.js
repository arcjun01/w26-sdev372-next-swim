module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "app.js",
    "!src/config/initDB.js",
    "!src/config/init.sql"
  ],
  verbose: true
};
