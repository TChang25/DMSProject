/**
 * Tommy Chang
 * CEN 3024 - Software Development 1
 * March 30, 2025
 * index.js
 * This application is built using react, shadcn, and deployed into github pages.
 * The purpose of this file is to provide backend api to the mysql server
*/
const mysql = require('mysql')
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const prompt = require('prompt-sync')();
/*
* Prompt user for password / user
*/
const user = prompt("Enter the user: ");
const password = prompt("Enter the password: ");
    
// Initialize middleware to parse JSON and allow CORS
app.use(cors());
app.use(express.json());
app.listen(port, () => { 
    console.log(`Server listening on ${port}`);
});


// test connection post /connect
// json:any input
app.post('/connect', (req, res) => {
    const requestData = req.body;
    // Process the data (e.g., save to a database, perform operations)
    console.log('Received data:', requestData);
    res.status(201).send({ message: 'Data received successfully', data: requestData });
});

// GET all restaurant data
// no inputs
app.get('/restaurant/all', (req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        database: 'demo'
    })

    connection.connect()

    connection.query('SELECT * FROM restaurant', (err, rows, fields) => {
    if (err) throw err

    console.log('The solution is: ', rows[0].solution)
    res.status(200).send(rows);
    })

    connection.end()
    
});

// GET all customerReview data
// no inputs
app.get('/customerReview/all', (req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        database: 'demo'
    })

    connection.connect()

    connection.query('SELECT * FROM customerReview', (err, rows, fields) => {
        if (err) throw err

        res.status(200).send(rows);
        
        
    })

    connection.end()
    
});

// POST update one customerReview
// Inputs: [{id: number, rating: number, comment: string}]
app.post('/customerReview/updateone', (req, res) => {
    let today = new Date().toLocaleDateString()
    const requestData = req.body;
    console.log("Data received", requestData);
    const connection = mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        database: 'demo'
    })
    connection.connect()
    let sql = `UPDATE customerReview SET rating=?, comment=?, lastUpdated=? WHERE id=?` 
    connection.query(sql,[requestData.rating, requestData.comment, today, requestData.id], (err, rows, fields) => {
        if (err) throw err
    })
    connection.query('SELECT * FROM customerReview', (err, rows, fields) => {
        if (err) throw err
        res.status(200).send(rows);
    })

    connection.end()
});

// POST delete one customerReview
// Inputs: [{id: number}]
app.post('/customerReview/deleteone', (req, res) =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        database: 'demo'
    })
    const requestData = req.body;
    console.log("Data received", requestData);

    connection.connect()
    let sql = `DELETE FROM customerReview WHERE id=?` 
    connection.query(sql,[requestData.id], (err, rows, fields) => {
        if (err) throw err
    })
    connection.query('SELECT * FROM customerReview', (err, rows, fields) => {
        if (err) throw err
        res.status(200).send(rows);
    })

    connection.end()
})

// POST create one customerReview
// Inputs: [{customerName: string, title: string, rating: number, comment:string, restaurantId: number}]
app.post('/customerReview/createone', (req, res) => {
    let today = new Date().toLocaleDateString()
    const connection = mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        database: 'demo'
    })
    const requestData = req.body;
    console.log("Data received", requestData);

    connection.connect()
    let sql = `INSERT INTO customerReview (customerName, title, rating, comment, publishDate, lastUpdated, restaurantId) VALUES (?)`
    let values = [
        [requestData.customerName, requestData.title, requestData.rating, requestData.comment, today, today, requestData.restaurantId]
    ]
    try {
        connection.query(sql, values, (err, rows, fields) => {
            if (err) throw err
        })
        connection.query('SELECT * FROM customerReview', (err, rows, fields) => {
            if (err) throw err
            res.status(200).send(rows);
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
    

    connection.end()
})

