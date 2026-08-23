//#######Homepage Functions#######


// ============================================================
// CURRENT STANDINGS
// ============================================================

async function createHomepageStandingsTable() {

  const response = await fetch(
    "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/homepage_current_standings_table.json"
  );

  const json = await response.json();


  const tableContainer =
    document.querySelector(
      ".wbdw-home-standings-table-wrapper"
    );


  if (!tableContainer) {
    return;
  }


  tableContainer.innerHTML = "";


  const table =
    document.createElement("table");

  table.classList.add(
    "table-wbdw-home-standings"
  );


  table.innerHTML = `
    <thead>
      <tr>
        <th>Place</th>
        <th>Owner</th>
        <th>Team Name</th>
        <th>Record</th>
        <th>Agg.*</th>
        <th>Points</th>
      </tr>
    </thead>

    <tbody></tbody>
  `;


  const tableBody =
    table.querySelector("tbody");


  json.forEach(item => {

    const row =
      document.createElement("tr");


    const placeCell =
      document.createElement("td");

    placeCell.textContent =
      item.place;


    const ownerCell =
      document.createElement("td");

    ownerCell.textContent =
      item.owner;


    const teamNameCell =
      document.createElement("td");

    teamNameCell.textContent =
      item.team_name;


    const recordCell =
      document.createElement("td");

    recordCell.textContent =
      item.record;


    const aggRecordCell =
      document.createElement("td");

    aggRecordCell.textContent =
      item.agg_record;


    const pointsCell =
      document.createElement("td");

    pointsCell.textContent =
      item.points;


    row.append(
      placeCell,
      ownerCell,
      teamNameCell,
      recordCell,
      aggRecordCell,
      pointsCell
    );


    tableBody.appendChild(row);

  });


  const noteRow =
    document.createElement("tr");


  const noteCell =
    document.createElement("td");


  noteCell.colSpan = 6;


  noteCell.textContent =
    "* Aggregate Record is a team's record if they played all other teams every week";


  noteCell.style.fontStyle =
    "italic";


  noteRow.appendChild(noteCell);

  tableBody.appendChild(noteRow);


  tableContainer.appendChild(table);

}



// ============================================================
// DRAFT BOARD
// ============================================================

async function createDraftBoard() {

  const draftOrderRes =
    await fetch(
      "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/current_draft_pick_order.json"
    );

  const draftOrderJson =
    await draftOrderRes.json();


  const ownerDraftPicksRes =
    await fetch(
      "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_draft_picks.json"
    );

  const ownerDraftPicksJson =
    await ownerDraftPicksRes.json();


  // ----------------------------------------------------------
  // Determine upcoming draft year
  // ----------------------------------------------------------

  const draftYear =
    Math.min(
      ...ownerDraftPicksJson.map(
        p => Number(p.year)
      )
    );


  // ----------------------------------------------------------
  // Get original owner from pick string
  // ----------------------------------------------------------

  const getOriginalOwnerFromPick =
    pickStr => {

      const match =
        pickStr.match(/\(([^)]+)\)/);

      return match
        ? match[1].trim()
        : null;

    };


  // ----------------------------------------------------------
  // Determine current owner of a pick
  // ----------------------------------------------------------

  const getCurrentPickOwner =
    (originalOwner, round) => {

      const picks =
        ownerDraftPicksJson.filter(
          p =>
            Number(p.year) === draftYear &&
            Number(p.round) === round
        );


      const tradedPick =
        picks.find(
          p =>
            getOriginalOwnerFromPick(
              p.pick
            ) === originalOwner
        );


      if (tradedPick) {
        return tradedPick.owner;
      }


      const originalPick =
        picks.find(
          p =>
            p.owner === originalOwner &&
            !getOriginalOwnerFromPick(
              p.pick
            )
        );


      if (originalPick) {
        return originalPick.owner;
      }


      return originalOwner;

    };


  // ----------------------------------------------------------
  // Find container
  // ----------------------------------------------------------

  const tableContainer =
    document.querySelector(
      ".wbdw-home-draft-order-grid"
    );


  if (!tableContainer) {

    console.error(
      "Draft board container not found."
    );

    return;

  }


  tableContainer.innerHTML = "";


  // ----------------------------------------------------------
  // Year label
  // ----------------------------------------------------------

  const yearLabel =
    document.createElement("div");

  yearLabel.className =
    "draft-board-year";

  yearLabel.textContent =
    `${draftYear} Draft`;


  tableContainer.appendChild(
    yearLabel
  );


  // ----------------------------------------------------------
  // Create table
  // ----------------------------------------------------------

  const table =
    document.createElement("table");

  table.classList.add(
    "table-wbdw-draft-board"
  );


  // Header
  const headerRow =
    document.createElement("tr");


  const blankHeader =
    document.createElement("th");

  blankHeader.textContent = "";

  headerRow.appendChild(
    blankHeader
  );


  draftOrderJson.forEach(item => {

    const th =
      document.createElement("th");

    th.textContent =
      `${item.pick} (${item.owner})`;

    headerRow.appendChild(th);

  });


  table.appendChild(
    headerRow
  );


  // ----------------------------------------------------------
  // Rounds 1–4
  // ----------------------------------------------------------

  for (
    let round = 1;
    round <= 4;
    round++
  ) {

    const row =
      document.createElement("tr");


    const roundCell =
      document.createElement("td");

    roundCell.textContent =
      `Round ${round}`;

    row.appendChild(
      roundCell
    );


    draftOrderJson.forEach(
      (projPick, colIndex) => {

        const originalOwner =
          projPick.owner;


        const currentOwner =
          getCurrentPickOwner(
            originalOwner,
            round
          );


        const cell =
          document.createElement("td");


        cell.textContent =
          `${round}.${String(
            colIndex + 1
          ).padStart(2, "0")} - ${currentOwner}`;


        row.appendChild(cell);

      }
    );


    table.appendChild(row);

  }


  // ----------------------------------------------------------
  // Scroll wrapper
  // ----------------------------------------------------------

  const scrollWrapper =
    document.createElement("div");

  scrollWrapper.className =
    "table-scroll-wrapper";

  scrollWrapper.appendChild(
    table
  );


  tableContainer.appendChild(
    scrollWrapper
  );

}



