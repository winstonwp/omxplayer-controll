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
    'startVolume': 0.8,
    'closeOtherPlayers': true //Should close other players if necessary
};


omxp.on('changeStatus', function(status) {
    console.log('Status', JSON.stringify(status));
    if (status.pos < 100000000)
        omxp.setPosition(0.95 * status.duration / 10000);
});
omxp.on('aboutToFinish', function() {
    console.log('========= About To Finish ==========');
});
omxp.on('finish', function() {
    console.log('============= Finished =============');
    omxp.open('/home/pi/test1.mp3', opts);
});
omxp.open('/home/pi/test1.mp3', opts);
