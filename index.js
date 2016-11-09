var events = require('events');

var eventEmitter = new events.EventEmitter();
var OmxDBus = require('./lib/omxp_dbus');
var omx_index=30;
var setTransition = false;
var omxs = {
  active:undefined,
  transitioning:undefined
};
/**
 * Open OmxPlayer, with the given parameter
 *
 * @path  {String} The file or folder path
 * @options {Object} The options available
 */
module.exports = eventEmitter;
module.exports.setTransition = function(setT){
  setTransition = setT;
};
module.exports.open = function(path, options){
  // omx_index++;
  omx_index = omx_index < 20 ? 30 : omx_index - 1;
  if(setTransition){
    options.layer = omx_index;
    if(typeof omxs.active === 'undefined'){
      omxs.active = new OmxDBus(omx_index);
      omxs.active.openPlayer(path, options);
      omxs.active.on('changeStatus', function(status) {
        eventEmitter.emit('changeStatus', status);
        var diff = status.duration - status.pos,
          lower = 5000000 - omxs.active.getTickInterval() * 500,
          higer = 5000000 + omxs.active.getTickInterval() * 500;
        if (diff > lower && diff < higer){
          eventEmitter.emit('aboutToFinish');
        }
      });
      omxs.active.on('finish', function() {
        eventEmitter.emit('finish');
        delete omxs.active;
        omxs.active = omxs.transitioning;
        delete omxs.transitioning;
      });
    }else{
      omxs.transitioning = new OmxDBus(omx_index);
      omxs.transitioning.openPlayer(path, options);
      omxs.transitioning.on('changeStatus', function(status) {
        eventEmitter.emit('changeStatus', status);
        var diff = status.duration - status.pos,
          lower = 5000000 - omxs.active.getTickInterval() * 500,
          higer = 5000000 + omxs.active.getTickInterval() * 500;
        if (diff > lower && diff < higer){
          eventEmitter.emit('aboutToFinish');
        }
      });
      omxs.transitioning.on('finish', function() {
        eventEmitter.emit('finish');
        delete omxs.active;
        omxs.active = omxs.transitioning;
        delete omxs.transitioning;
      });
    }
  } else {
    if(typeof omxs.active === 'undefined'){
      omxs.active = new OmxDBus(omx_index);
    }
    omxs.active.openPlayer(path, options);
    omxs.active.on('changeStatus', function(status) {
      eventEmitter.emit('changeStatus', status);
      var diff = status.duration - status.pos,
        lower = 5000000 - omxs.active.getTickInterval() * 500,
        higer = 5000000 + omxs.active.getTickInterval() * 500;
      if (diff > lower && diff < higer){
        eventEmitter.emit('aboutToFinish');
      }
    });
    omxs.active.on('finish', function() {
      eventEmitter.emit('finish');
    });

  }
};
module.exports.playPause = function(cb) { //checked
  omxs.active.method('PlayPause', function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.pause = function(cb) { //checked IDEM playPause
  omxs.active.method('Pause', function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.getStatus = function(cb) { //checked
  omxs.active.propertyRead('PlaybackStatus', function(err, status) {
    cb(err, status);
  });
};
module.exports.getDuration = function(cb) { //checked
  omxs.active.propertyRead('Duration', function(err, dur) {
    cb(err, dur);
  });
};
module.exports.getPosition = function(cb) { //checked
  omxs.active.propertyRead('Duration', function(err, dur) {
    omxs.active.propertyRead('Position', function(err, pos) {
      var ppos = 0;
      if (pos < dur){
        ppos = pos;
      }
      cb(err, Math.round(ppos));
    });
  });
};
module.exports.setPosition = function(pos, cb) { //checked
  omxs.active.method('SetPosition', ['/not/used', pos], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.seek = function(offset, cb) { //checked
  omxs.active.method('Seek', [offset], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.getVolume = function(cb) { //checked
  omxs.active.propertyRead('Volume', function(err, vol) {
    cb(err, vol);
  });
};
module.exports.setVolume = function(vol, cb) { //checked *not oficially but Working
  if (vol <= 1.0 && vol >= 0.0) {
    omxs.active.setVolume(vol, function(err, resp) {
      return typeof cb === 'function' ? cb(err, resp) : {};
    });
  } else {
    return cb(new Error('Volume should be between 0.0 - 1.0'));
  }
};
module.exports.volumeUp = function(cb) { //checked
  omxs.active.method('Action', [18], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.volumeDown = function(cb) { //checked
  omxs.active.method('Action', [17], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.toggleSubtitles = function(cb) { //checked not tested (I have no subtitles)
  omxs.active.method('Action', [12], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.hideSubtitles = function(cb) { //checked not tested (I have no subtitles)
  omxs.active.method('Action', [30], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.showSubtitles = function(cb) { //checked not tested (I have no subtitles)
  omxs.active.method('Action', [31], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.setAlpha = function(alpha, cb) { //checked
  if (alpha >= 0 && alpha <= 255) {
    omxs.active.method('SetAlpha', ['/not/used', alpha], function(err) {
      return typeof cb === 'function' ? cb(err) : {};
    });
  } else {
    return cb(new Error('Alpha should be between 0 - 255'));
  }
};
module.exports.setVideoPos = function(x1, y1, x2, y2, cb) { //checked
  var vidPos = x1.toString() + ' ' + y1.toString() + ' ' + x2.toString() + ' ' + y2.toString();
  omxs.active.method('VideoPos', ['/not/used', vidPos], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.setVideoCropPos = function(x1, y1, x2, y2, cb) { //checked
  var vidPos = x1.toString() + ' ' + y1.toString() + ' ' + x2.toString() + ' ' + y2.toString();
  omxs.active.method('SetVideoCropPos', ['/not/used', vidPos], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.setAspectMode = function(aspect, cb) { //checked
  var available_aspects = ['letterbox', 'fill', 'stretch', 'default'];
  if (available_aspects.indexOf(aspect) > -1) {
    omxs.active.method('SetAspectMode', ['/not/used', aspect], function(err) {
      return typeof cb === 'function' ? cb(err) : {};
    });
  } else {
    throw new Error('Not an available aspect use one of: ' + available_aspects.join(','));
  }
};
module.exports.hideVideo = function(cb) { //checked
  omxs.active.method('Action', [28], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.unhideVideo = function(cb) { //checked
  omxs.active.method('Action', [29], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.getSource = function(cb) { //checked
  omxs.active.propertyRead('GetSource', function(err, vol) {
    cb(err, vol);
  });
};
module.exports.getMinRate = function(cb) { //checked
  omxs.active.propertyRead('MinimumRate', function(err, vol) {
    cb(err, vol);
  });
};
module.exports.getMaxRate = function(cb) { //checked
  omxs.active.propertyRead('MaximumRate', function(err, vol) {
    cb(err, vol);
  });
};
module.exports.reduceRate = function(cb) { //checked
  omxs.active.method('Action', [1], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};
module.exports.increaceRate = function(cb) { //checked
  omxs.active.method('Action', [2], function(err) {
    return typeof cb === 'function' ? cb(err) : {};
  });
};


//=========================Not working functions
// module.exports.quit = function(cb) { //not working
//     omxs.active.method('Quit', function(err) {
//         return typeof cb === 'function' ? cb(err) : {};
//     });
// };
// module.exports.mute = function(cb) { //not working
//     omxs.active.method('Mute', function(err) {
//         cb(err);
//     });
// };
// module.exports.getRate = function(cb) { //not working
//     omxs.active.propertyRead('Rate', function(err, vol) {
//         cb(err, vol);
//     });
// };
// module.exports.play = function(cb) { //not working
//     omxs.active.method('Play', function(err) {
//         return typeof cb === 'function' ? cb(err) : {};
//     });
// };
//=========================EN OF NOT WORKING FUNCTIONS