// ============================================================
// DYNASTY POWER RANKINGS
// ============================================================

async function createPowerRankingsDynasty() {

  const response =
    await fetch(
      "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json"
    );

  const json =
    await response.json();


  json.sort(
    (a, b) =>
      b["Overall Value"] -
      a["Overall Value"]
  );


  const owners =
    json.map(
      item => item.Owner
    );


  const draftCapitalValues =
    json.map(
      item => item["Draft Capital Value"]
    );


  const qbValues =
    json.map(
      item => item["QB Value"]
    );


  const rbValues =
    json.map(
      item => item["RB Value"]
    );


  const wrValues =
    json.map(
      item => item["WR Value"]
    );


  const teValues =
    json.map(
      item => item["TE Value"]
    );


  const canvas =
    document.getElementById(
      "canvas-wbdw-power-rankings-dynasty"
    );


  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  new Chart(ctx, {

    type: "bar",


    data: {

      labels: owners,


      datasets: [

        {
          label: "QB Value",
          data: qbValues,
          backgroundColor:
            "rgba(255, 99, 132, 0.2)",
          borderColor:
            "rgba(255, 99, 132, 1)",
          borderWidth: 1
        },


        {
          label: "RB Value",
          data: rbValues,
          backgroundColor:
            "rgba(255, 205, 86, 0.2)",
          borderColor:
            "rgba(255, 205, 86, 1)",
          borderWidth: 1
        },


        {
          label: "WR Value",
          data: wrValues,
          backgroundColor:
            "rgba(54, 162, 235, 0.2)",
          borderColor:
            "rgba(54, 162, 235, 1)",
          borderWidth: 1
        },


        {
          label: "TE Value",
          data: teValues,
          backgroundColor:
            "rgba(153, 102, 255, 0.2)",
          borderColor:
            "rgba(153, 102, 255, 1)",
          borderWidth: 1
        },


        {
          label: "Draft Capital Value",
          data: draftCapitalValues,
          backgroundColor:
            "rgba(75, 192, 192, 0.2)",
          borderColor:
            "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }

      ]

    },


    options: {

      responsive: true,

      maintainAspectRatio: false,


      plugins: {

        legend: {

          display: true,

          labels: {
            color: "white"
          }

        }

      },


      scales: {

        x: {

          stacked: true,

          ticks: {

            color: "white",

            autoSkip: false,

            maxRotation: 90

          }

        },


        y: {

          beginAtZero: true,

          stacked: true,

          ticks: {
            color: "white"
          }

        }

      }

    }

  });

}



// ============================================================
// CURRENT SEASON POWER RANKINGS
// ============================================================

async function createPowerRankingsSeason() {

  const response =
    await fetch(
      "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/power_rankings.json"
    );

  const json =
    await response.json();


  json.sort(
    (a, b) =>
      b.projected_points -
      a.projected_points
  );


  const owners =
    json.map(
      item => item.Owner
    );


  const qbValue =
    json.map(
      item => item.qb_proj
    );


  const rbValue =
    json.map(
      item => item.rb_proj
    );


  const wrValue =
    json.map(
      item => item.wr_proj
    );


  const teValue =
    json.map(
      item => item.te_proj
    );


  const flexValue =
    json.map(
      item => item.flex_proj
    );


  const canvas =
    document.getElementById(
      "canvas-wbdw-power-rankings-season"
    );


  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  new Chart(ctx, {

    type: "bar",


    data: {

      labels: owners,


      datasets: [

        {
          label: "QB Projection",
          data: qbValue,
          backgroundColor:
            "rgba(255, 99, 132, 0.2)",
          borderColor:
            "rgba(255, 99, 132, 1)",
          borderWidth: 1
        },


        {
          label: "RB Projection",
          data: rbValue,
          backgroundColor:
            "rgba(255, 205, 86, 0.2)",
          borderColor:
            "rgba(255, 205, 86, 1)",
          borderWidth: 1
        },


        {
          label: "WR Projection",
          data: wrValue,
          backgroundColor:
            "rgba(54, 162, 235, 0.2)",
          borderColor:
            "rgba(54, 162, 235, 1)",
          borderWidth: 1
        },


        {
          label: "TE Projection",
          data: teValue,
          backgroundColor:
            "rgba(153, 102, 255, 0.2)",
          borderColor:
            "rgba(153, 102, 255, 1)",
          borderWidth: 1
        },


        {
          label: "Flex Projection",
          data: flexValue,
          backgroundColor:
            "rgba(75, 192, 192, 0.2)",
          borderColor:
            "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }

      ]

    },


    options: {

      responsive: true,

      maintainAspectRatio: false,


      plugins: {

        legend: {

          display: true,

          labels: {
            color: "white"
          }

        }

      },


      scales: {

        x: {

          stacked: true,

          ticks: {

            color: "white",

            autoSkip: false,

            maxRotation: 90

          }

        },


        y: {

          beginAtZero: true,

          stacked: true,

          ticks: {
            color: "white"
          }

        }

      }

    }

  });

}



// ============================================================
// POWER RANKING TABS
// ============================================================

function setupPowerRankingTabs() {

  const buttons =
    document.querySelectorAll(
      ".wbdw-home-tab"
    );


  const dynastyChart =
    document.querySelector(
      '[data-ranking-chart="dynasty"]'
    );


  const seasonChart =
    document.querySelector(
      '[data-ranking-chart="season"]'
    );


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const ranking =
          button.dataset.ranking;


        buttons.forEach(
          otherButton => {

            otherButton.classList.toggle(
              "is-active",
              otherButton === button
            );

          }
        );


        if (ranking === "dynasty") {

          dynastyChart.style.display =
            "block";

          seasonChart.style.display =
            "none";

        }

        else {

          dynastyChart.style.display =
            "none";

          seasonChart.style.display =
            "block";

        }

      }
    );

  });

}



