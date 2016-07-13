/* global describe it*/
var should = require('chai').should(),
    assert = require('chai').assert,
    exec = require('child_process').exec,
    fs = require('fs');
var omxp = require('../index');
should;
describe('#Checking dependencies', function() {
    var path = '/home/pi/test.mp4',
        isOmxPlayer = false,
        isTestVideo = false;
    it('omxplayer', function(done) {
        exec('which omxplayer', function(stderr, stdout) {
            isOmxPlayer = (stdout.length !== '');
            assert.notEqual('');
            done();
        });
    });
    it('test video "/home/pi/test.mp4"', function(done) {
        try {
            fs.statSync(path);
            isTestVideo=true;
        } catch (e) {
            isTestVideo=false;
        }
        assert.equal(isTestVideo,true,'There sould be a video in "/home/pi/test.mp4" in order to do the remaining test');
        done();
    });
    it('opening omxplayer with video', function(done) {
        if(isTestVideo && isOmxPlayer){
            var opts = {
                'audioOutput': 'hdmi',
                'blackBackground': false,
                'disableKeys': true,
                'disableOnScreenDisplay': true,
                'disableGhostbox': true,
                'subtitlePath': '',
                'startAt': 0,
                'startVolume': 0.8
            };
            exec('killall omxplayer.bin', function() {
                omxp.open(path, opts);
                omxp.on('changeStatus', function(status) {
                    if (status.status === 'Playing') {
                        makeAssertions();
                    } else {
                        assert.equal(status.status, 'Playing');
                    }
                    done();
                });
            });
        }else{
            assert.equal(isTestVideo && isOmxPlayer,true, 'Either omxplayer or "/home/pi/test.mp4" not present');
        }
    });
});

function makeAssertions() {

    describe('#get/change/get', function() {
        it('player status', function(done) {
            omxp.getStatus(function(status_0) {
                //assert.notEqual(-1, ['Playing', 'Pause'].indexOf(status));
                omxp.playPause(function() {
                    omxp.getStatus(function(err, status) {
                        assert.notEqual(status, status_0);
                        omxp.playPause(function() {
                            done();
                        });
                    });
                });
            });
        });
        it('player volume', function(done) {
            omxp.getVolume(function(vol_0) {
                omxp.setVolume(vol_0 * 0.1, function(err, vol) {
                    assert.notEqual(vol, vol_0);
                    done();
                });
            });
        });
        it('position', function(done) {
            omxp.getDuration(function(err, dur) {
                omxp.setPosition(Math.round(dur / 20000), function() {
                    omxp.getPosition(function(err, pos) {
                        assert.equal(Math.round(dur / 20000), pos);
                        done();
                        setTimeout(function() {
                            exec('killall omxplayer.bin');
                        });
                    });
                });
            });
        });
    });
}
