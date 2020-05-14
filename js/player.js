$(function () {
    var playerTrack = $("#player-track"),
        albumArt = $('#album-art'),
        playPauseButton = $("#play-pause-button"),
        play = $('#play-button'),
        pause = $('#pause-button'),
        mutebutton = $('#mute-button'),
        unmutebutton = $('#unmute-button'),
        first = true,
        playPromise = true
    connection = $('#connection')
    radio = $('#radio')
    connectionText = ""
    /*trackUrl = ['https://freeuk7.listen2myradio.com/live.mp3?typeportmount=s1_24362_stream',
    'https://freeuk7.listen2myradio.com/records/radiouser3127401/record.mp3', 
    'http://82.145.59.200:24362'];*/

    function playPause() {
        setTimeout(function () {
            if (audio.paused) {
                audio_play()
            } else {
                audio_pause()
            }
        }, 300);
    }

    function audio_play() {
        if (first) {
            setTimeout(audio.load(), 500)
            first = false
        }
        playerTrack.addClass('active');
        albumArt.addClass('active');

        playPromise = audio.play();

        play.hide();
        pause.show()
    }

    function audio_pause() {
        playerTrack.removeClass('active');
        albumArt.removeClass('active');
        audio.pause();

        play.show();
        pause.hide();
    }

    function update() {
        console.log("ready " + audio.readyState);
        console.log("network " + audio.networkState);

        /*if (playPromise !== undefined) {
            playPromise.then(function() {
                // Automatic playback started!
            }).catch(function(error) {
                // Playing error
            });
        }*/

        if (audio.networkState > 0) {
            connection.html(connectionText)
        } else {
            connection.html("CONNESSIONE...")
        }

    }

    function sync() {
        audio_pause()
        setTimeout(audio.load(), 300)
        audio_play()

        play.hide();
        pause.show()
    }

    function mutefunc() {
        if (audio.muted) {
            audio.muted = false

            unmutebutton.hide();
            mutebutton.show();
        } else {
            audio.muted = true

            mutebutton.hide();
            unmutebutton.show();
        }
    }

    function initPlayer(urlT) {
        audio = new Audio(urlT);

        audio.loop = false;

        playPauseButton.on('click', playPause);
        mutebutton.on('click', mutefunc);
        unmutebutton.on('click', mutefunc);
        //syncbutton.on('click',sync)

        $(audio).on('timeupdate', update);
    }

    $.ajax({
        type: 'GET',
        //headers: {"X-Requested-With": "XMLHttpRequest"},
        //crossDomain: true,
        url: 'https://radio-video-check.herokuapp.com/',
        //xhrFields: {withCredentials: true },
        success: function (output, status, xhr) {
            //console.log(xhr.getResponseHeader("Content-Length"))
            //console.log("response "+output)
            var data = output.split("|")
            //radio setup
            if (data[0] == "play mp3") { //stream is not online
                connection.html("ULTIMA REGISTRAZIONE")
                connectionText = "ULTIMA REGISTRAZIONE"
                radio.html("RADIO NON ATTIVA")
                initPlayer(data[1]); //play record
            } else if (data[0] == "stream online") {
                connection.html("CONNESSO")
                connectionText = "CONNESSO"
                radio.html("RADIO ATTIVA")
                initPlayer(data[1]); //play stream
            } else {
                connection.html("NON CONNESSO")
                connectionText = "NON CONNESSO"
                radio.html("RADIO NON ATTIVA")
            }

            //video setup
            //$("#fb-video").attr("src", "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fparrocchiasangiacomosedrina%2Fvideos%2F" + data[2] + "%2F&show_text=0&width=560")
            //console.log("https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fparrocchiasangiacomosedrina%2Fvideos%2F"+data[1]+"%2F&show_text=1&width=560")
            //$("#live-text").html(data[3])
            //$("#next-live").html("Prossima diretta: " + data[4])
        },
        error: function (request, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
});