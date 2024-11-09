const express = require('express');
const http = require('http');

const router = express.Router();

router.get('/map', (req, res) => {
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/branches',
        method: 'GET'
    };

    const request = http.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const stores = JSON.parse(data);
                console.log("Fetched stores:", stores); 
                res.render('map', { 
                    stores: stores,
                    googleMapKey: "AIzaSyC_WJEHWBzpCjP_bpydsBWzxXForg-eBAQ",
                    googleMapId: "ea2ec92766f63409" 
                });

            } catch (error) {
                console.error("Error parsing store data:", error);
                res.status(500).send("Error loading map");
            }
        });
    });

    request.on('error', (error) => {
        console.error("Error fetching stores:", error);
        res.status(500).send("Error loading map");
    });

    request.end();
});

module.exports = router;
