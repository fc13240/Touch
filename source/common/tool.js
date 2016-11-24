var conf = require('../package') || {};
var path_user = require('path').join(require('os').homedir(), 'BPA', 'TOUCH');
conf.PATH = {
    USER: path_user,
    BASE: __dirname
};

module.exports = {
    CONF: conf
};