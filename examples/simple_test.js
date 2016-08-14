/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
var fs = require('fs');
var omxp = require('../index');

var files = ['/home/pi/test1.mp3', '/home/pi/test2.mp3'],
    files_pos = 0;

var opts_transitiong = {
    'audioOutput': 'hdmi',
    'blackBackground': false,
    'disableKeys': true,
    'disableOnScreenDisplay': true,
    'disableGhostbox': true,
    'subtitlePath': '',
    'startAt': 0,
    'startVolume': 0.8,
    'maxPlayerAllowCount': 2, //This would allow to open a second player from transitioning. Defaults to 1
    'closeOtherPlayers': false //Leave players open if there are 2 (or more)
};

var opts_single = {
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
    console.log('Status', status);
});
omxp.on('aboutToFinish', function() {
    //For example to do a transitiong
    omxp.open(select_file(false), opts_transitiong);
});
omxp.on('finish', function() {
    omxp.playersRunning(function(err, count) {
        if (count === 0) {
            omxp.open(select_file(false), opts_single);
        } else {
            console.log('Previous track finished,  but new one is running');
        }
    });
});
omxp.open(select_file(false), opts_single);

function select_file(isRetry) {
    var sf_pos = files_pos + 1 < files.length ? files[files_pos++] : files[0];
    if (fs.existsSync(files[sf_pos])) {
        return files[sf_pos];
    } else {
        if (!isRetry) {
            return select_file(true);
        } else {
            return null;
        }
    }
}
