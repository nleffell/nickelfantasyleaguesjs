//#######Homepage Functions#######
//Creates current standings table for home page
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
    <th>Agg.*</th>
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
    const aggRec = item.agg_record

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

    const aggRecordCell = document.createElement('td');
    aggRecordCell.textContent = aggRec;
    row.appendChild(aggRecordCell);

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

  const noteRow = document.createElement('tr');
  const noteCell = document.createElement('td');
  noteCell.colSpan = 6; // Span all columns
  noteCell.textContent = '* Aggregate Record is a team\'s record if they played all other teams every week';
  noteCell.style.fontStyle = 'italic';
  noteRow.appendChild(noteCell);
  tableBody.appendChild(noteRow);
  table.appendChild(tableBody);

  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('table-scroll-wrapper');
  scrollWrapper.appendChild(table);
  tableContainer.appendChild(scrollWrapper);
}


//Creates draft pick order table for home page
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


// Create draft board for homepage
async function createDraftBoard() {
  // Fetch projected draft pick order
  const draftOrderRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/current_draft_pick_order.json");
  const draftOrderJson = await draftOrderRes.json();

  // Fetch draft pick ownership info
  const ownerDraftPicksRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_draft_picks.json");
  const ownerDraftPicksJson = await ownerDraftPicksRes.json();

  // ------------------------------------------------------------
  // Determine the closest/upcoming draft year
  // ------------------------------------------------------------
  const draftYear = Math.min(...ownerDraftPicksJson.map(p => Number(p.year)));

  // ------------------------------------------------------------
  // Helper: get original owner from a pick string
  //
  // "TBD"                  -> null
  // "TBD (Chad Hill)"      -> "Chad Hill"
  // ------------------------------------------------------------
  const getOriginalOwnerFromPick = pickStr => {
    const match = pickStr.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : null;
  };

  // ------------------------------------------------------------
  // Find the current owner of an original owner's pick
  // for a specific year and round.
  //
  // If the original owner still owns their pick:
  //   owner = originalOwner
  //   pick = "TBD"
  //
  // If it was traded:
  //   owner = current owner
  //   pick = "TBD (Original Owner)"
  // ------------------------------------------------------------
  const getCurrentPickOwner = (originalOwner, round) => {
    const picks = ownerDraftPicksJson.filter(
      p =>
        Number(p.year) === draftYear &&
        Number(p.round) === round
    );

    // First look for a traded pick that originally belonged
    // to this projected owner.
    const tradedPick = picks.find(
      p => getOriginalOwnerFromPick(p.pick) === originalOwner
    );

    if (tradedPick) {
      return tradedPick.owner;
    }

    // If there is no traded version, the original owner
    // still owns their own pick.
    const originalPick = picks.find(
      p =>
        p.owner === originalOwner &&
        !getOriginalOwnerFromPick(p.pick)
    );

    if (originalPick) {
      return originalPick.owner;
    }

    // Fallback — this should only happen if the pick is missing
    // from the ownership JSON.
    return originalOwner;
  };

  // ------------------------------------------------------------
  // Table container
  // ------------------------------------------------------------
  const tableContainer = document.querySelector(
    "div.div-wbdw-home-draft-board"
  );

  if (!tableContainer) {
    console.error(
      "Draft board container not found: .div-wbdw-home-draft-board"
    );
    return;
  }

  // Clear existing board in case function is called more than once
  tableContainer.innerHTML = "";

  // ------------------------------------------------------------
  // Create table
  // ------------------------------------------------------------
  const table = document.createElement("table");
  table.classList.add("table-wbdw-draft-board");

  // ------------------------------------------------------------
  // Header row = projected draft order
  // ------------------------------------------------------------
  const headerRow = document.createElement("tr");

  // Blank first column
  const blankHeader = document.createElement("th");
  blankHeader.textContent = "";
  headerRow.appendChild(blankHeader);

  draftOrderJson.forEach(item => {
    const th = document.createElement("th");

    th.textContent = `${item.pick} (${item.owner})`;

    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // ------------------------------------------------------------
  // Rows for rounds 1–4
  // ------------------------------------------------------------
  for (let round = 1; round <= 4; round++) {
    const row = document.createElement("tr");

    // Round label
    const roundCell = document.createElement("td");
    roundCell.textContent = `Round ${round}`;
    row.appendChild(roundCell);

    // Each column represents an original/projected draft slot
    draftOrderJson.forEach((projPick, colIndex) => {
      const originalOwner = projPick.owner;

      // Find who currently owns this particular original pick
      const currentOwner = getCurrentPickOwner(
        originalOwner,
        round
      );

      const cell = document.createElement("td");

      cell.textContent =
        `${round}.${String(colIndex + 1).padStart(2, "0")} - ${currentOwner}`;

      row.appendChild(cell);
    });

    table.appendChild(row);
  }

  // ------------------------------------------------------------
  // Add year label
  // ------------------------------------------------------------
  const yearLabel = document.createElement("div");
  yearLabel.classList.add("draft-board-year");
  yearLabel.textContent = `${draftYear} Draft`;

  // ------------------------------------------------------------
  // Scroll wrapper
  // ------------------------------------------------------------
  const scrollWrapper = document.createElement("div");
  scrollWrapper.classList.add("table-scroll-wrapper");
  scrollWrapper.appendChild(table);

  tableContainer.appendChild(yearLabel);
  tableContainer.appendChild(scrollWrapper);
}


//Creates dynasty power rankings for home page
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


//Create Current season power rankings for home page
async function createPowerRankingsSeason() {
  const powerRankingsSeasonRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json");
  const json = await powerRankingsSeasonRes.json();
  
  // Sort the JSON data by the total value
  json.sort((a, b) => b.projected_points - a.projected_points); // Sort in descending order

  const owners = json.map(item => item.Owner); 
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
          label: 'RB Projection',
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
//#######End Homepage Functions#######


//#######Records Page Functions#######
// Fetches weekly records from record.json
async function createWeeklyRecords() {

  const RECORDS = {
    largest_mov: {
      card: '[data-record="largest-margin"]',
      label: "Largest Margin"
    },
    most_points: {
      card: '[data-record="highest-score"]',
      label: "Highest Score"
    },
    smallest_mov: {
      card: '[data-record="smallest-margin"]',
      label: "Smallest Margin"
    },
    least_points: {
      card: '[data-record="lowest-score"]',
      label: "Lowest Score"
    }
  };

  // Format numbers as XX.XX
  const nfmt = (value) => {
    const num = Number(value);
    return Number.isFinite(num)
      ? num.toFixed(2)
      : "—";
  };

  // Get the four records from a specific group
  function pickByType(arr) {

    const byBase = {};

    for (const record of arr) {

      const base = (record.record_name || "")
        .replace("_playoffs", "");

      if (!(base in byBase)) {
        byBase[base] = record;
      }
    }

    return byBase;
  }


  // Populate the four cards
  function render(group) {

    Object.entries(RECORDS).forEach(
      ([jsonKey, config]) => {

        const card = document.querySelector(
          config.card
        );

        if (!card) return;

        const record = group[jsonKey];

        const valueElement =
          card.querySelector("[data-record-value]");

        const ownerElement =
          card.querySelector("[data-record-owner]");

        const detailsElement =
          card.querySelector("[data-record-details]");


        // No record found
        if (!record) {

          valueElement.textContent = "—";
          ownerElement.textContent = "";
          detailsElement.textContent = "";

          return;
        }


        // Main value
        valueElement.textContent =
          nfmt(record.value);


        // Owner
        ownerElement.textContent =
          record.owner ?? "—";


        // Details
        const year =
          record.year ?? "—";

        const week =
          record.week ?? "—";

        const opponent =
          record.opponent_owner ?? "—";


        detailsElement.innerHTML = `
          <span>${year}</span>
          <span>Week ${week}</span>
          <span>vs ${opponent}</span>
        `;
      }
    );
  }


  // --------------------------------------------------
  // Fetch records JSON
  // --------------------------------------------------

  const response = await fetch(
    "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/records.json"
  );

  const data = await response.json();


  // Only weekly records
  const weeklyRecords =
    (Array.isArray(data) ? data : [])
      .filter(record => record.weekly_flag === true);


  // Separate regular season and playoffs
  const groups = {

    regular: pickByType(
      weeklyRecords.filter(
        record => record.reg_season_flag === true
      )
    ),

    playoffs: pickByType(
      weeklyRecords.filter(
        record => record.reg_season_flag === false
      )
    )

  };


  // --------------------------------------------------
  // Regular Season / Playoffs buttons
  // --------------------------------------------------

  const regularButton =
    document.querySelector(
      '[data-record-type="regular"]'
    );

  const playoffsButton =
    document.querySelector(
      '[data-record-type="playoffs"]'
    );


  function setActive(type) {

    render(groups[type]);


    regularButton?.classList.toggle(
      "is-active",
      type === "regular"
    );


    playoffsButton?.classList.toggle(
      "is-active",
      type === "playoffs"
    );

  }


  // Button events
  regularButton?.addEventListener(
    "click",
    () => setActive("regular")
  );


  playoffsButton?.addEventListener(
    "click",
    () => setActive("playoffs")
  );


  // Default to regular season
  setActive("regular");

}


// Fetches yearly records from record.json
async function createYearlyRecords() {

  const RECORDS = {
    best_record: {
      card: '[data-season-record="best-record"]'
    },
    worst_record: {
      card: '[data-season-record="worst-record"]'
    },
    most_points: {
      card: '[data-season-record="most-points"]'
    },
    least_points: {
      card: '[data-season-record="least-points"]'
    }
  };


  // Format the record value
  function formatValue(recordName, value) {

    // Best / worst record
    if (
      recordName === "best_agg_record" ||
      recordName === "worst_agg_record"
    ) {
      return value ?? "—";
    }

    // Points
    const num = Number(value);

    return Number.isFinite(num)
      ? num.toFixed(2)
      : "—";
  }


  // Populate the four cards
  function render(records) {

    Object.entries(RECORDS).forEach(
      ([cardName, config]) => {

        const card = document.querySelector(
          config.card
        );

        if (!card) return;


        /*
         * Map our card names to the record names
         * used in records.json
         */
        const recordNameMap = {
          best_record: "best_agg_record",
          worst_record: "worst_agg_record",
          most_points: "most_points",
          least_points: "least_points"
        };


        const recordName =
          recordNameMap[cardName];

        const record =
          records[recordName];


        const valueElement =
          card.querySelector(
            "[data-season-value]"
          );

        const ownerElement =
          card.querySelector(
            "[data-season-owner]"
          );

        const detailsElement =
          card.querySelector(
            "[data-season-details]"
          );


        // No record
        if (!record) {

          valueElement.textContent = "—";
          ownerElement.textContent = "";
          detailsElement.textContent = "";

          return;
        }


        // Main value
        valueElement.textContent =
          formatValue(
            recordName,
            record.value
          );


        // Owner
        ownerElement.textContent =
          record.owner ?? "—";


        // Year
        detailsElement.innerHTML = `
          <span>${record.year ?? "—"}</span>
        `;

      }
    );
  }


  // --------------------------------------------------
  // Fetch records JSON
  // --------------------------------------------------

  const response = await fetch(
    "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/records.json"
  );

  const data = await response.json();


  // --------------------------------------------------
  // Get season records
  //
  // Season records are:
  // - not weekly
  // - regular season
  // --------------------------------------------------

  const yearlyRecords =
    (Array.isArray(data) ? data : [])
      .filter(
        record =>
          record.weekly_flag === false &&
          record.reg_season_flag === true
      );


  // --------------------------------------------------
  // Create lookup by record name
  // --------------------------------------------------

  const recordsByName = {};

  yearlyRecords.forEach(record => {

    if (record.record_name) {
      recordsByName[record.record_name] =
        record;
    }

  });


  // Render
  render(recordsByName);

}


// Gets weekly award winners table
async function createWeeklyAwardsTable() {
  const weeklyAwardsRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/weekly_awards_history.json");

  const json = await weeklyAwardsRes.json();

  const tableContainer = document.querySelector("div.div-wbdw-records-weekly-awards");

  if (!tableContainer) return;

  // Clear existing content
  tableContainer.innerHTML = "";

  // --------------------------------------------------
  // Flatten nested JSON:
  //
  // Year
  //   -> Week
  //       -> Award
  //           -> Owner / Value
  // --------------------------------------------------

  const awards = [];

  Object.entries(json).forEach(([year, weeks]) => {
    Object.entries(weeks).forEach(([week, weekAwards]) => {
      Object.entries(weekAwards).forEach(([award, data]) => {
        awards.push({
          year: Number(year),
          week: Number(week),
          award: award,
          owner: data.owner,
          value: data.value
        });
      });
    });
  });

  // --------------------------------------------------
  // Sort newest year/week first
  // --------------------------------------------------

  awards.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }

    return b.week - a.week;
  });

  // --------------------------------------------------
  // Create table
  // --------------------------------------------------

  const table = document.createElement("table");
  table.classList.add("table-wbdw-weekly-awards");

  // Header
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");

  headerRow.innerHTML = `
    <th>Year</th>
    <th>Week</th>
    <th>Award</th>
    <th>Owner</th>
    <th>Value</th>
  `;

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Body
  const tableBody = document.createElement("tbody");

  awards.forEach(item => {
    const row = document.createElement("tr");

    const yearCell = document.createElement("td");
    yearCell.textContent = item.year;
    row.appendChild(yearCell);

    const weekCell = document.createElement("td");
    weekCell.textContent = item.week;
    row.appendChild(weekCell);

    const awardCell = document.createElement("td");
    awardCell.textContent = item.award;
    row.appendChild(awardCell);

    const ownerCell = document.createElement("td");
    ownerCell.textContent = item.owner;
    row.appendChild(ownerCell);

    const valueCell = document.createElement("td");

    // Format values based on award type
    if (item.award === "most efficient manager") {
      valueCell.textContent = `${(Number(item.value) * 100).toFixed(1)}%`;
    } else {
      valueCell.textContent = Number(item.value).toFixed(2);
    }

    row.appendChild(valueCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);

  // --------------------------------------------------
  // Scroll wrapper
  // --------------------------------------------------

  const scrollWrapper = document.createElement("div");
  scrollWrapper.classList.add("table-scroll-wrapper");
  scrollWrapper.appendChild(table);

  tableContainer.appendChild(scrollWrapper);
}


// Creates trade count table
async function createTradeCountTable() {
  // Fetch trade history JSON
  const tradeHistoryRes = await fetch("https://raw.githubusercontent.com/nleffell/nickelfantasyleaguesjs/refs/heads/main/wbdw_jsons/website_jsons/trade_history.json");
  const tradeHistory = await tradeHistoryRes.json();

  // Select container div
  const tableContainer = document.querySelector('div.div-wbdw-records-trade-count');

  // Group entries by trade_id so each trade has both participants
  const tradesById = {};
  tradeHistory.forEach(entry => {
    const id = entry.trade_id;
    if (!tradesById[id]) tradesById[id] = [];
    tradesById[id].push(entry.owner);
  });

  // Build trade stats per owner
  const tradeStats = {};

  Object.entries(tradesById).forEach(([tradeId, owners]) => {
    if (owners.length < 2) return; // skip incomplete trades
    const [ownerA, ownerB] = owners;

    // Initialize owner records
    if (!tradeStats[ownerA]) tradeStats[ownerA] = { count: 0, partners: {} };
    if (!tradeStats[ownerB]) tradeStats[ownerB] = { count: 0, partners: {} };

    // Increment total trades
    tradeStats[ownerA].count++;
    tradeStats[ownerB].count++;

    // Track partner frequencies
    tradeStats[ownerA].partners[ownerB] = (tradeStats[ownerA].partners[ownerB] || 0) + 1;
    tradeStats[ownerB].partners[ownerA] = (tradeStats[ownerB].partners[ownerA] || 0) + 1;
  });

  // Convert to displayable array
  const tradeArray = Object.entries(tradeStats).map(([owner, data]) => {
    const maxCount = Math.max(...Object.values(data.partners));
    const mostPopularPartners = Object.entries(data.partners)
      .filter(([_, count]) => count === maxCount)
      .map(([partner]) => partner)
      .join(', ');

    return {
      owner,
      tradeCount: data.count,
      mostPopular: mostPopularPartners
    };
  });

  // Sort by trade count descending
  tradeArray.sort((a, b) => b.tradeCount - a.tradeCount);

  // Create the table element
  const table = document.createElement('table');
  table.classList.add('table-wbdw-records-trade-count');

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Owner</th>
    <th>Trade Count</th>
    <th>Most Popular Partner(s)</th>
  `;
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  tradeArray.forEach(item => {
    const row = document.createElement('tr');

    const ownerCell = document.createElement('td');
    ownerCell.textContent = item.owner;
    row.appendChild(ownerCell);

    const countCell = document.createElement('td');
    countCell.textContent = item.tradeCount;
    row.appendChild(countCell);

    const partnerCell = document.createElement('td');
    partnerCell.textContent = item.mostPopular;
    row.appendChild(partnerCell);

    tbody.appendChild(row);
  });

  // Add total trades row
  const totalTrades = Math.max(...tradeHistory.map(t => t.trade_id));
  const totalRow = document.createElement('tr');
  totalRow.classList.add('trade-total-row');
  totalRow.innerHTML = `
    <td colspan="3" style="font-weight:bold; text-align:center;">
      Total Trades: ${totalTrades}
    </td>
  `;
  tbody.appendChild(totalRow);

  table.appendChild(tbody);

  // Wrap for scroll
  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('table-scroll-wrapper');
  scrollWrapper.appendChild(table);

  tableContainer.appendChild(scrollWrapper);
}
//#######End Records Page Functions#######


//#######Individual Owner Pages Functions#######
//Create individual owner record information table
async function createOwnerRecords(owner) {
  const statsRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_aggregate_records.json");
  const json = await statsRes.json();

  // Filter data for the owner
  var ownerData = json.filter(function(item) {
      return item.owner === `${owner}`;
  });

  // Fetch power rankings
  const prRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json");
  const prJson = await prRes.json();

  //helper function
  function ordinalSuffix(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  
  const sortedDynasty = [...prJson].sort((a, b) => b['Overall Value'] - a['Overall Value']); // Sort all owners by Dynasty value
  const dynastyIndex = sortedDynasty.findIndex(item => item.Owner === `${owner}`);
  const dynastyPowerRank = dynastyIndex >= 0 ? ordinalSuffix(dynastyIndex + 1) : "N/A";

  const sortedSeason = [...prJson].sort((a, b) => b.projected_points - a.projected_points); // Sort all owners by remaining projected points
  const seasonIndex = sortedSeason.findIndex(item => item.Owner === `${owner}`); 
  const seasonPowerRank = seasonIndex >= 0 ? ordinalSuffix(seasonIndex + 1) : "N/A";
  
  // Create an HTML representation for the filtered data
  var htmlText = "<p>"
  htmlText +=  ownerData[0]['avg_finish'] + " (" + ownerData[0]['avg_finish_place'] + ")\n\n";
  htmlText +=  ownerData[0]['reg_record'] + " (" + ownerData[0]['reg_place'] + ")\n\n";
  htmlText +=  ownerData[0]['agg_record'] + " (" + ownerData[0]['agg_place'] + ")\n\n";
  htmlText +=  dynastyPowerRank + "\n\n";
  htmlText +=  seasonPowerRank + "\n\n";
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


//Create individual owner draft picks table
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


//Create table of individual rosters for each owner
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


//Create season history table for individual owner pages
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
//#######End Individual Owner Pages Functions#######



//#######Bet Tracker Page Functions#######
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
    const winnerLower = winner.toLowerCase();
    if (winnerLower.includes("pending") || winnerLower.includes("void")) return;

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
      <td>$${net.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Preseason Championship Odds table creation
async function createPreseasonChampionshipOdds() {
  // --- Fetch owner odds JSON ---
  const ownerSeasonHistoryRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_odds.json");
  const json = await ownerSeasonHistoryRes.json();

  // --- Filter preseason championship odds for the latest year we have them ---
  const latestYear = Math.max(...json.map(d => Number(d.year)));
  const data = json.filter(d =>
    Number(d.year) === latestYear &&
    d.season === "preseason" &&
    d.type === "championship"
  );

  // --- Process rows ---
  const rows = data
    .map(d => {
      const o = d.championship_odds;
      return { name: d.owner, odds: o, prob: (o > 0 ? 100 / (o + 100) : (-o) / ((-o) + 100)) };
    })
    .filter(r => Number.isFinite(r.prob))
    .sort((a, b) => b.prob - a.prob);

  // --- Fill cards (assumes you have same number of .team-card blocks as in data) ---
  const cards = [...document.querySelectorAll(".div-wbdw-bet-tracker-odds-team")];
  cards.forEach((card, i) => {
    const r = rows[i];
    if (!r) return;

    const nameEl = card.querySelector(".text-wbdw-bet-tracker-owner");
    const oddsEl = card.querySelector(".text-wbdw-bet-tracker-odds");
    const probEl = card.querySelector(".text-wbdw-bet-tracker-prob");

    if (nameEl) nameEl.textContent = r.name;
    if (oddsEl) oddsEl.textContent = (r.odds > 0 ? `+${r.odds}` : r.odds);
    if (probEl) probEl.textContent = (`${(r.prob * 100).toFixed(1)}%`);
  });
};
//#######End Bet Tracker Page Functions#######



//########Owner Page Functions#######
async function createOwnerStats() {
  const statsRes = await fetch("https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_aggregate_records.json");
  const json = await statsRes.json();

  // Helper: builds "Owner A, Owner B - N" for any metric by max count
  function leaderByCount(data, placeCol, countCol, formatter = v => v) {
    const owners = data.filter(d => d[placeCol] === "1st" || d[placeCol] === "T-1st");

    const names = owners.map(d => d.owner).filter(Boolean).join(", ");
    const value = formatter(owners[0][countCol]);

    return `${value} - ${names}`;
  }

  const champStr = leaderByCount(json, "championships_place", "championships");
  const loserStr = leaderByCount(json, "league_loser_count_place", "league_loser_count");
  const ppStr = leaderByCount(json, "playoffs_pct_place", "playoff_pct", v => (v * 100).toFixed(0) + "%");
  const pwStr = leaderByCount(json, "playoff_wins_place", "playoff_wins");
  const afStr = leaderByCount(json, "avg_finish_place", "avg_finish");

    // Map the strings to your div class names
  const mapSelectors = {
    champ: champStr,
    loser: loserStr,
    "playoff-pct": ppStr,
    "playoff-wins": pwStr,
    "avg-finish": afStr
  };

  // Render into various divs
  for (const [key, text] of Object.entries(mapSelectors)) {
    const el = document.querySelector(`.div-wbdw-owners-records-${key}`);
    if (el) {
      el.innerHTML += `<div>${text}</div>`; // or innerHTML if you want formatting
    }
  }
}
//########End Owner Page Functions#######



//########KEEPER LEAGUE FUNCTIONS#######
async function create_eligible_keepers() {

    const jsonUrl = "https://scripts.nickelfantasyleagues.com/keeper_jsons/website_jsons/eligible_keepers_by_year.json";

    const ownerSelect = document.getElementById("keeper-owner-select");
    const keeperList = document.getElementById("keeper-list");
    const keeperHeader = document.querySelector(".keeper-header");

    try {

        const response = await fetch(jsonUrl);
        const data = await response.json();

        // ---------------------------------------------
        // Get the most recent year
        // ---------------------------------------------

        const maxYear = Math.max(...Object.keys(data).map(Number));
        const yearData = data[maxYear];


        // ---------------------------------------------
        // Create sortable player array
        // ---------------------------------------------

        const players = [];

        Object.values(yearData).forEach(roster => {

            Object.entries(roster).forEach(([playerName, player]) => {

                players.push({
                    playerName: playerName,
                    ...player
                });

            });

        });


        // ---------------------------------------------
        // Sort Owner → Keeper Round → Player
        // ---------------------------------------------

        players.sort((a, b) => {

            if (a.owner !== b.owner) {
                return a.owner.localeCompare(b.owner);
            }

            if (a.keeper_round !== b.keeper_round) {
                return a.keeper_round - b.keeper_round;
            }

            return a.playerName.localeCompare(b.playerName);

        });


        // ---------------------------------------------
        // Populate owner dropdown
        // ---------------------------------------------

        const owners = [
            ...new Set(players.map(player => player.owner))
        ];

        ownerSelect.innerHTML = `
            <option value="all">All Owners</option>
        `;

        owners.forEach(owner => {

            ownerSelect.innerHTML += `
                <option value="${owner}">${owner}</option>
            `;

        });


        // ---------------------------------------------
        // Render table
        // ---------------------------------------------

        function renderTable(selectedOwner = "all") {

            keeperList.innerHTML = "";


            // -----------------------------------------
            // Determine columns
            // -----------------------------------------

            if (selectedOwner === "all") {

                keeperHeader.style.gridTemplateColumns =
                    "1.5fr 4fr 0.75fr 1fr 1fr 2fr";

                keeperHeader.children[0].style.display = "";

            } else {

                keeperHeader.style.gridTemplateColumns =
                    "4fr 0.75fr 1fr 1fr 2fr";

                keeperHeader.children[0].style.display = "none";

            }


            // -----------------------------------------
            // Filter selected owner
            // -----------------------------------------

            const filteredPlayers = selectedOwner === "all"
                ? players
                : players.filter(player => player.owner === selectedOwner);


            // -----------------------------------------
            // Create rows
            // -----------------------------------------

            filteredPlayers.forEach(player => {

                // -------------------------------------
                // Determine keeper status
                // -------------------------------------

                let statusText;
                let statusClass;

                if (player.keeper_round === 0) {

                    statusText = "1st Round Pick";
                    statusClass = "ineligible";

                }
                else if (player.years_kept_consecutively >= 3) {

                    statusText = "Max Years Reached";
                    statusClass = "ineligible";

                }
                else if (player.years_kept_consecutively === 2) {

                    statusText = "Final Year";
                    statusClass = "warning";

                }
                else {

                    statusText = "Eligible";
                    statusClass = "eligible";

                }


                // -------------------------------------
                // Create row
                // -------------------------------------

                const row = document.createElement("div");

                row.className = `keeper-row ${statusClass}`;


                // -------------------------------------
                // All Owners view
                // -------------------------------------

                if (selectedOwner === "all") {

                    row.style.gridTemplateColumns =
                        "1.5fr 4fr 0.75fr 1fr 1fr 2fr";

                    row.innerHTML = `
                        <div class="owner-cell">
                            <strong>Owner</strong>
                            <span>${player.owner}</span>
                        </div>

                        <div class="player-cell player-name">
                            ${player.playerName}
                        </div>

                        <div class="position-cell">
                            <strong>Pos</strong>
                            <span>${player.position}</span>
                        </div>

                        <div class="round-cell">
                            <strong>Round</strong>
                            <span>${player.keeper_round}</span>
                        </div>

                        <div class="years-cell">
                            <strong>Years</strong>
                            <span>${player.years_kept_consecutively}</span>
                        </div>

                        <div class="status-cell">
                            <strong>Status</strong>
                            <span class="status ${statusClass}">
                                ${statusText}
                            </span>
                        </div>
                    `;

                }


                // -------------------------------------
                // Individual Owner view
                // -------------------------------------

                else {

                    row.style.gridTemplateColumns =
                        "4fr 0.75fr 1fr 1fr 2fr";

                    row.innerHTML = `
                        <div class="player-cell player-name">
                            ${player.playerName}
                        </div>

                        <div class="position-cell">
                            <strong>Pos</strong>
                            <span>${player.position}</span>
                        </div>

                        <div class="round-cell">
                            <strong>Round</strong>
                            <span>${player.keeper_round}</span>
                        </div>

                        <div class="years-cell">
                            <strong>Years</strong>
                            <span>${player.years_kept_consecutively}</span>
                        </div>

                        <div class="status-cell">
                            <strong>Status</strong>
                            <span class="status ${statusClass}">
                                ${statusText}
                            </span>
                        </div>
                    `;

                }


                keeperList.appendChild(row);

            });

        }


        // ---------------------------------------------
        // Initial render
        // ---------------------------------------------

        renderTable();


        // ---------------------------------------------
        // Owner dropdown
        // ---------------------------------------------

        ownerSelect.addEventListener("change", function () {

            renderTable(this.value);

        });


    } catch (err) {

        console.error("Error loading eligible keepers:", err);

        keeperList.innerHTML = `
            <div class="keeper-row">
                <div style="grid-column:1/-1;text-align:center;padding:20px;">
                    Unable to load eligible keepers.
                </div>
            </div>
        `;

    }

}


//########END KEEPER LEAGUE FUNCTIONS#######

