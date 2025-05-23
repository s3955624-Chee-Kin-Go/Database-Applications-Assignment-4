fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('data');
    data.forEach(item => {
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

      mvNumbCell.textContent = item.mvNumb;
      mvTitleCell.textContent = item.mvTitle;
      yrMadeCell.textContent = item.yrMade;
      mvTypeCell.textContent = item.mvType;
      CritCell.textContent = item.Crit;
      MPAACell.textContent = item.MPAA;
      NomsCell.textContent = item.Noms;
      AwrdCell.textContent = item.Awrd;
      dirNumbCell.textContent = item.dirNumb;

      row.appendChild(mvNumbCell);
      row.appendChild(mvTitleCell);
      row.appendChild(yrMadeCell);
      row.appendChild(mvTypeCell);
      row.appendChild(CritCell);
      row.appendChild(MPAACell);
      row.appendChild(NomsCell);
      row.appendChild(AwrdCell);
      row.appendChild(dirNumbCell);

      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error('Failed to fetch data', error));