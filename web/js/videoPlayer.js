
        //message format
        //event:<event name>
        //data:<data related to image>
    function videoPlayerMessageHandler(message){
        // alert(message.event);
        if(myRole!=='teacherWhiteboard') {
            if (message.event === 'play') {
                playVideo();
            }
            else if (message.event === 'pause') {
                pauseVideo();
            }
            else if (message.event === 'updateTime') {
                updateTime(message.data);
            }
            else if (message.event === 'seek') {
                seek(message.data);

            }
            else if(message.event==='open'){
                showVideo(message.data);
            }
            else if(message.event==='close'){
                hidePlayer();
            }
        }
    }

function playVideo(){
    video.play();
}
function pauseVideo(){
    video.pause();
}
function updateTime(time){
    //  if (video.media.readyState === 4) {
    video.currentTime(time);
    // }
}
function seek(time){

    video.currentTime=time;
}



function sendVideoPlayerMessage(message){
    sendMessage("videoPlayer","",message);
    //for testing
    //videoPlayerMessageHandler(message);
}

function emitMessage(event,data){
    //construct message
    var message ={
        event:event,
        data:data
    };
    sendVideoPlayerMessage(message);
}



     function initializeVideoSync(){

        var video = Popcorn("#video");


        var videos = {
                a: Popcorn("#video"),
            },
            scrub = $("#scrub"),
            loadCount = 0,
            events = "play pause timeupdate seeking".split(/\s+/g);

        // iterate both media sources
        Popcorn.forEach(videos, function (media, type) {

            // when each is ready...
            media.on("canplayall", function () {

                // trigger a custom "sync" event
                this.emit("sync");



                // set the max value of the "scrubber"
                scrub.attr("max", this.duration());

                // Listen for the custom sync event...
            }).on("sync", function () {

                // Once both items are loaded, sync events
                if (++loadCount == 1) {

                    // Iterate all events and trigger them on the video B
                    // whenever they occur on the video A
                    events.forEach(function (event) {

                        video.on(event, function () {

                            // Avoid overkill events, trigger timeupdate manually
                            if (event === "timeupdate") {

                                if (!this.media.paused) {
                                    return;
                                }
                                //videos.b.emit("timeupdate");
                                emitMessage("seek",video.currentTime);
                                // update scrubber
                                //scrub.val(video.currentTime);

                                return;
                            }

                            if (event === "seeking") {
                                // videos.b.currentTime(this.currentTime());
                                emitMessage("seek",video.currentTime);
                            }

                            if (event === "play" || event === "pause") {
                                //videos.b[event]();

                                emitMessage(event);
                            }
                        });
                    });
                }
            });
        });

        // scrub.bind("change", function () {
        //     var val = this.value;
        //     video.currentTime(val);
        //     // videos.b.currentTime(val);
        // });

        // With requestAnimationFrame, we can ensure that as
        // frequently as the browser would allow,
        // the video is resync'ed.
        function sync() {
            if (video.media.readyState === 4) {
//                videos.b.currentTime(
//                        videos.a.currentTime()
//                );
               // emitMessage("updateTime",video.currentTime());
            }
            requestAnimationFrame(sync);
        }

        //sync();
    }

/**
 * Created by aseladarshan on 9/7/16.
 */
