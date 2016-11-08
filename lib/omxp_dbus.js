var dbus = require('dbus-native'),
  util = require('util'),
  fs = require('fs'),
  EventEmitter = require('events');
var omx_methods = require('./omx_methods');
var OmxSpawn = require('./omxp_spawn');
module.exports = OmxDBus;

function OmxDBus(address) {
  var prev_status = '';
  var bus;

  var tickInterval = 1000;
  var tick;

  var that = this;
  EventEmitter.call(that);
  this.address = address;
  this.omxp_spawn = new OmxSpawn(this.address);
  this.openPlayer = function openPlayer(path, options) {
    that.omxp_spawn.player(path, options);
    that.omxp_spawn.once('finish', function(address) {
      if (typeof tick !== 'undefined') clearInterval(tick);
      if (address === that.address){
        that.emit('finish');
      }
    });
    var conn_interval = setInterval(function() {
      if (fs.existsSync('/tmp/omxplayerdbus.' + process.env.USER)) {
        bus = dbus.sessionBus({
          busAddress: fs.readFileSync('/tmp/omxplayerdbus.' + process.env.USER, 'ascii').trim()
        });
        setTimeout(that.getPlayerStatus, 500);
        tick = setInterval(that.getPlayerStatus, tickInterval);
        clearInterval(conn_interval);
      }
    }, 500);
  };
  this.propertyRead = function propertyRead(prop, cb) {
    if (typeof omx_methods.properties[prop] !== 'undefined' && omx_methods.properties[prop].read) {
      if (typeof bus !== 'undefined') {
        bus.invoke({
          path: '/org/mpris/MediaPlayer' + that.address,
          interface: 'org.freedesktop.DBus.Properties',
          member: prop,
          destination: 'org.mpris.MediaPlayer' + that.address +'.omxplayer'
        }, function(err, resp) {
          return cb(err, resp);
        });
      } else {
        return cb(new Error('Not ready yet'));
      }
    } else {
      return cb(new Error('Invalid property'));
    }
  };
  this.propertyWrite = function propertyWrite(prop, val, cb) {
    if (typeof bus !== 'undefined') {
      if (typeof omx_methods.properties[prop] !== 'undefined' && omx_methods.properties[prop].read) {
        bus.invoke({
          path: '/org/mpris/MediaPlayer' + that.address,
          interface: 'org.mpris.MediaPlayer2.Player',
          member: prop,
          destination: 'org.mpris.MediaPlayer' + that.address + '.omxplayer',
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
  };
  this.method = function method(action, val, cb) {
    cb = typeof val === 'function' ? val : cb;
    if (typeof bus !== 'undefined') {
      if (typeof omx_methods.methods[action] !== 'undefined') {
        bus.invoke({
          path: '/org/mpris/MediaPlayer' + that.address,
          interface: 'org.mpris.MediaPlayer2.Player',
          destination: 'org.mpris.MediaPlayer' + that.address + '.omxplayer',
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
  };
  this.getPlayerStatus = function getPlayerStatus() {
    that.propertyRead('PlaybackStatus', function(err0, status) {
      if (err0)
        return that.emit('changeStatus', {
          status: 'Stopped',
          error: err0
        });
      that.propertyRead('Duration', function(err1, duration) {
        if (err1)
          return that.emit('changeStatus', {
            status: 'Stopped',
            error: err1
          });
        that.propertyRead('Position', function(err2, pos) {
          if (err2)
            return that.emit('changeStatus', {
              status: 'Stopped',
              error: err2
            });
          that.propertyRead('Volume', function(err3, vol) {
            if (err3)
              return that.emit('changeStatus', {
                status: 'Stopped',
                error: err3
              });
            var new_status = {
              status: status,
              duration: duration,
              pos: pos < duration ? pos : 0,
              vol: vol
            };
            if (JSON.stringify(new_status) !== JSON.stringify(prev_status)) {
              that.emit('changeStatus', new_status);
              prev_status = new_status;
            }
          });
        });
      });
    });
  };
  this.playersRunning = function playersRunning(cb) {
    that.omxp_spawn.omxp_running(function(count) {
      cb(null, count);
    });
  };

  this.setTickInterval = function setTickInterval(tick_int) {
    tickInterval = tick_int;
  };
  this.getTickInterval = function getTickInterval() {
    return tickInterval;
  };
  //================================================
  //This part should be removed once able to setVolume with out it (the way every other function works).
  var exec = require('child_process').exec;

  this.setVolume = function setVolume(val, cb) {
    var cmd = 'OMXPLAYER_DBUS_ADDR="/tmp/omxplayerdbus.${USER:-root}";OMXPLAYER_DBUS_PID="/tmp/omxplayerdbus.${USER:-root}.pid";export DBUS_SESSION_BUS_ADDRESS=`cat $OMXPLAYER_DBUS_ADDR`;export DBUS_SESSION_BUS_PID=`cat $OMXPLAYER_DBUS_PID`;dbus-send --print-reply=literal --session --reply-timeout=500 --dest=org.mpris.MediaPlayer' + that.address + '.omxplayer /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Volume double:';
    exec(cmd + val, function(stderr, stdout) {
      if (stderr)
        return cb(new Error(stderr));
      var vol_d = parseFloat(stdout.substr(stdout.indexOf('double') + 7, stdout.length));
      cb(null, vol_d);
    });
  };
  //================================================

}

util.inherits(OmxDBus, EventEmitter);
