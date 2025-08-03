async function createHomepageStandingsTable() {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/homepage_current_standings_table.json")
  .then(res => res.json());
  
  const tableContainer = document.querySelector('div.div-wbdw-home-standings');
  
  // Create the table element
  const table = document.createElement('table');
  table.classList.add('table-wbdw-home-standings');

  // Create the table header
  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Place</th>
    <th>Owner</th>
    <th>Team Name</th>
    <th>Record</th>
    <th>Points</th>
  `;
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Create the table body
  const tableBody = document.createElement('tbody');

  // Iterate through the JSON array
  json.forEach(item => {
    const row = document.createElement('tr');
    
    // Access properties of each object
    const place = item.place;
    const owner = item.owner;
    const teamName = item.team_name;
    const record = item.record;
    const points = item.points;

    // Create table cells and populate with data
    const placeCell = document.createElement('td');
    placeCell.textContent = place;
    row.appendChild(placeCell);

    const ownerCell = document.createElement('td');
    ownerCell.textContent = owner;
    row.appendChild(ownerCell);

    const teamNameCell = document.createElement('td');
    teamNameCell.textContent = teamName;
    row.appendChild(teamNameCell);

    const recordCell = document.createElement('td');
    recordCell.textContent = record;
    row.appendChild(recordCell);

    const pointsCell = document.createElement('td');
    pointsCell.textContent = points;
    row.appendChild(pointsCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Append the table body to the table
  table.appendChild(tableBody);

  // Append the table to the table container
  tableContainer.appendChild(table);
}

async function createStats(owner) {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_aggregate_records.json")
  .then(res => res.json());
  
  // Filter data for the owner
  var ownerData = json.filter(function(item) {
      return item.owner === `${owner}`;
  });

  // Create an HTML representation for the filtered data
  var htmlText = "<p>"
  htmlText +=  ownerData[0]['reg_record'] + " (" + ownerData[0]['reg_place'] + ")\n\n";
  htmlText +=  ownerData[0]['agg_record'] + " (" + ownerData[0]['agg_place'] + ")\n\n";
  htmlText +=  ownerData[0]['playoff_appearances'] + "/" + ownerData[0]['seasons'] + " (" + ownerData[0]['playoffs_pct_place'] + ")\n\n";
  htmlText +=  ownerData[0]['playoff_wins'] + " (" + ownerData[0]['playoff_wins_place'] + ")\n\n";
  htmlText += ownerData[0]['league_loser_count'];
  if (ownerData[0]['league_loser_count_place'] !== '') {
    htmlText += " (" + ownerData[0]['league_loser_count_place'] + ")";
  }
  
  htmlText += "</p>";

  // Display the HTML text on the page
  document.getElementById("text-wbdw-owners-statistics-right").innerHTML = htmlText;
}

async function createOwnersSeasonHistoryTable(owner) {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_season_history.json")

  var ownerData = json.filter(function (item) {
    return item.owner === `${owner}`;
  });
  
  // Sort the ownerData array in reverse chronological order based on the 'year' property
  ownerData.sort((a, b) => b.year - a.year);

  const tableContainer = document.querySelector('div.div-wbdw-owners-season-history');

  // Create the table element
  const table = document.createElement('table');
  table.classList.add('table-wbdw-owners-season-history');
  
  // Create the table header
  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Year</th>
    <th>Team</th>
    <th>Record</th>
    <th>Finish</th>
  `;
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Create the table body
  const tableBody = document.createElement('tbody');

  // Iterate through the JSON array
  ownerData.forEach(item => {
    const row = document.createElement('tr');

    // Access properties of each object
    const year = item.year;
    const team = item.team;
    const record = item.reg_record;
    const finish = item.finish;

    // Create table cells and populate with data
    const yearCell = document.createElement('td');
    yearCell.textContent = year;
    row.appendChild(yearCell);

    const teamCell = document.createElement('td');
    teamCell.textContent = team;
    row.appendChild(teamCell);

    const recordCell = document.createElement('td');
    recordCell.textContent = record;
    row.appendChild(recordCell);

    const finishCell = document.createElement('td');
    finishCell.textContent = finish;
    row.appendChild(finishCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Append the table body to the table
  table.appendChild(tableBody);

  // Append the table to the table container
  tableContainer.appendChild(table);
}



async function createOwnersRosterTable(owner) {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_rosters.json")

  var ownerData = json.filter(function (item) {
    return item.owner === `${owner}`;
  });
  
  // Sort the ownerData array in reverse chronological order based on the 'year' property
  ownerData.sort((a, b) => a.fp_rank - b.fp_rank);

  const tableContainer = document.querySelector('div.div-wbdw-owners-roster');

  // Create the table element
  const table = document.createElement('table');
  table.classList.add('table-wbdw-owners-roster');
  
  // Create the table header
  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Player</th>
    <th>Pos</th>
    <th>Tm</th>
    <th>Age</th>
    <th>Rnk</th>
    <th>Pos Rnk</th>
  `;
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Create the table body
  const tableBody = document.createElement('tbody');

  // Iterate through the JSON array
  ownerData.forEach(item => {
    const row = document.createElement('tr');

    // Access properties of each object
    const player = item.name;
    const roto = item.roto_link;
    const pos = item.position;
    const team = item.team;
    const age = item.age;
    const rnk = item.fp_rank;
    const posrnk = item.fp_pos_rank;

    // Create table cells and populate with data
    const playerRotoCell = document.createElement('td');
    const rotoLink = document.createElement('a'); // Create the <a> element
    rotoLink.id = 'roster-link'; // Set the id attribute
    rotoLink.textContent = player; // Set the content of the <a> element to the value of player
    rotoLink.href = roto; // Set the href attribute to make it a clickable link
    rotoLink.target = '_blank'; // Set the target attribute to make it open in a new tab
    playerRotoCell.appendChild(rotoLink); // Append the <a> element to the espnCell
    row.appendChild(playerRotoCell);

    const posCell = document.createElement('td');
    posCell.textContent = pos;
    row.appendChild(posCell);

    const teamCell = document.createElement('td');
    teamCell.textContent = team;
    row.appendChild(teamCell);

    const ageCell = document.createElement('td');
    ageCell.textContent = age;
    row.appendChild(ageCell);

    const rnkCell = document.createElement('td');
    rnkCell.textContent = rnk;
    row.appendChild(rnkCell);

    const posRnkCell = document.createElement('td');
    posRnkCell.textContent = posrnk;
    row.appendChild(posRnkCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Append the table body to the table
  table.appendChild(tableBody);

  // Append the table to the table container
  tableContainer.appendChild(table);
}

async function createOwnerDraftPicksTable(owner) {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_draft_picks.json")

  var ownerData = json.filter(function (item) {
    return item.owner === `${owner}`;
  });
  
  let tableContainer = document.querySelector('div.div-wbdw-owners-draft-picks');

  // Create the table element
  const table = document.createElement('table');
  table.classList.add('table-wbdw-owners-draft-picks');
  
  // Create the table header
  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Year</th>
    <th>Round</th>
    <th>Pick</th>
  `;
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Create the table body
  const tableBody = document.createElement('tbody');

  // Keep track of the previous year
  let previousYear = null;
  
  // Iterate through the JSON array
  ownerData.forEach(item => {
    const row = document.createElement('tr');

    // Access properties of each object
    const year = item.year;
    const round = item.round;
    const pick = item.pick;
    
    // Check if the year has changed
    if (previousYear !== null && year !== previousYear) {
        row.classList.add('year-split-row'); // Add the class to the row
    }
    previousYear = year; // Update the previous year

    // Create table cells and populate with data
    const yearCell = document.createElement('td');
    yearCell.textContent = year;
    row.appendChild(yearCell);

    const roundCell = document.createElement('td');
    roundCell.textContent = round;
    row.appendChild(roundCell);

    const pickCell = document.createElement('td');
    pickCell.textContent = pick;
    row.appendChild(pickCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Append the table body to the table
  table.appendChild(tableBody);

  // Append the table to the table container
  tableContainer.appendChild(table);
}


async function createPowerRankingsDynasty() {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json")

  json.sort((a, b) => b['Overall Value'] - a['Overall Value']);    
  const owners = json.map(item => item.Owner);
  const draftCapitalValues = json.map(item => item['Draft Capital Value']);
  const qbValues = json.map(item => item['QB Value']);
  const rbValues = json.map(item => item['RB Value']);
  const wrValues = json.map(item => item['WR Value']);
  const teValues = json.map(item => item['TE Value']);

  // Create a bar chart
  var ctx = document.getElementById('canvas-wbdw-power-rankings-dynasty').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: owners,
      datasets: [
        {
          label: 'QB Value',
          data: qbValues,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Bar color for QB Value
          borderColor: 'rgba(255, 99, 132, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'RB Value',
          data: rbValues,
          backgroundColor: 'rgba(255, 205, 86, 0.2)', // Bar color for RB Value
          borderColor: 'rgba(255, 205, 86, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'WR Value',
          data: wrValues,
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Bar color for WR Value
          borderColor: 'rgba(54, 162, 235, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'TE Value',
          data: teValues,
          backgroundColor: 'rgba(153, 102, 255, 0.2)', // Bar color for TE Value
          borderColor: 'rgba(153, 102, 255, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'Draft Capital Value',
          data: draftCapitalValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color for Draft Capital Value
          borderColor: 'rgba(75, 192, 192, 1)', // Border color
          borderWidth: 1 // Border width
        },
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'white', // Set the legend text color to white
          },
        },
      },
      scales: {
        x: {
          stacked: true, //enable stacking for X-axis
          ticks: {
            color: 'white', // Set the y-axis text color to white
            autoSkip: false, // Disable auto-skipping of ticks
          maxRotation: 90, // Adjust the rotation angle if needed
          },
        },
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            color: 'white', // Set the y-axis text color to white
          },
          // Optionally, you can add more Y-axis scale configuration here
        }
      }
    }
  });
}


