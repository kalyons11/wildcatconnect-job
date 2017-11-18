var config = { };

config.host = "localhost";
config.port = 5000;
config.path = "/job/dayGenerate";
config.data = {
  key: "value"
};
config.data.secret = "16catwild";
config.secure = false;
config.timing = {
  hour: 0,
  minute: 5,
  dayOfWeek: [1, 2, 3, 4, 5]
} // 12:05 AM every weekday

module.exports = config;
