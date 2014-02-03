Node.js Pong
============

This is a Node.js driven Pong game that a friend and I are using for a Hack
and Tell demo. The idea came around when we wired up Wii-mote controllers to
and Arduino, and wanted a visual game to connect their output to.

All Pong logic is calculated server-side and published to clients via
WebSockets. Event emitters on the server manage data publishing/subscribing.

Eventually, we will hook this up to an external project that is used to
gather controller input and publish over a local network ZMQ server.

The game is Zelda themed, because Zelda is the best. And Link too.

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

