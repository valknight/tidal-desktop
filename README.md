# TIDAL for Linux [![Build Status](https://travis-ci.org/valknight/tidal-desktop.svg?branch=master)](https://travis-ci.org/valknight/tidal-desktop)

![Screenshot](https://i.imgur.com/jbOdW8a.png)

## What is this?

This is a wrapper for TIDAL's web app, using Nativfier, which injects custom code to provide for a better desktop experience. It adds the following features to TIDAL:

- Close to tray
- Global keyboard shortcuts (by default, bound to media keys)
- Desktop Notifications

![Notifications Demo](https://i.imgur.com/s3ruu5t.png)

## Installation

### From binary

Go to the releases tab, and download the latest `tar.xz` file. Extract it, run `chmod +x tidal`, and then you can run `tidal`.

### From source

#### Requirements

- Node
- NPM

#### Procedure

> This has been tested on Ubuntu 18.04.2 LTS AMD64- your system may vary

1. Clone / download this repository
2. Open up a terminal in said directory
3. Change directory to this project, and type `npm install`
4. Run `npm run build`
5. Change directory to `build/tidal-linux-x64` and run `./tidal` - note, your working directory *has* to contain libpepflashplayer, so if you're making custom launchers, ensure this is set up right

### Default key bindings

**Media Play/Pause** = Play/Pause in TIDAL

**Media Forward** = Forward in TIDAL

**Media Back** = Back in TIDAL

If you wish to change these, see below in the FAQ as to how.
### FAQ

#### Why Electron!? Electron is garbage! I want a native app!

To be honest, same, but, I don't have the time (this entire thing took about an hour or two to get working). This method of injecting code is far easier to get working, and, at the end of the day, works.

#### Can I disable notifications?

Not through an option in the interface, no. However, you can open up `resources/app/inject/inject.js`, and change the option `enable_notifications` to `False`. If you want this to be persistent across builds, change this in `custom.js`.

#### How do I change the shortcuts from media keys?

If you want to change the keyboard shortcuts, open up `resources/app/nativefier.json`, and scroll down to `"globalShortcuts"`, and modify it as needed. Make sure you only change `"key"` not `"inputEvents"`, or your keys will fail to register inside TIDAL. To make this persistent across new builds, instead modify `shortcuts.json`, and run `npm run build` - the new binary will use your new keybinds.

#### What's libpepflashplayer.so?

TIDAL either wants to use HTML5 powered DRM, or if that's not avaliable, it does it in Flash. Therefore, we include `libpepflashplayer.so` (the flash player binary provided by Google Chrome). By including it, the workaround of using Flash seems to work, and if you remove it, you get a message from TIDAL asking you to install Flash, or install their desktop app (a sick joke tbh). The only condition of this is that it means libpepflashplayer.so needs to be in the working directory when launching TIDAL (so, no `build/tidal-linux-x64`, it's `cd build/tidal-linux-x64 && ./tidal`). 

#### Why am I still getting the *no Flash* popup?

Make sure you have `libpepflashplayer.so` in the directory you're running `npm run build` in. If that still doesn't work, open up main.js, and change the location of `libpepflashplayer.so` to exactly where it is stored on your system.

#### Are you sure there isn't a better way than this mess?

There *kind of* is (if you're okay with more Electron that is). Plex added support for TIDAL, all proper like, and their desktop apps also support it (however seem to be Electron powered, or at least, Plexamp is). If you link a Plex account to your TIDAL account, you don't actually need a Plex server to use TIDAL (last time I checked anyway). This is here for those who don't want to use Plex, or want easy access to the features Plex doesn't have *just* yet, like Mixes or Discovery features.
