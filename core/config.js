var config = { };

config.host = "wildcatconnect.com";
config.port = 443;
config.path = "/job/test";
config.data = {
    key: "value"
};
config.data.secret = "16catwild";
config.secure = true;

module.exports = config;
