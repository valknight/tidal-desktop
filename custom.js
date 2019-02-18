function log(data) {
    document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + "\n" + data;
}

function filterButtons(dataTestTag) {
    // tidal has all it's playback buttons (apart from pause) begin with this
    var buttons = document.querySelectorAll("[class^=whiteIconButton]");
    for (var i = 0; i < buttons.length; i++) {
        // tidal stores the purpose of a button in the data-test attribute
        if (buttons[i].attributes['data-test'].value == dataTestTag) {
            return buttons[i];
        }
    }
    return null; // only happens if we don't find a button
}
function previousMedia() {
    can_run = true
    if (window.lastKeyLast == undefined) {
        // do nothing, this is to make sure we don't do the next two
    } else if ((Date.now() - window.lastKeyLast) <= 200) {
        can_run = false
    }
    if (can_run) {
        filterButtons("previous").click(); // filterButtons returns a dom object of the button we want to click
        window.lastKeyLast = Date.now();
    }
}

function nextMedia() {
    can_run = true
    if (window.nextKeyLast == undefined) {
        // do nothing, this is to make sure we don't do the next two
    } else if ((Date.now() - window.nextKeyLast) <= 200) {
        can_run = false
    }
    if (can_run) {
        filterButtons("next").click();
        window.nextKeyLast = Date.now();
    }
}


function isPlaying() {
    var pause = document.querySelectorAll("[class^=playbackToggle]")[0]; // the data tag of the play/pause button is only pause *if* the song is playing
    if (pause.attributes['data-test'].value == "pause") { // if we can pause the song, it must be playing
        return true;
    }
    return false;
}

function pauseMedia() {
    can_run = true
    if (window.pauseKeyLast == undefined) {
        // do nothing, this is to make sure we don't do the next two
    } else if ((Date.now() - window.pauseKeyLast) <= 200) {
        can_run = false
    }
    if (can_run) {
        log("MusicPaused");
        document.querySelectorAll("[class^=playbackToggle]")[0].click(); // the pause button is weird, hence the custom filter here
        window.pauseKeyLast= Date.now();
    }
    else {
        log("RateLimit");
    }
}

function keyDownTextField(e) {
    var keyCode = e.keyCode;
    var actualKey = String.fromCharCode(keyCode);
    var evtobj = window.event ? event : e;
    if (actualKey == " " && evtobj.shiftKey) {
        // pauseMedia();
        // you can uncomment this if for some reason TIDAL doesn't handle it by itself
    }
    else if (actualKey == "%" && evtobj.ctrlKey) { // control-left gets inputted as shift-% to our interface
        previousMedia();
    }
    else if (actualKey == "'" && evtobj.ctrlKey) { // control-right gets inputted as shift-' to our interface
        nextMedia();
    }
}

function getMediaInformation() {
    // we have two footers, both are the same, just the first is the one in the default view
    footer = document.querySelectorAll("[class^=footerPlayer]")[0];
    try{
        mediaInformationDiv = footer.querySelectorAll("[class^=mediaInformation]")[0];
    }
    catch(err){
        // this happens if for some reason the footer isn't present
        return window.getMediaInformation();
    }
    toReturn = { "title": "Unknown", "artist": "Unknown", "playing_from": "Unknown" }
    // annoyingly, TIDAL don't give us any class for the title, so we just have to iterate over ourselves
    for (var i = 0; i < mediaInformationDiv.childNodes.length; i++) {
        if (mediaInformationDiv.childNodes[i].attributes['data-test'] != undefined) {
            if (mediaInformationDiv.childNodes[i].attributes['data-test'].value == "footer-track-title") {
                // this means current child has the track title
                toReturn['title'] = mediaInformationDiv.childNodes[i].textContent;
            }
        }
    }
    toReturn['artist'] = mediaInformationDiv.querySelectorAll("[class^=mediaArtists]")[0].textContent;
    // this chaos is because TIDAL handily split the player into "Playing from" and the actual playlist
    toReturn['playing_from'] = mediaInformationDiv.childNodes[2].querySelectorAll("[class^=text]")[0].textContent;
    return toReturn
}

function checkMediaNotification() {
    if (window.previousState == undefined) {
        window.previousState = getMediaInformation();
        if (window.previousState == undefined) {
            // we're still having issues getting track information (hidden footer?)
            // nothing we can really do, so give up?
            return
        }
    }
    currentState = getMediaInformation();
    if (currentState['title'] != window.previousState['title']) { // song change has occurred
        if (isPlaying()) { // we don't want to send a notification if our user isn't listening
            let myNotification = new Notification(currentState['title'], {
                body: currentState['artist']
            })
        }
    }
    window.previousState = currentState;
}

function main() {
    var iDiv = document.createElement('div');
    iDiv.id = 'log'; // We can't use console.log with injected code
    iDiv.style = "display: none";
    iDiv.className = 'block';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
    document.addEventListener("keydown", keyDownTextField, false);
    var notifications = setInterval(checkMediaNotification, 1000);
    log("Running");
}

main();