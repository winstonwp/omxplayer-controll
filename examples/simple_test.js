/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
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
omxp.open('/home/pi/test.mp4', opts);
omxp.on('changeStatus',function(status){
    console.log('Status',status);
});
omxp.on('aboutToFinish',function(){
    console.log('YA CASI');
});
