var config = { };

config.host = "wildcatconnect.com";
config.port = 443;
config.path = "/job/alertPush";
config.data = {
    key: "value"
};
config.data.secret = "16catwild";
config.secure = true;
config.timing = {
  minute: [0, 15, 30, 45]
} // every 15 minutes

module.exports = config;
