$(function()
{
    var playerTrack = $("#player-track"), status = $("#status"),
    albumArt = $('#album-art'), /*seekBar = $('#seek-bar'),*/
    trackTime = $('#track-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"), 
    play = $('#play-button'), pause = $('#pause-button'),
    mutebutton = $('#mute-button'), unmutebutton = $('#unmute-button'), syncbutton = $('#sync-button'), tProgress = $('#current-time'), tTime = $('#track-length'),
    seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress,
    bTime, nTime = 0, buffInterval = null
    trackUrl = ['https://freeuk7.listen2myradio.com/live.mp3?typeportmount=s1_24362_stream','https://freeuk7.listen2myradio.com/records/radiouser3127401/record.mp3', 'http://82.145.59.200:24362'],
    currIndex = -1,
    first = true, playPromise = true
    stream = $('#track-name')

    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused){
                audio_play()
            }
            else{
                audio_pause()
            }
        },300);
    }

    function audio_play(){
        if(first){
            setTimeout(audio.load(),500)
            first = false
        }
        playerTrack.addClass('active');
        albumArt.addClass('active');
        //checkBuffering();
        playPromise = audio.play();

        play.hide();
        pause.show()
    }

    function audio_pause(){
        playerTrack.removeClass('active');
        albumArt.removeClass('active');
        //clearInterval(buffInterval);
        //albumArt.removeClass('buffering');
        audio.pause();

        play.show();
        pause.hide();
    }
        
    /*function showHover(event)
    {
        seekBarPos = sArea.offset(); 
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());
        
        sHover.width(seekT);
        
        cM = seekLoc / 60;
        
        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
        
        if( (ctMinutes < 0) || (ctSeconds < 0) )
            return;
        
        if( (ctMinutes < 0) || (ctSeconds < 0) )
            return;
        
        if(ctMinutes < 10)
            ctMinutes = '0'+ctMinutes;
        if(ctSeconds < 10)
            ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
            insTime.text(ctMinutes+':'+ctSeconds);
            
        insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
        
    }*/

    /*function hideHover()
    {
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);       
    }*/
    
    /*function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }*/

    /*function updateCurrTime()
    {
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
        
        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);
        
        playProgress = (audio.currentTime / audio.duration) * 100;
        
        if(curMinutes < 10)
            curMinutes = '0'+curMinutes;
        if(curSeconds < 10)
            curSeconds = '0'+curSeconds;
        
        if(durMinutes < 10)
            durMinutes = '0'+durMinutes;
        if(durSeconds < 10)
            durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
            tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
            tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');
    }*/
    
    /*function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }*/

    /*function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < albumArtworks.length) )
        {
            if( flag != 0 ){
                albumArt.removeClass('buffering');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');

            audio.src = trackUrl[currIndex];
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }
        }
        else
        {
            if( flag == 0 || flag == 1 )
                --currIndex;
            else
                ++currIndex;
        }
    }*/

    function update(){
        console.log("ready "+audio.readyState);
        //console.log(audio.currentTime);
        console.log("network "+audio.networkState);

        if (playPromise !== undefined) {
            playPromise.then(function() {
                // Automatic playback started!
            }).catch(function(error) {
                alert("La radio non è attiva. Verrà riprodotta l'ultima registrazione effettuata.")
                audio_pause();

                //metto registrazione
                audio.src = trackUrl[1];
                stream.html("ULTIMA REGISTRAZIONE EFFETTUATA");
                audio_play();
            });
        }

        if(audio.networkState==2){
            status.html("CONNESSO A:")
        }
        else {
            status.html("CONNESSIONE...")
        }

    }

    function sync(){
        audio.pause();
        setTimeout(audio.load(),300)
        playerTrack.addClass('active');
        albumArt.addClass('active');
        playPromise = audio.play();

        play.hide();
        pause.show()
    }

    function mutefunc(){
        if(audio.muted){
            audio.muted = false
        
            unmutebutton.hide();
            mutebutton.show();
        } else {
            audio.muted = true
        
            mutebutton.hide();
            unmutebutton.show();
        }
    }

    function initPlayer()
    {   
        audio = new Audio(trackUrl[0]);

        //selectTrack(0);
        
        audio.loop = false;
        
        playPauseButton.on('click',playPause);
        mutebutton.on('click',mutefunc);
        unmutebutton.on('click',mutefunc);
        syncbutton.on('click',sync);
        
        //sArea.mousemove(function(event){ showHover(event); });
        
        //sArea.mouseout(hideHover);
        
        //sArea.on('click',playFromClickedPos);
        
        $(audio).on('timeupdate',update);

        //playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        //playNextTrackButton.on('click',function(){ selectTrack(1);});
    }

    initPlayer();
    
    console.log("ready "+audio.readyState);
    //console.log(audio.currentTime);
    console.log("network "+audio.networkState);
});