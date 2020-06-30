const express = require('express');
const path = require('path');
const app = express();

const environment = process.env.NODE_ENV || 'local';
const host = process.env.host || 'localhost';
const port = process.env.PORT || 1443;

// Serve only the static files form the angularapp directory
app.use(express.static(__dirname + '/dist/audio-video-demo'));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/dist/audio-video-demo/index.html'));
});

app.listen(port, () => console.log(`server started on port ${port} http://${host}:${port}`));