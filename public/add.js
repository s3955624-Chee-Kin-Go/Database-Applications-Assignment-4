// Submit the form when the user clicks the submit button
const addForm = document.getElementById('addForm');
addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (addForm.checkValidity()) {
    try {
      const mvNumb = document.getElementById('mvNumb').value;
      const mvTitle = document.getElementById('mvTitle').value;
      const yrMade = document.getElementById('yrMade').value;
      const mvType = document.getElementById('mvType').value;
      const Crit = document.getElementById('Crit').value;
      const MPAA = document.getElementById('MPAA').value;
      const Noms = document.getElementById('Noms').value;
      const Awrd = document.getElementById('Awrd').value;
      const dirNumb = document.getElementById('dirNumb').value;
      // Send a POST request to the API endpoint
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mvNumb, mvTitle, yrMade, mvType, Crit, MPAA, Noms, Awrd, dirNumb })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Redirect to the home page after submitting the form
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  } else {
    addForm.classList.add('was-validated');
  }
});