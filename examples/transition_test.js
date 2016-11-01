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
  'closeOtherPlayers': false, //Should not close other players if max in not exceded
  'maxPlayerAllowCount': 2
};


omxp.on('changeStatus', function(status) {
  if (status.pos < status.duration/2 && status.pos > 700000){
    omxp.setPosition((status.duration - 15000000) / 10000);
  }
  console.log('Status', JSON.stringify(status));
});
omxp.on('aboutToFinish', function() {
  console.log('========= About To Finish ==========');
  setTimeout(function () {
    omxp.open('/home/pi/test2.mp4', opts);
  }, 2500);
});
omxp.on('finish', function() {
  console.log('============= Finished =============');
});
omxp.setTransition(true);
omxp.open('/home/pi/test1.mp4', opts);
