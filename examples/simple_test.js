/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
var fs = require('fs');
var omxp = require('../index');

var opts = {
    'audioOutput': 'hdmi',
    'blackBackground': false,
    'disableKeys': true,
    'disableOnScreenDisplay': true,
    'disableGhostbox': true,
    'subtitlePath': '',
    'startAt': 0,
    'startVolume': 0.8
};
var file = '/home/pi/test.mp3';
if(fs.existsSync(file)){
    omxp.open(file, opts);
    omxp.on('changeStatus', function(status) {
        console.log('Status', status);
    });
    omxp.on('aboutToFinish', function() {
        console.log('About To Finish');
    });
}else{
    console.error(file + ' non existing');
}