// ============================================================
// END HOMEPAGE FUNCTIONS
// ============================================================


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

  const weeklyAwardsRes = await fetch(
    "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/weekly_awards_history.json"
  );

  const json = await weeklyAwardsRes.json();

  // This is the element from our new HTML
  const awardsList = document.querySelector(
    "[data-weekly-awards]"
  );

  if (!awardsList) {
    console.error(
      "Weekly awards container not found: [data-weekly-awards]"
    );
    return;
  }

  // Clear existing rows
  awardsList.innerHTML = "";


  // --------------------------------------------------
  // Flatten nested JSON
  //
  // Year
  //   -> Week
  //       -> Award
  //           -> Owner / Value
  // --------------------------------------------------

  const awards = [];

  Object.entries(json).forEach(
    ([year, weeks]) => {

      Object.entries(weeks).forEach(
        ([week, weekAwards]) => {

          Object.entries(weekAwards).forEach(
            ([award, data]) => {

              awards.push({
                year: Number(year),
                week: Number(week),
                award: award,
                owner: data.owner,
                value: data.value
              });

            }
          );

        }
      );

    }
  );


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
  // Create rows
  // --------------------------------------------------

  awards.forEach(item => {

    const row = document.createElement("div");

    row.className = "wbdw-award-row";


    // Year + Week
    const week = document.createElement("div");

    week.className = "wbdw-award-week";

    week.textContent =
      `${item.year} • Week ${item.week}`;


    // Award
    const award = document.createElement("div");

    award.className = "wbdw-award-name";

    award.textContent =
      item.award;


    // Owner
    const owner = document.createElement("div");

    owner.className = "wbdw-award-owner";

    owner.textContent =
      item.owner ?? "—";


    // Value
    const value = document.createElement("div");

    value.className = "wbdw-award-value";


    if (item.award === "most efficient manager") {

      value.textContent =
        `${(Number(item.value) * 100).toFixed(1)}%`;

    } else {

      const numericValue =
        Number(item.value);

      value.textContent =
        Number.isFinite(numericValue)
          ? numericValue.toFixed(2)
          : "—";

    }


    row.append(
      week,
      award,
      owner,
      value
    );


    awardsList.appendChild(row);

  });

}

