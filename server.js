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
app.get('/api/listingsAndReviews', async (req, res, next) => {
  try {
    const { market, property_type, bedrooms } = req.query;
    // limit
    const limit = parseInt(req.query.limit) || null;

    // query
    const query = { "address.market": market };
    if (property_type)   query.property_type = property_type;
    if (bedrooms) {
      if (bedrooms === "8+") query.bedrooms = { $gte: 8 };
      else                   query.bedrooms = parseInt(bedrooms);
    }

    // build cursor
    let cursor = listingsCol
      .find(query)
      .project({ name:1, description:1, price:1, "review_scores.review_scores_rating":1 });
    if (limit) cursor = cursor.limit(limit);

    const listings = await cursor.toArray();
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

// insert into the "bookings" collection
app.post('/api/bookings', async (req, res, next) => {
  try {
    const {
      listing_id,
      start_date,
      end_date,
      client_name,
      email,
      daytime_phone,
      mobile_phone,
      postal_address,
      home_address
    } = req.body;

    // simple validation
    if (!listing_id || !start_date || !end_date || !client_name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookingsCol = db.collection('bookings');
    const now = new Date();
    const bookingId = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 12);

    const doc = {
      booking_id: bookingId,
      listing_id,
      start_date: new Date(start_date),
      end_date:   new Date(end_date),
      client_name,
      email,
      daytime_phone: daytime_phone || '',
      mobile_phone:  mobile_phone || '',
      postal_address: postal_address || '',
      home_address:   home_address || '',
      booking_date: now
    };

    await bookingsCol.insertOne(doc);
    res.status(201).json({ booking_id: bookingId });
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