async function createPowerRankingsSeason() {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json")
  
  // Sort the JSON data by the total value
  json.sort((a, b) => b.point_projection - a.point_projection); // Sort in descending order
  
  const owners = json.map(item => item.Owner); // Extract owners from the JSON

  // Extract and calculate the sum of value categories for each user
  const qbValue = json.map(item => item.qb_proj);
  const rbValue = json.map(item => item.rb_proj);
  const wrValue = json.map(item => item.wr_proj);
  const teValue = json.map(item => item.te_proj);
  const flexValue = json.map(item => item.flex_proj);

  // Create a bar chart
  var ctx = document.getElementById('canvas-wbdw-power-rankings-season').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: owners,
      datasets: [
        {
          label: 'QB Projection',
          data: qbValue,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Bar color for QB Value
          borderColor: 'rgba(255, 99, 132, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'RBs Projection',
          data: rbValue,
          backgroundColor: 'rgba(255, 205, 86, 0.2)', // Bar color for RB Value
          borderColor: 'rgba(255, 205, 86, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'WR Projections',
          data: wrValue,
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Bar color for WR Value
          borderColor: 'rgba(54, 162, 235, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'TE Projection',
          data: teValue,
          backgroundColor: 'rgba(153, 102, 255, 0.2)', // Bar color for TE Value
          borderColor: 'rgba(153, 102, 255, 1)', // Border color
          borderWidth: 1 // Border width
        },
        {
          label: 'Flex Projections',
          data: flexValue,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color for Draft Capital Value
          borderColor: 'rgba(75, 192, 192, 1)', // Border color
          borderWidth: 1 // Border width
        },
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'white', // Set the legend text color to white
          },
        },
      },
      scales: {
        x: {
          stacked: true, //enable stacking for X-axis
          ticks: {
            color: 'white', // Set the y-axis text color to white
            autoSkip: false, // Disable auto-skipping of ticks
          maxRotation: 90, // Adjust the rotation angle if needed
          },
        },
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            color: 'white', // Set the y-axis text color to white
          },
          // Optionally, you can add more Y-axis scale configuration here
        }
      }
    }
  });
}


