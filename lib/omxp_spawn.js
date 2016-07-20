var exec = require('child_process').exec,
    spawn = require('child_process').spawn;
module.exports.player = function(path, options) {
    var settings = options || {};
    var args = [];
    var command = 'omxplayer';
    args.push(path);

    if (['hdmi', 'local', 'both'].indexOf(settings.audioOutput) != -1)
        args.push('-o', settings.audioOutput);
    if (settings.blackBackground !== false)
        args.push('-b');
    if (settings.disableKeys === true)
        args.push('--no-keys');
    if (settings.disableOnScreenDisplay === true)
        args.push('--no-osd');
    if (settings.disableGhostbox === true)
        args.push('--no-ghost-box');
    if (settings.subtitlePath && settings.subtitlePath !== '')
        args.push('--subtitles', '"' + settings.subtitlePath + '"');
    if (settings.startAt)
        args.push('--pos', '' + settings.startAt + '');
    if (typeof settings.startVolume !== 'undefined') {
        if (settings.startVolume >= 0.0 && settings.startVolume <= 1.0) {
            args.push('--vol');
            var db = settings.startVolume > 0 ? Math.round(100 * 20 * (Math.log(settings.startVolume) / Math.log(10))) / 1 : -12000000;
            args.push(db);
        }
    }
    //omxplayer /home/pi/test.mp4 -o hdmi --no-keys --no-osd --loop --win "0 0 100 100"

    args.push('--dbus_name');
    args.push('org.mpris.MediaPlayer2.omxplayer');
    args.push('< omxpipe');
    //exec(command + ' ' + args.join(' ') + ' < omxpipe', function() {});
    spawn(command, args);
    //Check this out to see if you can make this work!!!!
    //https://github.com/nodejs/node-v0.x-archive/issues/4374#issuecomment-11065865

    exec(' . > omxpipe');
};
