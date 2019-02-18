var nativefier = require('nativefier').default;
// we use nativefier, and just inject code, because that's all we need really

var options = {
    name: 'TIDAL', 
    targetUrl: 'https://listen.tidal.com', // required
    out: 'build/',
    asar: false, // we don't need to package our code in an archive
    icon: './icon.png',
    bounce: false,
    width: 1280,
    height: 800,
    showMenuBar: false,
    fastQuit: false,
    honest: false,
    conceal: false,
    // flash is needed to actually play music without HTML5 DRM components
    flash: true,
    // we don't provide flash, due to licensing, but, you can find it inside ~/.config/google-chrome/PepperFlash/[version]/libpepflashplayer.so
    // set below to the entire path (not relative)
    flashPath: "./libpepflashplayer.so",
    zoom: 1.0,
    singleInstance: true,
    clearCache: false,
    tray: true,
    verbose: true,
    inject: ["./custom.js"],
    globalShortcuts: "shortcuts.json",
};

nativefier(options, function(error, appPath) {
    if (error) {
        console.error(error);
        return;
    }
    console.log('App has been nativefied to', appPath);
});