//calc and create weekly award records cards
async function createWeeklyAwardRecords() {

    const response = await fetch(
        "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/weekly_awards_history.json"
    );

    const data = await response.json();


    // ========================================================
    // Build award records
    // ========================================================

    const records = {
        allTime: {},
        byYear: {}
    };


    Object.entries(data).forEach(
        ([year, weeks]) => {

            if (!records.byYear[year]) {
                records.byYear[year] = {};
            }


            Object.values(weeks).forEach(
                awards => {

                    Object.values(awards).forEach(
                        award => {

                            const owner =
                                award.owner;

                            const amount =
                                Number(award.amount);


                            // ------------------------------
                            // All Time
                            // ------------------------------

                            if (!records.allTime[owner]) {

                                records.allTime[owner] = {
                                    awards: 0,
                                    money: 0
                                };

                            }


                            records.allTime[owner].awards += 1;

                            records.allTime[owner].money +=
                                amount;


                            // ------------------------------
                            // Current Year
                            // ------------------------------

                            if (!records.byYear[year][owner]) {

                                records.byYear[year][owner] = {
                                    awards: 0,
                                    money: 0
                                };

                            }


                            records.byYear[year][owner].awards += 1;

                            records.byYear[year][owner].money +=
                                amount;

                        }
                    );

                }
            );

        }
    );


    // ========================================================
    // Get HTML elements
    // ========================================================

    const yearSelect =
        document.getElementById(
            "wbdw-award-year-select"
        );

    const mostAwardsValue =
        document.getElementById(
            "wbdw-most-awards-value"
        );

    const mostAwardsOwner =
        document.getElementById(
            "wbdw-most-awards-owner"
        );

    const mostMoneyValue =
        document.getElementById(
            "wbdw-most-money-value"
        );

    const mostMoneyOwner =
        document.getElementById(
            "wbdw-most-money-owner"
        );


    if (
        !yearSelect ||
        !mostAwardsValue ||
        !mostAwardsOwner ||
        !mostMoneyValue ||
        !mostMoneyOwner
    ) {
        return;
    }


    // ========================================================
    // Populate year dropdown
    // ========================================================

    Object.keys(records.byYear)
        .sort(
            (a, b) =>
                Number(b) - Number(a)
        )
        .forEach(
            year => {

                const option =
                    document.createElement("option");

                option.value = year;

                option.textContent = year;

                yearSelect.appendChild(option);

            }
        );


    // ========================================================
    // Render selected period
    // ========================================================

    function renderRecords() {

        const selectedYear =
            yearSelect.value;


        const selectedRecords =
            selectedYear === "all-time"
                ? records.allTime
                : records.byYear[selectedYear];


        if (!selectedRecords) {
            return;
        }


        // ----------------------------------------------------
        // Most awards
        // ----------------------------------------------------

        const maxAwards =
            Math.max(
                ...Object.values(selectedRecords)
                    .map(
                        owner =>
                            owner.awards
                    )
            );


        const awardWinners =
            Object.entries(selectedRecords)
                .filter(
                    ([, owner]) =>
                        owner.awards === maxAwards
                )
                .map(
                    ([owner]) =>
                        owner
                );


        // ----------------------------------------------------
        // Most money
        // ----------------------------------------------------

        const maxMoney =
            Math.max(
                ...Object.values(selectedRecords)
                    .map(
                        owner =>
                            owner.money
                    )
            );


        const moneyWinners =
            Object.entries(selectedRecords)
                .filter(
                    ([, owner]) =>
                        owner.money === maxMoney
                )
                .map(
                    ([owner]) =>
                        owner
                );


        // ----------------------------------------------------
        // Update cards
        // ----------------------------------------------------

        mostAwardsValue.textContent =
            maxAwards;

        mostAwardsOwner.textContent =
            awardWinners.join(", ");


        mostMoneyValue.textContent =
            `$${maxMoney.toFixed(2)}`;

        mostMoneyOwner.textContent =
            moneyWinners.join(", ");

    }


    // ========================================================
    // Dropdown
    // ========================================================

    yearSelect.addEventListener(
        "change",
        renderRecords
    );


    // Initial display
    renderRecords();

}


