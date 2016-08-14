var spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    events = require('events'),
    eventEmitter = new events.EventEmitter();
module.exports = eventEmitter;
var omxp_running = function(cb) {
    exec('ps xa | grep "[o]mxplayer.bin" | wc -l', function(error, stdout) {
        if (error) {
            return cb(null, 0);
        }
        var processCount = parseInt(stdout);
        return cb(null, processCount);
    });
};
module.exports.player = function(path, options) {
    omxp_running(function(err, count) {
        options.maxPlayerAllowCount = options.maxPlayerAllowCount || 1;
        options.closeOtherPlayers = typeof options.closeOtherPlayers === 'undefined' ? true : options.closeOtherPlayers;
        if (count < options.maxPlayerAllowCount) {
            if(options.closeOtherPlayers){
                exec('killall -9 omxplayer.bin'); //Kill all previous omxplayers
            }else{
                return;
            }
        }
        path = typeof path === 'string' ? [path] : path;
        var settings = options || {};
        var command = 'omxplayer';
        var args = path;

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
        if (settings.nativeLoop === true) {
            args.push('--loop');
        }

        args.push('--dbus_name');
        args.push('org.mpris.MediaPlayer2.omxplayer');
        args.push('< omxpipe');
        var omxspawn = spawn(command, args);
        omxspawn.on('exit', function(code) {
            eventEmitter.emit('finish', code);
        });
    });
};

module.exports.omxp_running = omxp_running();