async function createCurrentDraftPickOrderTable() {
  const json = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/current_draft_pick_order.json")
     
  let tableContainer = document.querySelector('div.div-wbdw-home-draft-pick-order') || 
                       document.querySelector('div.div-wbdw-home-draft-pick-order-post-season')

  const table = document.createElement('table');
  table.classList.add('table-wbdw-draft-pick-order');

  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Draft Pick</th>
    <th>Owner</th>
    <th>Team Name</th>
    <th>Points incl. Bench</th>
  `;
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Create the table body
  const tableBody = document.createElement('tbody');

  // Iterate through the JSON array
  json.forEach((item, index) => {
    const row = document.createElement('tr');
    
    // Access properties of each object
    const pick = item.pick;
    const owner = item.owner;
    const teamName = item.team_name;
    const points = item.points;

    // Create table cells and populate with data
    const pickCell = document.createElement('td');
    pickCell.textContent = pick;
    row.appendChild(pickCell);

    const ownerCell = document.createElement('td');
    ownerCell.textContent = owner;
    row.appendChild(ownerCell);

    const teamNameCell = document.createElement('td');
    teamNameCell.textContent = teamName;
    row.appendChild(teamNameCell);
    
    const pointsCell = document.createElement('td');
    pointsCell.textContent = points;
    row.appendChild(pointsCell);

    tableBody.appendChild(row);
  });
  
  const noteRow = document.createElement('tr');
  const noteCell = document.createElement('td');
  noteCell.colSpan = 4; // Span all columns
  noteCell.textContent = '* indicates confirmed draft order';
  noteCell.style.fontStyle = 'italic';
  noteRow.appendChild(noteCell);
  tableBody.appendChild(noteRow);

  table.appendChild(tableBody);

  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('table-scroll-wrapper');
  scrollWrapper.appendChild(table);
  tableContainer.appendChild(scrollWrapper);

}
