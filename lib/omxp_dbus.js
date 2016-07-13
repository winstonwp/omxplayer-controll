var dbus = require('dbus-native'),
    fs = require('fs'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();
var prev_status = '';
var bus = dbus.sessionBus({
    busAddress: fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim()
});
/**
 * properties and methods according to
 * https://specifications.freedesktop.org/mpris-spec/latest/Media_Player.html
 * https://specifications.freedesktop.org/mpris-spec/latest/Player_Interface.html
 **/
var properties = {
    'Fullscreen': {
        signature: 'b',
        read: true,
        write: true
    },
    'LoopStatus': {
        signature: 's',
        read: true,
        write: true
    },
    'Rate': {
        signature: 'd',
        read: true,
        write: false
    },
    'Shuffle': {
        signature: 'b',
        read: true,
        write: true
    },
    'Volume': {
        signature: 'd',
        read: true,
        write: true
    },
    'GetSource': {
        signature: 's',
        read: true,
        write: false
    },
    'CanQuit': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanSetFullscreen': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanRaise': {
        signature: 'b',
        read: true,
        write: false
    },
    'Identity': {
        signature: 'b',
        read: true,
        write: false
    },
    'DesktopEntry': {
        signature: 's',
        read: true,
        write: false
    },
    'SupportedUriSchemes': {
        signature: 's',
        read: true,
        write: false
    },
    'SupportedMimeTypes': {
        signature: 's',
        read: true,
        write: false
    },
    'PlaybackStatus': {
        signature: 's',
        read: true,
        write: false
    },
    'Metadata': {
        signature: 'a',
        read: true,
        write: false
    },
    'Position': {
        signature: 'x',
        read: true,
        write: false
    },
    'MinimumRate': {
        signature: 'd',
        read: true,
        write: false
    },
    'MaximumRate': {
        signature: 'd',
        read: true,
        write: false
    },
    'CanGoNext': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanPlay': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanPause': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanSeek': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanCotrol': {
        signature: 'b',
        read: true,
        write: false
    },
    'Duration': {
        signature: 's',
        read: true,
        write: false
    }
};
var methods = {
    'Raise': {
        write: false
    },
    'Quit': {
        write: false
    },
    'Next': {
        write: false
    },
    'Previous': {
        write: false
    },
    'Pause': {
        write: false
    },
    'PlayPause': {
        write: false
    },
    'Stop': {
        write: false
    },
    'Play': {
        write: false
    },
    'Seek': {
        'signature': 'x',
        'type': 'offset',
        write: true
    },
    'SetPosition': {
        'signature': 'ox',
        'type': 'TrackId, Position',
        write: true
    },
    'SetAlpha': {
        'signature': 'ox',
        'type': 'NotUsed, Alpha',
        write: true
    },
    'VideoPos': {
        'signature': 'os',
        'type': 'NotUsed, "x1 y1 x2 y2"',
        write: true
    },
    'SetVideoCropPos': {
        'signature': 'os',
        'type': 'NotUsed, "x1 y1 x2 y2"',
        write: true
    },
    'SetAspectMode': {
        'signature': 'os',
        'type': 'NotUsed, "aspect"',
        write: true
    },
    'Action': {
        'signature': 'i',
        'type': 'actionNumber',
        write: true
    },
    'OpenUri': {
        'signature': 's',
        'type': 'Uri',
        write: true
    },
    'UnHideVideo': {
        write: false
    },
    'HideVideo': {
        write: false
    },
    'Mute': {
        write: false
    }
};
var tickInterval = 5000;

function openPlayer(path, options) {
    var omxp_spawn = require('./omxp_spawn');
    omxp_spawn.player(path, options);
    setTimeout(getPlayerStatus, 500);
    setInterval(getPlayerStatus, tickInterval);
}

function setTickInterval(tick_int) {
    tickInterval = tick_int;
}

function propertyRead(prop, cb) {
    if (typeof properties[prop] !== 'undefined' && properties[prop].read) {
        bus.invoke({
            path: '/org/mpris/MediaPlayer2',
            interface: 'org.freedesktop.DBus.Properties',
            member: prop,
            destination: 'org.mpris.MediaPlayer2.omxplayer'
        }, function(err, resp) {
            return cb(err, resp);
        });
    } else {
        return cb(new Error('Invalid property'));
    }
}

function propertyWrite(prop, val, cb) {
    if (typeof properties[prop] !== 'undefined' && properties[prop].read) {
        bus.invoke({
            path: '/org/mpris/MediaPlayer2',
            interface: 'org.mpris.MediaPlayer2.Player',
            member: prop,
            destination: 'org.mpris.MediaPlayer2.omxplayer',
            signature: properties[prop].signature,
            body: val
        }, function(err) {
            return cb(err);
        });
    } else {
        return cb(new Error('Invalid property'));
    }
}

function method(action, val, cb) {
    cb = typeof val === 'function' ? val : cb;
    if (typeof methods[action] !== 'undefined') {
        bus.invoke({
            path: '/org/mpris/MediaPlayer2',
            interface: 'org.mpris.MediaPlayer2.Player',
            destination: 'org.mpris.MediaPlayer2.omxplayer',
            member: action,
            signature: (methods[action].write ? methods[action].signature : null),
            body: (methods[action].write ? val : null)
        }, function(err, val) {
            if (err)
                throw err;
            cb(err, val);
        });
    } else {
        return cb(new Error('Invalid method'));
    }
}

function getPlayerStatus() {
    propertyRead('PlaybackStatus', function(err, status) {
        propertyRead('Duration', function(err, duration) {
            propertyRead('Position', function(err, pos) {
                propertyRead('Volume', function(err, vol) {
                    var new_status = {
                        status: status,
                        duration: duration,
                        pos: pos,
                        vol: vol
                    };
                    if (JSON.stringify(new_status) !== JSON.stringify(prev_status)) {
                        eventEmitter.emit('changeStatus', new_status);
                        prev_status = new_status;
                    }
                });
            });
        });
    });
}
module.exports = eventEmitter;
//================================================
//This part should be removed once able to setVolume with out it (the way every other function works).
var exec = require('child_process').exec;

function setVolume(val, cb) {
    var cmd = 'OMXPLAYER_DBUS_ADDR="/tmp/omxplayerdbus.${USER:-root}";OMXPLAYER_DBUS_PID="/tmp/omxplayerdbus.${USER:-root}.pid";export DBUS_SESSION_BUS_ADDRESS=`cat $OMXPLAYER_DBUS_ADDR`;export DBUS_SESSION_BUS_PID=`cat $OMXPLAYER_DBUS_PID`;dbus-send --print-reply=literal --session --reply-timeout=500 --dest=org.mpris.MediaPlayer2.omxplayer /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Volume double:';
    exec(cmd + val, function(stderr, stdout) {
        if (stderr)
            return cb(new Error(stderr));
        var vol_d = parseFloat(stdout.substr(stdout.indexOf('double') + 7, stdout.length));
        cb(null, vol_d);
    });
}
module.exports.setVolume = setVolume;
//================================================
module.exports.openPlayer = openPlayer;
module.exports.propertyRead = propertyRead;
module.exports.propertyWrite = propertyWrite;
module.exports.method = method;
module.exports.setTickInterval = setTickInterval;