// Creates trade count table
async function createTradeCountTable() {

  const tradeHistoryRes = await fetch(
    "https://raw.githubusercontent.com/nleffell/nickelfantasyleaguesjs/refs/heads/main/wbdw_jsons/website_jsons/trade_history.json"
  );

  const tradeHistory = await tradeHistoryRes.json();


  // --------------------------------------------------
  // Find our new HTML elements
  // --------------------------------------------------

  const totalElement = document.querySelector(
    "[data-trade-total]"
  );

  const tableBody = document.querySelector(
    "[data-trade-history]"
  );


  if (!totalElement || !tableBody) {

    console.error(
      "Trade history elements not found."
    );

    return;
  }


  // Clear existing rows
  tableBody.innerHTML = "";


  // --------------------------------------------------
  // Group entries by trade ID
  //
  // Each trade has two records:
  // Owner A
  // Owner B
  // --------------------------------------------------

  const tradesById = {};

  tradeHistory.forEach(entry => {

    const tradeId = entry.trade_id;

    if (!tradesById[tradeId]) {
      tradesById[tradeId] = [];
    }

    tradesById[tradeId].push(entry.owner);

  });


  // --------------------------------------------------
  // Build owner statistics
  // --------------------------------------------------

  const tradeStats = {};


  Object.values(tradesById).forEach(
    owners => {

      if (owners.length < 2) {
        return;
      }

      const ownerA = owners[0];
      const ownerB = owners[1];


      // Initialize owners
      if (!tradeStats[ownerA]) {

        tradeStats[ownerA] = {
          count: 0,
          partners: {}
        };

      }

      if (!tradeStats[ownerB]) {

        tradeStats[ownerB] = {
          count: 0,
          partners: {}
        };

      }


      // Increment trade counts
      tradeStats[ownerA].count++;
      tradeStats[ownerB].count++;


      // Track trading partners
      tradeStats[ownerA].partners[ownerB] =
        (tradeStats[ownerA].partners[ownerB] || 0) + 1;

      tradeStats[ownerB].partners[ownerA] =
        (tradeStats[ownerB].partners[ownerA] || 0) + 1;

    }
  );


  // --------------------------------------------------
  // Convert stats into sortable array
  // --------------------------------------------------

  const tradeArray = Object.entries(tradeStats)
    .map(([owner, data]) => {

      const partnerCounts =
        Object.entries(data.partners);


      const maxPartnerCount =
        Math.max(
          ...partnerCounts.map(
            ([_, count]) => count
          )
        );


      const mostPopularPartners =
        partnerCounts
          .filter(
            ([_, count]) =>
              count === maxPartnerCount
          )
          .map(
            ([partner]) => partner
          )
          .join(", ");


      return {
        owner,
        tradeCount: data.count,
        mostPopular: mostPopularPartners
      };

    });


  // --------------------------------------------------
  // Sort most trades → least trades
  // --------------------------------------------------

  tradeArray.sort(
    (a, b) =>
      b.tradeCount - a.tradeCount
  );


  // --------------------------------------------------
  // Total trades
  // --------------------------------------------------

  const tradeIds =
    Object.keys(tradesById)
      .map(Number)
      .filter(Number.isFinite);


  const totalTrades =
    tradeIds.length > 0
      ? Math.max(...tradeIds)
      : 0;


  totalElement.textContent =
    totalTrades;


  // --------------------------------------------------
  // Create table rows
  // --------------------------------------------------

  tradeArray.forEach(item => {

    const row = document.createElement("tr");


    // Owner
    const ownerCell =
      document.createElement("td");

    ownerCell.className =
      "wbdw-trade-owner";

    ownerCell.textContent =
      item.owner;


    // Trade count
    const countCell =
      document.createElement("td");

    countCell.className =
      "wbdw-trade-count";

    countCell.textContent =
      item.tradeCount;


    // Most frequent partner
    const partnerCell =
      document.createElement("td");

    partnerCell.className =
      "wbdw-trade-partner";

    partnerCell.textContent =
      item.mostPopular;


    row.append(
      ownerCell,
      countCell,
      partnerCell
    );


    tableBody.appendChild(row);

  });

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
const BET_TRACKER_JSON_URL =
  "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/bet_tracker.json";


// ------------------------------------------------------------
// Bet Tracker helpers
// ------------------------------------------------------------

function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `$${number.toFixed(2)}`;
}


