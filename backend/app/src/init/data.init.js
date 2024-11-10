const request = require('request');

const sendRequest = (method, url, data = null) => {
    url = "http://127.0.0.1:3001/" + url;
    return new Promise((resolve, reject) => {
        const options = {
            method: method.toUpperCase(),
            url,
            json: true, // Automatically stringifies the body to JSON
        };

        // Add body only if data is not null
        if (data !== null) {
            options.body = data; // The data to send
        }

        request(options, (error, response, body) => {
            if (error) {
                reject(`Error: ${error.message}`);
            } else {
                resolve(body); // Resolve the promise with the response body
            }
        });
    });
};

const addData = async () => {
try {
    await sendRequest('POST', 'auth/createAdmin');

    await sendRequest('POST', 'auth/register',
        {
            "name": "User",
            "email": "user@gmail.com",
            "password": "12345678"
        }
    );

    response = await sendRequest('POST', 'auth/login',
        {
            "email": "admin@gmail.com",
            "password": "admin"
        }
    );
    adminToken = response.token;

    response = await sendRequest('POST', 'auth/login',
        {
            "email": "user@gmail.com",
            "password": "12345678"
        }
    );
    userToken = response.token;

    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "Harry Potter and the Sorcerer's Stone",
                "author": "J.K. Rowling",
                "publicationYear": 1997,
                "genre": [
                    "Fantasy"
                ],
                "numOfPages": 309,
                "price": 120
            },
            "token": adminToken
        }
    );
    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "Harry Potter and the Chamber of Secrets",
                "author": "J.K. Rowling",
                "publicationYear": 1998,
                "genre": [
                    "Fantasy"
                ],
                "numOfPages": 341,
                "price": 120
            },
            "token": adminToken
        }
    );
    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "The Casual Vacancy",
                "author": "J.K. Rowling",
                "publicationYear": 2012,
                "genre": [
                    "Contemporary Fiction"
                ],
                "numOfPages": 503,
                "price": 130
            },
            "token": adminToken
        }
    );
    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "1984",
                "author": "George Orwell",
                "publicationYear": 1949,
                "genre": [
                    "Dystopian Fiction"
                ],
                "numOfPages": 328,
                "price": 100
            },
            "token": adminToken
        }
    );
    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "Animal Farm",
                "author": "George Orwell",
                "publicationYear": 1945,
                "genre": [
                    "Political Satire"
                ],
                "numOfPages": 112,
                "price": 90
            },
            "token": adminToken
        }
    );
    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "Homage to Catalonia",
                "author": "George Orwell",
                "publicationYear": 1938,
                "genre": [
                    "Memoir / Political Non-Fiction"
                ],
                "numOfPages": 228,
                "price": 95
            },
            "token": adminToken
        }
    );
    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "Pride and Prejudice",
                "author": "Jane Austen",
                "publicationYear": 1813,
                "genre": [
                    "Classic Romance"
                ],
                "numOfPages": 279,
                "price": 85
            },
            "token": adminToken
        }
    );
    await sendRequest('POST', 'branches',
        {
            "name": "Books store 3",
            address: {
                "country": "Israel",
                "city": "Tel Aviv",
                "street": "Azriellie Center Mall Tel Aviv",
                "longitude": 32.074773,
                "latitude": 34.7918125
            },
            "token": adminToken
        }

    );
    await sendRequest('POST', 'branches',
        {
            "name": "Books store 4",
            address: {
                "country": "Israel",
                "city": "Rishon Lezzion",
                "street": "Rishonim Mall Tel Aviv",
                "longitude": 34.8004711,
                "latitude": 31.9494315
            },
            "token": adminToken
        }

    );
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "Sense and Sensibility",
                "author": "Jane Austen",
                "publicationYear": 1811,
                "genre": [
                    "Classic Romance"
                ],
                "numOfPages": 368,
                "price": 80
            },
            "token": adminToken
        }
    );
    
    await sendRequest('POST', 'admin/books/create',
        {
            "book": {
                "name": "Emma",
                "author": "Jane Austen",
                "publicationYear": 1815,
                "genre": [
                    "Classic Romance"
                ],
                "numOfPages": 474,
                "price": 90
            },
            "token": adminToken
        }
    );

    all_books_response = await sendRequest('GET', 'books')
    for (const book of all_books_response) {
        await sendRequest('POST', 'orders',
            {
            "token": userToken,
            "order": { 
                "books": [book._id]
                }
            }
        );
    };}
     catch (error) {
        console.error("An error occurred:", error);
    
}
    
   
};

module.exports = {addData};
