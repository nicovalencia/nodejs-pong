Node.js Pong
============

This is a Node.js driven Pong game that a friend and I are using for a Hack
and Tell demo. The idea came around when we wired up Wii-mote controllers to
and Arduino, and wanted a visual game to connect their output to.

All Pong logic is calculated server-side and published to clients via
WebSockets. Event emitters on the server manage data publishing/subscribing.

You can use the subscriber module to wire up any sort of controller you want.

![Demo](https://raw.github.com/nicovalencia/nodejs-pong/master/public/images/demo.png)

Setup
=====

Install the latest Node.js (I like to use NVM for version management):

    curl https://raw.github.com/creationix/nvm/master/install.sh | sh

Set the active version of Node.js:

    nvm use

Install Node packages:

    npm install

Start the server:

    npm start

In another window, build and watch the development assets:

    grunt

[Grunt.js](http://gruntjs.com/) is used for development builds, so make sure
to [have that installed](http://gruntjs.com/getting-started).


Todo
====

There are a few todo's in the code, as well as anything else that might be
cool or fun.

Credit
======

[Eli](https://twitter.com/EliFatsi) and I built this stuff. We found the SkyBox CubeMaps from [this guy](http://www.humus.name/index.php?page=Textures). The board images were found on Google Images, if we ever make this something bigger, I'll switch them out for some OS content. Everything else is pretty much hacked together JAYSCRIPT YO!

