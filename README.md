Autoupdater for Interface (OS X)
-----

Run this node.js utility to check for and automatically install updates to the Mac version of the Interface client from High Fidelity.

https://highfidelity.com/


How To Use:
-----
*if you don't have node installed, run ./bootstrap.sh to use the included node binaries*

npm install

node update.js


To Change Interval Length:
-----

var intervalMinutes = 30; 

How the Script Works
-----

First:

- Check what current version of Interface is
- Compare last version to current version

Then, if there is a newer version:

- Download the new version
- Quit Interface
- Mount the disk & copy the app to /Applications
- Umount and cleanup.
- Reopen Interface


To-Do:
-----
- wait & notify / prompt for quit (if you're in the middle of something...?)
- package with node.js
- menu level utility?
- windows version?
