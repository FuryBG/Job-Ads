const authController = require("../controllers/authController");
const adController = require("../controllers/adController");

module.exports = (app) => {
    app.use("/auth", authController);
    app.use("/", adController);
};