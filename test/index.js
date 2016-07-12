/* global describe it*/
var should = require('chai').should(),
    omxp = require('../index');
should;

describe('#Play pause the video and get status, first pausing it and then resuming playback', function() {
    var omxp_status = '';
    it('get player status', function(done) {
        omxp.getStatus(function(err, status) {
            omxp_status = status;
            done();
        });
    });
    it('togglePlayPause the video', function() {
        (function() {
            omxp.pause();
        }).should.not.throw();
    });
    if (omxp_status === 'Playing') {
        it('resume the video if necessary', function() {
            (function() {
                omxp.pause();
            }).should.not.throw();
        });
    }
    it('check player status to Playing', function(done) {
        omxp.getStatus(function(err, status) {
            status.should.equal('Playing');
            done();
        });
    });
});
describe('#Set the volume to 0.5 and read it', function() {
    it('Sets the volume', function() {
        (function() {
            omxp.setVolume(0.1);
        }).should.not.throw();
    });
    it('getting volume should be 0.5', function(done) {
        omxp.getVolume(function(err, vol) {
            vol.should.equal(0.5);
            done();
        });
    });
});
