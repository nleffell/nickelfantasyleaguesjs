//#######Homepage Functions#######
async function createHomepageStandingsTable() {
  const homepageStandingsRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/homepage_current_standings_table.json");
  const json = await homepageStandingsRes.json();
  
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

async function createCurrentDraftPickOrderTable() {
  const currentDraftPickOrderRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/current_draft_pick_order.json");
  const json = await currentDraftPickOrderRes.json();
     
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

async function createPowerRankingsDynasty() {
  const powerRankingsDynastyRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json");
  const json = await powerRankingsDynastyRes.json();

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
  const powerRankingsSeasonRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json");
  const json = await powerRankingsSeasonRes.json();
  
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



//#######Records Page Functions#######
// Fetches all-time records from matchup_records.json and injects them into Webflow divs.
// Exposes window.createAllTimeRecords() for you to call on DOMContentLoaded.
async function createAllTimeRecords() {
  const DATA_URL = "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/matchup_records.json";

  // Helpers --------------------------------------------------------------
  const ensureNumber = (v) => (typeof v === "number" ? v : Number(v));

  const mapSelectors = {
    largest_mov: ".div-wbdw-records-largest-margin",
    highest_score: ".div-wbdw-records-highest-score",
    closest_mov: ".div-wbdw-records-smallest-margin",
    lowest_score: ".div-wbdw-records-lowest-score",
  };

  const prettyNames = {
    largest_mov: "Largest Margin",
    highest_score: "Highest Score",
    closest_mov: "Smallest Margin",
    lowest_score: "Lowest Score",
  };

  function groupTypes(arr) {
    const wanted = ["largest_mov", "highest_score", "closest_mov", "lowest_score"];
    const obj = {};
    for (const t of wanted) obj[t] = arr.find((r) => r.type === t) || null;
    return obj;
  }

  function renderSeason(recordsForSeason) {
    for (const [type, selector] of Object.entries(mapSelectors)) {
      const container = document.querySelector(selector);
      if (!container) continue; // fail-soft if the div isn't present
      container.innerHTML = "";

      const rec = recordsForSeason[type];
      if (!rec) {
        container.textContent = "—";
        continue;
      }

      const wrap = document.createElement("div");
      wrap.className = "wbdw-record"; // style in Webflow if desired

      const header = document.createElement("p");
      header.className = "wbdw-record-header";
      header.textContent = `${prettyNames[type]}`;

      const matchup = document.createElement("p");
      matchup.className = "wbdw-record-matchup";
      matchup.textContent = `${rec.owner} (${rec.team}) vs ${rec.opponent_owner} (${rec.opponent_team})`;

      const score = document.createElement("p");
      score.className = "wbdw-record-score";
      const ownerPts = ensureNumber(rec.owner_points).toFixed(2);
      const oppPts = ensureNumber(rec.opponent_points).toFixed(2);
      if (type === "highest_score" || type === "lowest_score") {
        score.textContent = `${ownerPts} - ${oppPts}`;
      } else {
        const margin = ensureNumber(rec.margin).toFixed(2);
        score.textContent = `Margin: ${margin} (${ownerPts} - ${oppPts})`;
      }

      const meta = document.createElement("p");
      meta.className = "wbdw-record-meta";
      const srcYear = rec.source_year ?? rec.year;
      const srcWeek = rec.source_week ?? rec.week;
      const weekStr = Number(srcWeek) ? `Week ${Number(srcWeek)}` : `Week ${srcWeek}`;
      meta.textContent = `${weekStr} • ${srcYear}`;

      wrap.append(header, matchup, score, meta);
      container.appendChild(wrap);
    }
  }

  // Fetch + prepare ------------------------------------------------------
  const res = await fetch(DATA_URL, { cache: "no-store" });
  const json = await res.json();
  const data = Array.isArray(json) ? json : [];

  // Filter to the pre-computed "all time" records in the feed
  const allTime = data.filter((d) => String(d.year).toLowerCase() === "all time");
  const regular = allTime.filter((r) => r.season_type === "regular");
  const postseason = allTime.filter((r) => r.season_type === "postseason");

  const grouped = {
    regular: groupTypes(regular),
    postseason: groupTypes(postseason),
  };

  // Initial render (default to regular season) ---------------------------
  const btnReg = document.querySelector(".button-wbdw-records-reg-season");
  const btnPost = document.querySelector(".button-wbdw-records-post-season");

  function setActive(which) {
    renderSeason(grouped[which]);
    if (btnReg && btnPost) {
      btnReg.classList.toggle("is-active", which === "regular");
      btnPost.classList.toggle("is-active", which === "postseason");
    }
  }

  if (btnReg) btnReg.addEventListener("click", () => setActive("regular"));
  if (btnPost) btnPost.addEventListener("click", () => setActive("postseason"));

  setActive("regular");
}

// Expose on window for easy calling from Webflow embeds
window.createAllTimeRecords = createAllTimeRecords;



//#######Owner Page Functions#######
async function createOwnerStats(owner) {
  const statsRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_aggregate_records.json");
  const json = await statsRes.json();

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

async function createOwnerDraftPicksTable(owner) {
  const ownerDraftPicksRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_draft_picks.json");
  const json = await ownerDraftPicksRes.json();

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

async function createOwnerRosterTable(owner) {
  const ownersRosterRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_rosters.json");
  const json = await ownersRosterRes.json();

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

async function createOwnerSeasonHistoryTable(owner) {
  const ownerSeasonHistoryRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_season_history.json");
  const json = await ownerSeasonHistoryRes.json();

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


//Bet Tracker Tables
function createBetTrackerOwnerRecordsTable() {
  const records = {};
  const rows = document.querySelectorAll("#table_wbdw_bet_tracker tbody tr");

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 6) return;

    const maker = cells[1].textContent.trim();
    const taker = cells[3].textContent.trim();
    const stakeText = cells[4].textContent.replace("$", "").trim();
    const winner = cells[5].textContent.trim().replace("</td>", "");
    const stake = parseFloat(stakeText);

    if (isNaN(stake) || !maker || !taker || !winner) return;
    if (winner.toLowerCase().includes("pending")) return;

    [maker, taker].forEach(name => {
      if (!(name in records)) {
        records[name] = { wins: 0, losses: 0, net: 0 };
      }
    });

    if (winner === maker) {
      records[maker].wins += 1;
      records[maker].net += stake;
      records[taker].losses += 1;
      records[taker].net -= stake;
    } else if (winner === taker) {
      records[taker].wins += 1;
      records[taker].net += stake;
      records[maker].losses += 1;
      records[maker].net -= stake;
    } else {
      if (!(winner in records)) {
        records[winner] = { wins: 0, losses: 0, net: 0 };
      }
      records[winner].wins += 1;
      records[winner].net += stake;
      if (winner !== maker) {
        records[maker].losses += 1;
        records[maker].net -= stake;
      }
      if (winner !== taker) {
        records[taker].losses += 1;
        records[taker].net -= stake;
      }
    }
  });

  // Sort by net descending
  const sorted = Object.entries(records).sort(([, a], [, b]) => b.net - a.net);

  // Output to table
  const tbody = document.querySelector("#table_wbdw_bet_tracker_owner_records tbody");
  tbody.innerHTML = "";

  sorted.forEach(([name, { wins, losses, net }]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${wins}</td>
      <td>${losses}</td>
      <td>$${net}</td>
    `;
    tbody.appendChild(row);
  });
}