function formatOdds(odds) {
  const number = Number(odds);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return number > 0
    ? `+${number}`
    : `${number}`;
}


// ------------------------------------------------------------
// Preseason Championship Odds
// ------------------------------------------------------------

async function createPreseasonChampionshipOdds() {

  const container =
    document.querySelector("[data-bet-odds]");

  if (!container) {
    return;
  }

  try {

    const response = await fetch(
      "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_odds.json"
    );

    const json = await response.json();


    // --------------------------------------------------------
    // Find latest year
    // --------------------------------------------------------

    const latestYear = Math.max(
      ...json.map(item => Number(item.year))
    );


    // --------------------------------------------------------
    // Filter championship preseason odds
    // --------------------------------------------------------

    const data = json.filter(item =>
      Number(item.year) === latestYear &&
      item.season === "preseason" &&
      item.type === "championship"
    );


    // --------------------------------------------------------
    // Calculate implied probability
    // --------------------------------------------------------

    const rows = data
      .map(item => {

        const odds = Number(item.championship_odds);

        let probability;

        if (odds > 0) {
          probability =
            100 / (odds + 100);
        }
        else {
          probability =
            (-odds) / ((-odds) + 100);
        }

        return {
          name: item.owner,
          odds,
          probability
        };

      })
      .filter(item =>
        Number.isFinite(item.probability)
      )
      .sort(
        (a, b) =>
          b.probability - a.probability
      );


    // --------------------------------------------------------
    // Create cards
    // --------------------------------------------------------

    container.innerHTML = "";


    rows.forEach(item => {

      const card =
        document.createElement("div");

      card.className =
        "wbdw-bet-odds-card";


      card.innerHTML = `

        <span class="wbdw-bet-odds-owner">
            ${item.name}
        </span>

        <span class="wbdw-bet-odds-value">
            ${formatOdds(item.odds)}
        </span>

        <span class="wbdw-bet-odds-label">
            Championship Odds
        </span>

        <span class="wbdw-bet-odds-stake">
            $10 BET WINS $${(10 * item.odds / 100).toFixed(2)}
        </span>

    `;

      container.appendChild(card);

    });

  }
  catch (error) {

    console.error(
      "Error loading preseason championship odds:",
      error
    );

  }

}


// ------------------------------------------------------------
// Bet Tracker
// ------------------------------------------------------------

