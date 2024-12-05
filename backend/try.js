// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = 'mongodb+srv://navsarjansih:navsarjansih@navsarjan.nqyo7.mongodb.net/?retryWrites=true&w=majority&appName=Navsarjan'; // Replace with your MongoDB URI
const client = new MongoClient(uri);
const dbName = 'navsarjan'; // Replace with your database name

app.post('/api/insert', async (req, res) => {
  const { collectionName, data } = req.body;

  if (!collectionName || !data) {
    return res.status(400).json({ success: false, message: 'Missing collection name or data' });
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(data);

    res.status(200).json({ success: true, message: 'Data inserted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to insert data', error });
  }
});
app.post('/api/fetch', async (req, res) => {
    const { collectionName, condition, projection } = req.body;
  
    if (!collectionName) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }
  
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      const queryCondition = condition || {}; // Default condition is an empty object
      const queryProjection = projection || {}; // Default projection is an empty object
  
      const data = await collection.find(queryCondition).project(queryProjection).toArray();
    console.log(data)
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch data', error });
    }
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
