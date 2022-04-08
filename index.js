//write an API server that will receive a POST request with a JSON payload and returns a JSON response
//the JSON payload will contain an array of objects with the following properties:
//svg: base64 encoded svg image
//convert the base64 image to png using gm and return the png image as a base64 string
//the response should be a JSON object with the following properties:
//imgBase64: base64 encoded png image

const http = require('http');
const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const { nanoid } = require('nanoid');

const httpServer = http.createServer((req, res) => {
    if (req.method === 'POST') {
        //log incoming request with timestamp, method, url, and headers
        console.log(`${new Date().toISOString()} ${req.method} ${req.url} ${JSON.stringify(req.headers)}`);


        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const payload = JSON.parse(body);
            const imgBase64 = payload.svg;

            //check if imgBase64 is a valid base64 string
            if (imgBase64 && imgBase64 != '' && imgBase64.length % 4 === 0) {
                const imgBuffer = Buffer.from(imgBase64, 'base64');
                //check if imgBuffer is a valid buffer
                if (imgBuffer && imgBuffer.length > 0) {

                    //check if image has a width of at least 1px
                    gm(imgBuffer).size((err, size) => {
                        if (err) {
                            console.log(err);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Error processing image' }));
                        } else {
                            if (size.width > 0) {
                                const imgName = nanoid(10);
                                const imgPath = `./images/${imgName}.png`;
                                gm(imgBuffer).background("none").channel("RGBA").alpha("associate").write(imgPath, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    fs.readFile(imgPath, (err, data) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        const png = data.toString('base64');
                                        res.writeHead(200, {
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Methods': 'POST, OPTIONS',
                                            'Access-Control-Allow-Headers': 'Content-Type',
                                            'Content-Type': 'application/json'
                                        });
                                        res.end(JSON.stringify({ png }));
                                    });
                                    //delete the image
                                    fs.unlink(imgPath, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                });
                            } else {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Image has no width' }));
                            }
                        }
                    });

                } else {
                    //return code 500
                    res.writeHead(500, {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Content-Type': 'application/json'
                    });

                }


            }
        });
    }
    if (req.method === 'OPTIONS') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end();
        }
});

if (httpServer.listen(3300)) {
    console.log('Server is listening on port 3300');
}