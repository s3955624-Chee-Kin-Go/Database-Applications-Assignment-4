// Get references to DOM elements
const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('results-container');
const searchResults = document.getElementById('search-results');
const errorMessage = document.getElementById('error-message');

// Submit the form when the user clicks the submit button
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  // Hide previous results or errors
  resultsContainer.style.display = 'none';
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
  
  if (searchForm.checkValidity()) {
    try {
      const dirNumb = document.getElementById('dirNumb').value;
      
      // Send a POST request to the search endpoint
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dirNumb })
      });
      
      // Parse the JSON response
      const data = await response.json();
      
      // Check if the response is an error
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      // Clear previous search results
      searchResults.innerHTML = '';
      
      // Populate the table with search results
      data.forEach(movie => {
        const row = document.createElement('tr');
        
        const mvNumbCell = document.createElement('td');
        const mvTitleCell = document.createElement('td');
        const yrMadeCell = document.createElement('td');
        const mvTypeCell = document.createElement('td');
        const CritCell = document.createElement('td');
        const MPAACell = document.createElement('td');
        const NomsCell = document.createElement('td');
        const AwrdCell = document.createElement('td');
        const dirNumbCell = document.createElement('td');

        mvNumbCell.textContent = movie.mvNumb;
        mvTitleCell.textContent = movie.mvTitle;
        yrMadeCell.textContent = movie.yrMade;
        mvTypeCell.textContent = movie.mvType;
        CritCell.textContent = movie.Crit;
        MPAACell.textContent = movie.MPAA;
        NomsCell.textContent = movie.Noms;
        AwrdCell.textContent = movie.Awrd;
        dirNumbCell.textContent = movie.dirNumb;

        row.appendChild(mvNumbCell);
        row.appendChild(mvTitleCell);
        row.appendChild(yrMadeCell);
        row.appendChild(mvTypeCell);
        row.appendChild(CritCell);
        row.appendChild(MPAACell);
        row.appendChild(NomsCell);
        row.appendChild(AwrdCell);
        row.appendChild(dirNumbCell);

        searchResults.appendChild(row);
      });
      
      // Show the results container
      resultsContainer.style.display = 'block';
      
    } catch (error) {
      // Display error message
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
      console.error(error);
    }
  } else {
    // Mark the form as validated to show validation errors
    searchForm.classList.add('was-validated');
  }
});