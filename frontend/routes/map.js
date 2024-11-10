const express = require('express');
const http = require('http');
const router = express.Router();

router.get('/map', async (req, res) => {
    try {
        const stores = await fetchStoresData();

        if (!Array.isArray(stores)) {
            console.error("Error: stores isn't in right format");
        }
        res.render('map', {
            stores: stores,
            googleMapKey: process.env.googleMapKey,
            googleMapId: process.env.googleMapId 
        });

    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).send("Error loading map");
    }
});

function fetchStoresData() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'booksbackend-books-app-1',
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
                    const storesData = JSON.parse(data); 
                    resolve(storesData);
                } catch (error) {
                    reject(error); 
                }
            });
        });

        request.on('error', (error) => {
            reject(error); 
        });

        request.end(); 
    });
}
module.exports = router;