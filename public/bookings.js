// read listing_id from URL query string
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

window.addEventListener('DOMContentLoaded', () => {
  const listingId = getQueryParam('listing_id');
  if (!listingId) {
    alert('No listing specified.');
    return;
  }
  document.getElementById('listing_id').value = listingId;

  // bootstrap form validation
  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    e.stopPropagation();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const payload = {
      listing_id:    listingId,
      start_date:    document.getElementById('start_date').value,
      end_date:      document.getElementById('end_date').value,
      client_name:   document.getElementById('client_name').value.trim(),
      email:         document.getElementById('email').value.trim(),
      daytime_phone: document.getElementById('daytime_phone').value.trim(),
      mobile_phone:  document.getElementById('mobile_phone').value.trim(),
      postal_address:document.getElementById('postal_address').value.trim(),
      home_address:  document.getElementById('home_address').value.trim()
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Booking failed');
      }
      const { booking_id } = await res.json();
      alert(`Booking successful! Your booking ID is ${booking_id}`);
      window.location.href = '/'; 
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  });
});