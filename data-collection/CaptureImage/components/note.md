## SaveImage.js

This script takes the image URI and sends it to the node server. Single click means non-hazard, long press means hazard

<b>Ensure</b>:
1. The node server is running

`cd image-backend`
`node server.js`

2. The URL in `SaveImage.js` is correct
`ifconfig | grep inet`
Use the `inet` URLs: `192.168.x.x` or `10.0.x.x`

3. The phone and server are connected to the same network