async function createBetTracker() {

  const historyBody =
    document.querySelector("[data-bet-history]");

  const ownerSelect =
    document.querySelector("[data-bet-owner-filter]");

  const emptyState =
    document.querySelector("[data-bet-empty]");

  const statusButtons =
    document.querySelectorAll(
      "[data-bet-status]"
    );

  const recordsContainer =
    document.querySelector("[data-bet-records]");


  // ----------------------------------------------------------
  // Make sure we're actually on the Bet Tracker page
  // ----------------------------------------------------------

  if (
    !historyBody &&
    !recordsContainer
  ) {
    return;
  }


  try {

    // --------------------------------------------------------
    // Fetch betting data
    // --------------------------------------------------------

    const response =
      await fetch(BET_TRACKER_JSON_URL);

    if (!response.ok) {
      throw new Error(
        `Bet tracker request failed: ${response.status}`
      );
    }

    const bets =
      await response.json();


    // --------------------------------------------------------
    // Owner list
    // --------------------------------------------------------

    const owners = [
      ...new Set(
        bets.flatMap(bet => [
          bet.maker,
          bet.taker
        ])
      )
    ]
      .filter(Boolean)
      .sort();


    // --------------------------------------------------------
    // Populate owner dropdown
    // --------------------------------------------------------

    if (ownerSelect) {

      ownerSelect.innerHTML = `
        <option value="all">
          All Owners
        </option>
      `;

      owners.forEach(owner => {

        const option =
          document.createElement("option");

        option.value = owner;
        option.textContent = owner;

        ownerSelect.appendChild(option);

      });

    }


    // --------------------------------------------------------
    // Current filters
    // --------------------------------------------------------

    let selectedStatus = "all";
    let selectedOwner = "all";


    // --------------------------------------------------------
    // Filter bets
    // --------------------------------------------------------

    function getFilteredBets() {

      return bets.filter(bet => {

        // Status filter
        if (
          selectedStatus !== "all" &&
          bet.status.toLowerCase() !==
            selectedStatus
        ) {
          return false;
        }


        // Owner filter
        if (
          selectedOwner !== "all" &&
          bet.maker !== selectedOwner &&
          bet.taker !== selectedOwner
        ) {
          return false;
        }


        return true;

      });

    }


    // --------------------------------------------------------
    // Render betting history
    // --------------------------------------------------------

    function renderBetHistory() {

      if (!historyBody) {
        return;
      }

      const filteredBets =
        getFilteredBets();


      historyBody.innerHTML = "";


      if (emptyState) {
        emptyState.hidden =
          filteredBets.length !== 0;
      }


      filteredBets.forEach(bet => {

        const row = document.createElement("tr");


        // Date
        const dateCell = document.createElement("td");
        dateCell.textContent = bet.date;
        row.appendChild(dateCell);


        // Maker
        const makerCell = document.createElement("td");
        makerCell.textContent = bet.maker;
        row.appendChild(makerCell);


        // Maker Potential Payout
        const makerPayoutCell =
            document.createElement("td");

        makerPayoutCell.textContent =
            formatMoney(bet.stake);

        if (bet.status === "Settled") {

            if (bet.winner === bet.maker) {
                makerPayoutCell.classList.add(
                    "wbdw-bet-winning-payout"
                );
            } else {
                makerPayoutCell.classList.add(
                    "wbdw-bet-losing-payout"
                );
            }

        } else if (bet.status === "Void") {

            makerPayoutCell.classList.add(
                "wbdw-bet-losing-payout"
            );

        }

        row.appendChild(makerPayoutCell);


        // Bet
        const betCell = document.createElement("td");
        betCell.textContent = bet.bet;
        row.appendChild(betCell);


        // Taker
        const takerCell = document.createElement("td");
        takerCell.textContent = bet.taker;
        row.appendChild(takerCell);


        // Taker Potential Payout
        const takerPayoutCell =
            document.createElement("td");

        takerPayoutCell.textContent =
            formatMoney(bet.payout);

        if (bet.status === "Settled") {

            if (bet.winner === bet.taker) {
                takerPayoutCell.classList.add(
                    "wbdw-bet-winning-payout"
                );
            } else {
                takerPayoutCell.classList.add(
                    "wbdw-bet-losing-payout"
                );
            }

        } else if (bet.status === "Void") {

            takerPayoutCell.classList.add(
                "wbdw-bet-losing-payout"
            );

        }

        row.appendChild(takerPayoutCell);


        // Result
        const resultCell =
            document.createElement("td");

        const result =
            document.createElement("span");

        result.classList.add(
            "wbdw-bet-status"
        );


        if (bet.status === "Pending") {

            result.classList.add("pending");
            result.textContent = "Pending";

        }

        else if (bet.status === "Void") {

            result.classList.add("settled");
            result.textContent = "Void";

        }

        else {

            result.classList.add("settled");
            result.textContent = "Settled";

        }


        resultCell.appendChild(result);
        row.appendChild(resultCell);
        historyBody.appendChild(row);

      });

    }


    // --------------------------------------------------------
    // Calculate owner records
    // --------------------------------------------------------

    function calculateOwnerRecords() {

      const records = {};


      // ------------------------------------------------------
      // Only settled bets count
      // ------------------------------------------------------

      bets
        .filter(
          bet => bet.status === "Settled"
        )
        .forEach(bet => {

          const maker =
            bet.maker;

          const taker =
            bet.taker;

          const stake =
            Number(bet.stake);

          const payout =
            Number(bet.payout);


          if (!records[maker]) {

            records[maker] = {
              wins: 0,
              losses: 0,
              net: 0
            };

          }


          if (!records[taker]) {

            records[taker] = {
              wins: 0,
              losses: 0,
              net: 0
            };

          }


          // --------------------------------------------------
          // Maker wins
          //
          // Maker gets stake
          // Taker loses stake
          // --------------------------------------------------

          if (
            bet.winner === maker
          ) {

            records[maker].wins += 1;

            records[maker].net +=
              stake;

            records[taker].losses += 1;

            records[taker].net -=
              stake;

          }


          // --------------------------------------------------
          // Taker wins
          //
          // Taker gets payout
          // Maker loses payout
          // --------------------------------------------------

          else if (
            bet.winner === taker
          ) {

            records[taker].wins += 1;

            records[taker].net +=
              payout;

            records[maker].losses += 1;

            records[maker].net -=
              payout;

          }

        });


      return records;

    }


    // --------------------------------------------------------
    // Render owner record cards
    // --------------------------------------------------------

    function renderOwnerRecords() {

      if (!recordsContainer) {
        return;
      }


      const records =
        calculateOwnerRecords();


      const sorted =
        Object.entries(records)
          .sort(
            ([, a], [, b]) =>
              b.net - a.net
          );


      recordsContainer.innerHTML = "";


      sorted.forEach(
        ([owner, record]) => {

          const card =
            document.createElement("div");

          card.className =
            "wbdw-bet-record-card";


          const netClass =
            record.net < 0
              ? "negative"
              : "";


          card.innerHTML = `

            <div class="wbdw-bet-record-owner">
              ${owner}
            </div>

            <div class="wbdw-bet-record-net ${netClass}">
              ${record.net >= 0 ? "+" : ""}
              ${formatMoney(record.net)}
            </div>

            <span class="wbdw-bet-record-net-label">
              Net
            </span>

            <div class="wbdw-bet-record-stats">

              <div class="wbdw-bet-record-stat">

                <span class="wbdw-bet-record-stat-value">
                  ${record.wins}
                </span>

                <span class="wbdw-bet-record-stat-label">
                  Wins
                </span>

              </div>


              <div class="wbdw-bet-record-stat">

                <span class="wbdw-bet-record-stat-value">
                  ${record.losses}
                </span>

                <span class="wbdw-bet-record-stat-label">
                  Losses
                </span>

              </div>

            </div>

          `;


          recordsContainer.appendChild(card);

        }
      );

    }


    // --------------------------------------------------------
    // Status filter buttons
    // --------------------------------------------------------

    statusButtons.forEach(button => {

      button.addEventListener(
        "click",
        () => {

          selectedStatus =
            button.dataset.betStatus;


          statusButtons.forEach(
            otherButton => {

              otherButton.classList.toggle(
                "is-active",
                otherButton === button
              );

            }
          );


          renderBetHistory();

        }
      );

    });


    // --------------------------------------------------------
    // Owner filter
    // --------------------------------------------------------

    ownerSelect?.addEventListener(
      "change",
      () => {

        selectedOwner =
          ownerSelect.value;

        renderBetHistory();

      }
    );


    // --------------------------------------------------------
    // Initial render
    // --------------------------------------------------------

    renderBetHistory();

    renderOwnerRecords();

  }
  catch (error) {

    console.error(
      "Error loading Bet Tracker:",
      error
    );

  }

}

