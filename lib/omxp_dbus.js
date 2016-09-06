var dbus = require('dbus-native'),
    fs = require('fs'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();
var omx_methods = require('./omx_methods');
var omxp_spawn = require('./omxp_spawn');
var prev_status = '';
var bus;

var tickInterval = 5000;
var tick;

function openPlayer(path, options) {
    omxp_spawn.player(path, options);
    omxp_spawn.once('finish', function(silent) {
        if (typeof tick !== 'undefined') clearInterval(tick);
        if (silent) eventEmitter.emit('finish');
    });
    var conn_interval = setInterval(function() {
        if (fs.existsSync('/tmp/omxplayerdbus.' + process.env.USER)) {
            bus = dbus.sessionBus({
                busAddress: fs.readFileSync('/tmp/omxplayerdbus.' + process.env.USER, 'ascii').trim()
            });
            setTimeout(getPlayerStatus, 500);
            tick = setInterval(getPlayerStatus, tickInterval);
            clearInterval(conn_interval);
        }
    }, 500);
}

function playersRunning(cb) {
    omxp_spawn.omxp_running(function(count) {
        cb(null, count);
    });
}

function setTickInterval(tick_int) {
    tickInterval = tick_int;
}

function propertyRead(prop, cb) {
    if (typeof omx_methods.properties[prop] !== 'undefined' && omx_methods.properties[prop].read) {
        if (typeof bus !== 'undefined') {
            bus.invoke({
                path: '/org/mpris/MediaPlayer2',
                interface: 'org.freedesktop.DBus.Properties',
                member: prop,
                destination: 'org.mpris.MediaPlayer2.omxplayer'
            }, function(err, resp) {
                return cb(err, resp);
            });
        } else {
            return cb(new Error('Not ready yet'));
        }
    } else {
        return cb(new Error('Invalid property'));
    }
}

function propertyWrite(prop, val, cb) {
    if (typeof bus !== 'undefined') {
        if (typeof omx_methods.properties[prop] !== 'undefined' && omx_methods.properties[prop].read) {
            bus.invoke({
                path: '/org/mpris/MediaPlayer2',
                interface: 'org.mpris.MediaPlayer2.Player',
                member: prop,
                destination: 'org.mpris.MediaPlayer2.omxplayer',
                signature: omx_methods.properties[prop].signature,
                body: val
            }, function(err) {
                return cb(err);
            });
        } else {
            return cb(new Error('Invalid property'));
        }
    } else {
        return cb(new Error('Not ready yet'));
    }
}

function method(action, val, cb) {
    cb = typeof val === 'function' ? val : cb;
    if (typeof bus !== 'undefined') {
        if (typeof omx_methods.methods[action] !== 'undefined') {
            bus.invoke({
                path: '/org/mpris/MediaPlayer2',
                interface: 'org.mpris.MediaPlayer2.Player',
                destination: 'org.mpris.MediaPlayer2.omxplayer',
                member: action,
                signature: (omx_methods.methods[action].write ? omx_methods.methods[action].signature : null),
                body: (omx_methods.methods[action].write ? val : null)
            }, function(err, val) {
                cb(err, val);
            });
        } else {
            return cb(new Error('Invalid method'));
        }
    } else {
        return cb(new Error('Not ready yet'));
    }
}

function getPlayerStatus() {
    propertyRead('PlaybackStatus', function(err0, status) {
        if (err0)
            return eventEmitter.emit('changeStatus', {
                status: 'Stopped'
            });
        propertyRead('Duration', function(err1, duration) {
            if (err1)
                return eventEmitter.emit('changeStatus', {
                    status: 'Stopped'
                });
            propertyRead('Position', function(err2, pos) {
                if (err2)
                    return eventEmitter.emit('changeStatus', {
                        status: 'Stopped'
                    });
                propertyRead('Volume', function(err3, vol) {
                    if (err3)
                        return eventEmitter.emit('changeStatus', {
                            status: 'Stopped'
                        });
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
module.exports.playersRunning = playersRunning;
