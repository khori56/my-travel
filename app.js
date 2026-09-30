const app = document.querySelector("#app");
const storeKey = "mytravel-pwa";

const icons = {
  "Flight": "✈️",
  "Car Rental": "🚙",
  "Hotel": "🏨",
  "Sight": "📍",
  "Meal": "🍽️",
  "Transport": "🚆",
  "Note": "📝"
};

const seed = {
  trips: [{
    name: "Central Japan Road Trip",
    destination: "Nagoya • Gero • Takayama • Enakyo",
    start: "2026-10-19",
    end: "2026-10-23",

    items: [
      {
        type: "Flight",
        title: "Arrive Chubu Centrair Airport",
        date: "2026-10-19",
        time: "10:15",
        location: "Chubu Centrair International Airport (NGO)",
        notes: "United UA137 from Guam"
      },
      {
        type: "Car Rental",
        title: "Pick up rental car",
        date: "2026-10-19",
        time: "11:15",
        location: "Chubu Centrair International Airport",
        notes: ""
      },
      {
        type: "Sight",
        title: "Inuyama Castle",
        date: "2026-10-19",
        time: "13:00",
        location: "Inuyama Castle",
        notes: ""
      },
      {
        type: "Hotel",
        title: "Gero Onsen",
        date: "2026-10-19",
        time: "16:30",
        location: "Gero, Gifu",
        notes: "2 nights"
      },
      {
        type: "Sight",
        title: "Takayama sightseeing",
        date: "2026-10-20",
        time: "09:00",
        location: "Takayama, Gifu",
        notes: ""
      },
      {
        type: "Hotel",
        title: "Enakyo Onsen",
        date: "2026-10-21",
        time: "15:30",
        location: "Ena, Gifu",
        notes: ""
      },
      {
        type: "Hotel",
        title: "Nagoya hotel",
        date: "2026-10-22",
        time: "16:00",
        location: "Nagoya",
        notes: "Return rental car"
      },
      {
        type: "Transport",
        title: "μ-SKY Express to NGO",
        date: "2026-10-23",
        time: "07:30",
        location: "Nagoya Station",
        notes: ""
      },
      {
        type: "Flight",
        title: "Flight from NGO",
        date: "2026-10-23",
        time: "11:00",
        location: "Chubu Centrair International Airport (NGO)",
        notes: ""
      }
    ]
  }]
};

let data =
  JSON.parse(localStorage.getItem(storeKey) || "null") || seed;

let tab = "trips";

function save() {
  localStorage.setItem(storeKey, JSON.stringify(data));
}

function formatDate(date) {
  return new Date(date + "T12:00:00").toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}

function itemRow(item) {

  let mapLink = "";

  if (item.location) {
    mapLink =
      `<a href="https://maps.apple.com/?q=${
        encodeURIComponent(item.location)
      }">Open in Apple Maps</a>`;
  }

  return `
    <div class="row">

      <div class="icon">
        ${icons[item.type] || "•"}
      </div>

      <div class="grow">

        <div class="time">
          ${formatDate(item.date)} • ${item.time}
        </div>

        <div class="title">
          ${item.title}
        </div>

        <div class="muted">
          ${item.location || ""}
        </div>

        ${
          item.notes
            ? `<div>${item.notes}</div>`
            : ""
        }

        ${
          mapLink
            ? `<div>${mapLink}</div>`
            : ""
        }

      </div>
    </div>
  `;
}

function trips() {

  app.innerHTML = data.trips.map((trip, index) => `

    <div
      class="hero"
      onclick="openTrip(${index})"
    >

      <small>NEXT ADVENTURE</small>

      <h2>${trip.name}</h2>

      <div class="muted">
        ${trip.destination}
      </div>

      <div>
        <span class="pill">
          📅 ${formatDate(trip.start)}
        </span>

        <span class="pill">
          🏁 ${formatDate(trip.end)}
        </span>
      </div>

    </div>

  `).join("");
}

window.openTrip = function(index) {

  const trip = data.trips[index];

  app.innerHTML = `

    <button
      class="action secondary"
      onclick="render()"
    >
      ‹ Back to Trips
    </button>

    <div class="section">
      ${trip.name}
    </div>

    <div class="muted">
      ${trip.destination}
    </div>

    ${
      trip.items
        .sort((a,b) =>
          (a.date+a.time).localeCompare(b.date+b.time)
        )
        .map(itemRow)
        .join("")
    }
  `;
};

function today() {

  const date =
    new Date().toISOString().slice(0,10);

  const items =
    data.trips
      .flatMap(trip => trip.items)
      .filter(item => item.date === date);

  app.innerHTML = `

    <div class="section">
      Today
    </div>

    ${
      items.length
      ? items.map(itemRow).join("")
      : `
        <div class="card">

          <b>Nothing scheduled today</b>

          <p class="muted">
            Your itinerary will automatically
            appear here during your trip.
          </p>

        </div>
      `
    }
  `;
}

function days() {

  const trip = data.trips[0];

  const groups = {};

  trip.items.forEach(item => {

    if (!groups[item.date]) {
      groups[item.date] = [];
    }

    groups[item.date].push(item);
  });

  app.innerHTML = `

    <div class="section">
      Trip Days
    </div>

    ${
      Object.keys(groups)
        .sort()
        .map(date => `

          <div class="card">

            <b>
              ${formatDate(date)}
            </b>

            ${
              groups[date]
                .map(itemRow)
                .join("")
            }

          </div>

        `)
        .join("")
    }
  `;
}

function backup() {

  app.innerHTML = `

    <div class="section">
      Backup & Restore
    </div>

    <div class="card">

      <b>Protect your travel information</b>

      <p class="muted">
        Export a backup before your trip
        and save it in your iPhone Files
        or iCloud Drive.
      </p>

      <button
        class="action"
        onclick="exportData()"
      >
        Export My Travel Backup
      </button>

      <button
        class="action secondary"
        onclick="
          document.querySelector('#restore').click()
        "
      >
        Restore Backup
      </button>

    </div>

    <div class="card">

      <b>Offline Travel Test</b>

      <p class="muted">
        After My Travel is installed on
        your iPhone, open it once while
        connected to the internet.
      </p>

      <p class="muted">
        Then turn on Airplane Mode and
        confirm Trips, Today and Days
        still work.
      </p>

    </div>
  `;
}

window.exportData = function() {

  const blob =
    new Blob(
      [JSON.stringify(data, null, 2)],
      {type: "application/json"}
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "MyTravel-backup.json";

  link.click();

  URL.revokeObjectURL(url);
};

document.querySelector("#restore")
  .addEventListener(
    "change",
    async event => {

      try {

        const file =
          event.target.files[0];

        data =
          JSON.parse(
            await file.text()
          );

        save();

        alert(
          "My Travel backup restored."
        );

        render();

      } catch {

        alert(
          "This backup could not be restored."
        );
      }
    }
  );

function render() {

  document
    .querySelectorAll("nav button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.tab === tab
      );

    });

  if (tab === "trips") trips();
  if (tab === "today") today();
  if (tab === "days") days();
  if (tab === "backup") backup();
}

document
  .querySelectorAll("nav button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        tab = button.dataset.tab;

        render();
      }
    );

  });

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("sw.js");

}

save();
render();
