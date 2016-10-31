/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
var EventEmitter = require('events');
var OmxDBus = require('../lib/omxp_dbus_class'),
  omxdbus = new OmxDBus(20);


console.log(omxdbus instanceof EventEmitter); // true
console.log(OmxDBus.super_ === EventEmitter); // true
omxdbus.on('new',function(){
  console.log('ASDFASDFASDF');
});
omxdbus.on('openPlayer', function(){
  console.log('qwerasdfqwerasdf');
});
omxdbus.openPlayer();


// var spawn = require('child_process').spawn;
//
//
// var command = 'omxplayer';
//
// var path = ['/home/pi/test1.mp4'];
// var args = path;
//
// args.push('-o', 'hdmi');
// //omxplayer --win "0 0 960 540" --layer 6 --loop  ~/test1.mp4
//
// open1();
// setTimeout(function() {
//   open2();
// }, 1000);
//
//
// function open1() {
//   console.log('Opening 1');
//   spawn(command, args.concat('--layer', '5', '--alpha', '126')).on('close', function() {
//     open1();
//   });
// }
//
// function open2() {
//   console.log('Opening 2');
//   spawn(command, args.concat('--layer', '6', '--alpha', '126')).on('close', function() {
//     open2();
//   });
// }
