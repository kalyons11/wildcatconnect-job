var config = { };

config.host = "wildcatconnect.com";
config.port = 443;
config.path = "/job/newsDelete";
config.data = {
    key: "value"
};
config.data.secret = "16catwild";
config.secure = true;
config.timing = {
  hour: 1,
  minute: 25
} // 1:25 AM every weekday

module.exports = config;