//#######End Bet Tracker Page Functions#######



//########Owner Page Functions#######
async function createOwnerStats() {

    const container =
        document.querySelector(".wbdw-owner-records-grid");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            "https://scripts.nickelfantasyleagues.com/wbdw_jsons/website_jsons/owner_aggregate_records.json"
        );

        const data = await response.json();


        // --------------------------------------------------------
        // Find owners tied for the highest value
        // --------------------------------------------------------

        function getLeaders(field) {

            const values =
                data.map(
                    owner => Number(owner[field]) || 0
                );

            const maxValue =
                Math.max(...values);

            const owners =
                data
                    .filter(
                        owner =>
                            Number(owner[field]) === maxValue
                    )
                    .map(
                        owner => owner.owner
                    );

            return {
                value: maxValue,
                owners: owners.join(", ")
            };

        }


        // --------------------------------------------------------
        // Build records
        // --------------------------------------------------------

        const records = [

            {
                label: "Most Championships",
                data: getLeaders("championships")
            },

            {
                label: "Most League Loser Finishes",
                data: getLeaders("league_loser_count")
            },

            {
                label: "Most Playoff Wins",
                data: getLeaders("playoff_wins")
            },

            {
                label: "Most Playoff Losses",
                data: getLeaders("playoff_losses")
            },

            {
                label: "Most Playoff Appearances",
                data: getLeaders("playoff_appearances")
            }

        ];


        // --------------------------------------------------------
        // Clear existing cards
        // --------------------------------------------------------

        container.innerHTML = "";


        // --------------------------------------------------------
        // Create cards
        // --------------------------------------------------------

        records.forEach(record => {

            const card =
                document.createElement("div");

            card.className =
                "wbdw-owner-record-card";


            card.innerHTML = `

                <div class="wbdw-owner-record-card-label">
                    ${record.label}
                </div>

                <div class="wbdw-owner-record-card-value">
                    ${record.data.value}
                </div>

                <div class="wbdw-owner-record-card-owner">
                    ${record.data.owners}
                </div>

            `;


            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Error loading owner stats:",
            error
        );

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

