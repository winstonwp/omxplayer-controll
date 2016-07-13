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
omxp.on('changeStatus', function(status) {
    console.log('Status', status);
});
omxp.on('aboutToFinish', function() {
    console.log('YA CASI');
});
setTimeout(function() {
    // omxp.getDuration(function(err, dur) {
    //     console.log(dur, Math.round(dur / 20000));
    //     omxp.setPosition(Math.round(dur / 20000), function(err) {
    //         console.log(err);
    //         omxp.getPosition(function(err, pos) {
    //             console.log(pos);
    //         });
    //     });
    // });
}, 5000);
