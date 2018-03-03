# metaverse-ipfs
Turn any [A-Frame](https://aframe.io/) world into networked multiplayer using the power of p2p networking. The ultimate goal is to host all assets/js on CDN or on [IPFS](https://ipfs.io/) and use p2p js libraries to distribute player metadata.

Simply put: a serverless internet where anybody can create virtual worlds accessible to the world.

**NOTE** Works 5% of the time if running on the same machine. I think this is a problem to do with IPFS PubSub library trying to network.

Currently this uses IPFS PubSub https://github.com/ipfs-shipyard/ipfs-pubsub-room-demo. I am compiling a version I did for this that is centralized architecture running on a central Node server and uses a central Socket.io server to distribute client data. I have found that IPFS PubSub, as I implement it in this example to date, is not designed for real time packet spam like I am creating.

Alternatives that I am considering: 
- Socket.io p2p https://github.com/socketio/socket.io-p2p

The clients sub/pub to rooms determined by the string of the last path slug in the current url.

## How to run:

1. `npm install` You may need some dependencies I don't remember for the IPFS security libs, but it should be apparent in install
2. `npm start`
3. Connect to http://localhost:12345 in two different browser windows. Usually this would be over an HTTPS connection so you have to allow non-secure connection
4. You should be able to see interactions visible in both windows

## UI:

- Pepe Frog button: indicates whether or not connected to PubNub WebRTC phone session. Used for VOIP
- [A-Frame](https://aframe.io/): sometimes the JS takes a while to load in the objects and everything, so your player may fall through the ground plane. If that happens just refresh until it loads in time. I had to find an odd way of simulating gravity/ flying mechanic
