Autoupdater for Interface / node.js app for mac os x
-----

Run this utility to check for and automatically install updates to the Mac version of the Interface client.

HOW TO USE:
-----

npm install
node update.js

HOW IT WORKS
-----

First:

- Check what current version of Interface is
- Compare last version to current version

Then, if there is a newer version:

- Quit Interface
- Download the new version
- Mount the disk & copy it to /Applications
- Umount and cleanup.


TODO:
- package with node.js as utility
- windows version(?)

