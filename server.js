const express = require('express');
const { MongoClient } = require('mongodb');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const uri = "mongodb+srv://admin:admin@cluster1.u70va65.mongodb.net/?retryWrites=true&w=majority&appName=cluster1";
const client = new MongoClient(uri);

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

const db = client.db("MyDB");

connectToDatabase();

// Serve static files
app.use(express.static('public'));

// Route for serving the add.html page
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

// Route for serving the search.html page
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// API endpoint for searching data
app.post('/search', async (req, res, next) => {
  try {
    const dirNumb = parseInt(req.body.dirNumb);
    
    // Validate that dirNumb is a number
    if (isNaN(dirNumb)) {
      return res.status(400).json({ error: 'Director Number must be a number' });
    }

    // Query MongoDB for movies with the specified director number
    const results = await db.collection('MyUsersCollection').find({ dirNumb: dirNumb }).toArray();
    
    // Check if any results were found
    if (results.length === 0) {
      return res.status(404).json({ error: 'No movies found for this Director Number' });
    }
    
    // Return the results
    res.json(results);
  } catch (error) {
    console.error('Failed to search data in MongoDB', error);
    next(error);
  }
});

// API endpoint
app.get('/api/data', async (req, res, next) => {
  try {
    const data = await db.collection('MyUsersCollection').find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
    next(error);
  }
});

// API endpoint for adding data
app.post('/api/data', async (req, res, next) => {
  try {
    // const { mvNumb, age } = req.body;
    const { mvNumb, mvTitle, yrMade, mvType, Crit, MPAA, Noms, Awrd, dirNumb } = req.body;

    // Validate that all data are present
    /*
    if (!mvNumb || !age) {
      res.status(400).json({ error: 'Please provide both name and age' });
      return;
    }

    // Validate that the age is a number
    if (isNaN(age)) {
      res.status(400).json({ error: 'Age must be a number' });
      return;
    }
*/

if (!mvNumb || !mvTitle || !yrMade || !mvType || !Crit || !MPAA || !Noms || !Awrd || !dirNumb) {
  res.status(400).json({ error: 'Please provide all information' });
  return;
}

// Validate that the age is a number
if (isNaN(mvNumb)) {
  res.status(400).json({ error: 'Movie Number must be a number' });
  return;
}
if (isNaN(yrMade)) {
  res.status(400).json({ error: 'Year Made must be a number' });
  return;
}
if (isNaN(Crit)) {
  res.status(400).json({ error: 'No. Crits must be a number' });
  return;
}
if (isNaN(Noms)) {
  res.status(400).json({ error: 'No. Nominations must be a number' });
  return;
}
if (isNaN(Awrd)) {
  res.status(400).json({ error: 'No. Awards must be a number' });
  return;
}
if (isNaN(dirNumb)) {
  res.status(400).json({ error: 'Director Number Awards must be a number' });
  return;
}
    // Insert the data into MongoDB
    //const result = await db.collection('Movie').insertOne({mvNumb, age });
    const result = await db.collection('MyUsersCollection').insertOne({ mvNumb, mvTitle, yrMade, mvType, Crit, MPAA, Noms, Awrd, dirNumb });

    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
});

// Error handlers
app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
