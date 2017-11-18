var config = { };

config.host = "wildcatconnect.com";
config.port = 443;
config.path = "/job/dayDelete";
config.data = {
    key: "value"
};
config.data.secret = "16catwild";
config.secure = true;
config.timing = {
  hour: 0,
  minute: 10,
  dayOfWeek: [1, 2, 3, 4, 5]
} // 12:10 AM every weekday

module.exports = config;
