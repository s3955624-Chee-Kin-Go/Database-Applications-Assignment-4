const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// replace with your actual connection string
const uri = "mongodb+srv://admin:admin@cluster1.u70va65.mongodb.net/?retryWrites=true&w=majority&appName=cluster1";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Mongo connection error', err);
  }
}

connectDB();

const db = client.db("Assignment4");
const listingsCol = db.collection('listingsAndReviews');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: fetch filtered listings
app.get('/api/listings', async (req, res, next) => {
  try {
    const { market, property_type, bedrooms } = req.query;
    const filter = { "address.market": market };
    if (property_type)   filter.property_type = property_type;
    if (bedrooms)        filter.bedrooms = parseInt(bedrooms);

    const listings = await listingsCol
      .find(filter)
      .project({ "name":1, "description":1, "price":1, "review_scores.review_scores_rating":1 })
      .toArray();

      const formattedListings = listings.map(l => ({
      ...l,
      price: l.price?.toString() || 'N/A',
      review_scores: {
        review_scores_rating: l.review_scores?.review_scores_rating ?? 'N/A'
      }
    }));

    res.json(formattedListings);
  } catch (err) {
    next(err);
  }
});

// serve home page
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// error handlers
app.use((req, res) => res.status(404).send('Not found'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));