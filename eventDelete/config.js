var config = { };

config.host = "wildcatconnect.com";
config.port = 443;
config.path = "/job/eventDelete";
config.data = {
    key: "value"
};
config.data.secret = "16catwild";
config.secure = true;
config.timing = {
  hour: 1,
  minute: 20
} // 1:20 AM every weekday

module.exports = config;
