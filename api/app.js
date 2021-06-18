const express = require('express');
const path = require('path');

const app = express()
const root = path.resolve(__dirname, '..')

// Log invocations
app.use(function(req, res, next) { console.log(req.url); next(); });

// Directly serve static content from /client
app.use(express.static(root + '/client'));

// Simple REST API that returns some entities
app.get('/api/entities', (req,res) => 
 res.send({ entities: 
   ['Q2887', 
    'Q33986'
   ]})
);

module.exports = app
