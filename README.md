# Shroud of the Avatar Companion

This package contains a daemon (server or service for those
brought up on Windows) that is run on the same computer as
the Shroud of the Avatar Game Client. This daemon will watch
the files generated in the directory know as the "datafolder"
and will parse that information and present it as web pages.

In addition it will add the players location to some chatlog
entries and store them in it's own data area.

The daemon us built using node.js and therefor should run
on any platform that can run Shroud. The author only uses
linux and OSX so testing on Windows will have to be done by
other.

This package is Open Source under the Artistic License 2.0 and
you can use it without charge.

## How to download and install

You will need a 5.6 or better version of node.js and npm

### Basic Step to install

1. Install the newest version of node.js and npm
2. Download The most current release of sota-companion (Currently 2017.01)
3. Unpack the release.
4. cd to ..../daemon
5. Run the "npm install" command to get all the necessary Node Packages.
6. Run npm start (with debug turned on if you want).
7. Point you browser to localhost:14444 and configure your Data Directory.
8. In game write the stats to the chatlog using /stats.
9. Go to the SotA-Companion home page and see that the data is valid.

### Install the 6.x version of node.js and npm

You will need node.js and npm, there are packages for this
software for Windows, Mac OSX, Fedora, and Ubuntu, just search
the web.

NOTE you will need  at lease version 4.6.1 and better to get the
newest one (6.x) While this is default on OSX, and Fedora, and Windows.
for Ubuntu you can NOT use the package shipped with the current LTS versions
of Ubuntu (which is a 0.10 version)

### Download The most current release of sota-companion 

Go to [The SotA-Companion github repository](https://github.com/pwd3/sota-companion)
and select the "releases" item at the top of the page.
Download the release you are looking for in either zip or tar.gz format (they have
the same data in them).

### Unpack the release.

Unpack the zip or tar.gz file in a location that you want to run sota-companion from.
This should be in an area that your userid can write to. For OSX and linux somewhere
in your home directory is good.

### cd to ..../daemon

Open a command line tool (shell for OSX or linux, cmd or powershell for Windows) and
cd to the daemon directory that will be present in the unpacked area.

### Run the "npm install" command 

SotA-Companion uses a number of node packages. The release does not contain these
packages as some of them have binaries for the OS and the structure of the node-modules
directory differs with different versions of node. in the daemon directory run
the command "npm install" which will download all the needed packages and install them.
You do NOT need to be an Administrator or Super User to do any of these steps.

### Run npm start 

Now you need to start the two processes that run all the time collecting data. One
the "Watchdog" make sure the other "WWW" is running and restarts it if any code or
configuration changes (you can find both in the "bin" directory.

You can enable debuging output with the ENV variable  DEBUG=daemon:\* befor the npm start.

Type in npm start or:

* DEBUG=daemon:\* npm start on Linux

* SET DEBUG=daemon:\* npm start on OSX

* set DEBUG=daemon:\* npm start on Windows (CMD)

* $env\:DEBUG="daemon:\*" npm start on Windows (Powershell)


### Point you browser to localhost:14444 

The user interface to SotA-Companion is your browser pointed to
[localhost:14444](localhost:14444)

When you first point to this page (while the daemon is running) 
you will be re-directed to the profile page because your data directory
is not set. Start the game and, in the chat window, type /datafolder.
This will open a window showing the contents of your data directory. You will
need to enter the directory (full path) in the profile and hit the 
save button at the top of the page (cloud with an up arrow in it).
Once you do this and get a good save (valid data) then you can hit the 
home button.

If you have ever run the /stats command in game as this Avatar you will
see you last stats if not, in game write the stats to the chatlog using /stats.


## How to check out from github for development

If you wish to modify this code you should fork it on github.
Instruction on how to use git and github can be found on the web;
one of the pages on this is 
[Github Tutorial](http://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)

You can then fork the project and make your edits. You can use your forked version
just like a release version.

## License

This package is Copyright &copy; 2017 Philip W. Dalrymple III &mdash; all rights reserved worldwide

sota-companion is licensed under The Artistic License 2.0

This license establishes the terms under which a given free software
Package may be copied, modified, distributed, and/or redistributed.
The intent is that the Copyright Holder maintains some artistic
control over the development of that Package while still keeping the
Package available as open source and free software.

You are always permitted to make arrangements wholly outside of this
license directly with the Copyright Holder of a given Package.  If the
terms of this license do not permit the full use that you propose to
make of the Package, you should contact the Copyright Holder and seek
a different licensing arrangement. 

See the file LICENSE in the root of the distrubtion for the full details.

