# omxplayer-controll

Controll [omxplayer] (https://github.com/popcornmix/omxplayer) with [native dbus] (https://github.com/sidorares/node-dbus/)


#Installation


```shell
npm install omxplayer-controll [--save]
```

#Usage


Short example running a video getting the status every 5 seconds and listeing to the aboutToFinis signal

```js
var omxp = require('omxplayer-controll');
var opts = {
    'audioOutput': 'hdmi', //  'hdmi' | 'local' | 'both'
    'blackBackground': false, //false | true | default: true
    'disableKeys': true, //false | true | default: false
    'disableOnScreenDisplay': true, //false | true | default: false
    'disableGhostbox': true, //false | true | default: false
    'subtitlePath': '', //default: ""
    'startAt': 0, //default: 0
    'startVolume': 0.8 //0.0 ... 1.0 default: 1.0
};
omxp.open('path_to_file', opts);
omxp.on('changeStatus',function(status){
    console.log('Status',status);
});
omxp.on('aboutToFinish',function(){
    console.log('File about to finish');
});
```

#API


### List of available commands
#### Open single file
```js
omxp.open('path_to_file', opts);
```
#### Open multiple files
```js
omxp.open(['path_to_file1','path_to_file2','path_to_file3'], opts);
```
#### Basic commands
```js
omxp.playPause(function(err){});
omxp.pause(function(err){});
omxp.getStatus(function(err){});
omxp.getDuration(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
omxp.pause(function(err){});
```



### Reference:
   - https://github.com/sidorares/node-dbus/
   - https://github.com/popcornmix/omxplayer
   - https://github.com/diederikfeilzer/node-omx-interface
   - https://github.com/alepez/omxdirector
