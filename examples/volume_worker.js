var omxp = require('../index');

// omxp.getVolume(function(err, vol) {
//     if (err)
//         throw err;
//     console.log(vol);
//     omxp.setVolume(1000);
//     setTimeout(function(){
//         omxp.getVolume(function(err, vol) {
//             if (err)
//                 throw err;
//             console.log(vol);
//         });
//     },1000);
// });


// omxp.getPosition(function(err,pos){
//     console.log(err, pos);
// });
var ret = 0;
function doit(){
    console.log('DOING IT');

    setPos(function(){
        if(ret++ < 10){
            doit();
        }
    });
    // volUp(function(){
    //     if(ret++ < 10){
    //         doit();
    //     }
    // });

}

function setPos(cb){
    omxp.getPosition(function(err,pos){
        console.log('1',pos/10000);
        omxp.setPosition(30 - ret);
        setTimeout(function(){
            omxp.getPosition(function(err,pos){
                console.log('2',pos/10000);
                cb();
            });
        },1000);
    });
}
function volUp(cb){
    omxp.getVolume(function(err,vol){
        console.log('1',vol);
        omxp.volumeUp();
        omxp.getVolume(function(err,vol){
            console.log('2',vol);
            cb();
        });
    });
}

doit();
