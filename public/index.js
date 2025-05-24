window.addEventListener('DOMContentLoaded', async () => {
  const cities = ['Barcelona', 'Porto', 'Sydney', 'New York', 'Hong Kong', 'Istanbul', 'Kauai', 'Maui', 'Montreal'];
  const market = cities[Math.floor(Math.random() * cities.length)];

  const res = await fetch(`/api/listingsAndReviews?market=${market}&limit=10`);
  if (!res.ok) return;

  const listings = await res.json();
  const container = document.getElementById('results');

  if (listings.length === 0) {
    container.innerHTML = `<div class="alert alert-info">No stays found in ${market}.</div>`;
    return;
  }

  container.innerHTML = `<h1>Stay in ${market}</h1>`;

  container.innerHTML += listings.map(l => `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title" style="font-size: 20px">
          <a href="/bookings.html?listing_id=${l._id}">${l.name}</a>
        </h5>
        <p class="card-text">${l.description}</p>
        <p class="card-text">
          <strong>Daily Rate:</strong> $${l.price} &nbsp;
          <strong>Rating:</strong> ${l.review_scores.review_scores_rating}
        </p>
      </div>
    </div>
  `).join('');
});

document.getElementById('searchForm').addEventListener('submit', async e => {
  e.preventDefault();

  const market       = document.getElementById('market').value.trim();
  const propertyType = document.getElementById('propertyType').value;
  const bedrooms     = document.getElementById('bedrooms').value;

  if (!market) {
    alert('Location is required');
    return;
  }

  const params = new URLSearchParams({ market });
  if (propertyType) params.append('property_type', propertyType);
  if (bedrooms)     params.append('bedrooms', bedrooms);

  const res = await fetch(`/api/listingsAndReviews?${params}`);
  if (!res.ok) {
    document.getElementById('results').innerHTML =
      `<div class="alert alert-danger">Error fetching listings</div>`;
    return;
  }

  const listings = await res.json();
  const container = document.getElementById('results');
  if (listings.length === 0) {
    container.innerHTML = `<div class="alert alert-info"><h1>0 Listing that match your preferences</h1></div>`;
    return;
  }

  container.innerHTML = `<h1>${listings.length} Listings that match your preferences</h1>`;
  // build cards
  container.innerHTML += listings.map(l => `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title" style="font-size: 24px">
          <a href="/bookings.html?listing_id=${l._id}">${l.name}</a>
        </h5>
        <p class="card-text">${l.description}</p>
        <p class="card-text">
          <strong>Daily Rate:</strong> $${l.price}
        </p>
        <p class="card-text">
          <strong>Customer Rating:</strong> ${l.review_scores.review_scores_rating || 'N/A'}
        </p>
      </div>
    </div>
  `).join('');
});
