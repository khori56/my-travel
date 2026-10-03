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

const types = [
  "Flight",
  "Car Rental",
  "Hotel",
  "Sight",
  "Meal",
  "Transport",
  "Note"
];

const seed = {
  trips: [{
    id: "central-japan-2026",
    name: "Central Japan Road Trip",
    destination: "Nagoya • Gero • Takayama • Enakyo",
    start: "2026-10-19",
    end: "2026-10-23",

    items: [
      {
        id: "item-1",
        type: "Flight",
        title: "Arrive Chubu Centrair Airport",
        date: "2026-10-19",
        time: "10:15",
        location: "Chubu Centrair International Airport (NGO)",
        notes: "United UA137 from Guam",
        confirmation: ""
      },
      {
        id: "item-2",
        type: "Car Rental",
        title: "Pick up rental car",
        date: "2026-10-19",
        time: "11:15",
        location: "Chubu Centrair International Airport",
        notes: "",
        confirmation: ""
      },
      {
        id: "item-3",
        type: "Sight",
        title: "Inuyama Castle",
        date: "2026-10-19",
        time: "13:00",
        location: "Inuyama Castle",
        notes: "",
        confirmation: ""
      },
      {
        id: "item-4",
        type: "Hotel",
        title: "Gero Onsen",
        date: "2026-10-19",
        time: "16:30",
        location: "Gero, Gifu",
        notes: "2 nights",
        confirmation: ""
      },
      {
        id: "item-5",
        type: "Sight",
        title: "Takayama sightseeing",
        date: "2026-10-20",
        time: "09:00",
        location: "Takayama, Gifu",
        notes: "",
        confirmation: ""
      },
      {
        id: "item-6",
        type: "Hotel",
        title: "Enakyo Onsen",
        date: "2026-10-21",
        time: "15:30",
        location: "Ena, Gifu",
        notes: "",
        confirmation: ""
      },
      {
        id: "item-7",
        type: "Hotel",
        title: "Nagoya hotel",
        date: "2026-10-22",
        time: "16:00",
        location: "Nagoya",
        notes: "Return rental car",
        confirmation: ""
      },
      {
        id: "item-8",
        type: "Transport",
        title: "μ-SKY Express to NGO",
        date: "2026-10-23",
        time: "07:30",
        location: "Nagoya Station",
        notes: "",
        confirmation: ""
      },
      {
        id: "item-9",
        type: "Flight",
        title: "Flight from NGO",
        date: "2026-10-23",
        time: "11:00",
        location: "Chubu Centrair International Airport (NGO)",
        notes: "",
        confirmation: ""
      }
    ]
  }]
};

let data =
  JSON.parse(localStorage.getItem(storeKey) || "null") || seed;

let tab = "trips";
let currentTripIndex = null;

/* Upgrade old saved data without deleting it */

data.trips.forEach((trip, tripIndex) => {

  if (!trip.id) {
    trip.id = "trip-" + Date.now() + "-" + tripIndex;
  }

  if (!trip.items) {
    trip.items = [];
  }

  trip.items.forEach((item, itemIndex) => {

    if (!item.id) {
      item.id =
        "item-" +
        Date.now() +
        "-" +
        tripIndex +
        "-" +
        itemIndex;
    }

    if (item.confirmation === undefined) {
      item.confirmation = "";
    }
  });
});

save();

function save() {
  localStorage.setItem(storeKey, JSON.stringify(data));
}

function formatDate(date) {

  if (!date) return "";

  return new Date(date + "T12:00:00")
    .toLocaleDateString(
      undefined,
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    );
}

function escapeHTML(value = "") {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function itemRow(item, tripIndex) {

  const mapLink = item.location
    ? `
      <a
        href="https://maps.apple.com/?q=${
          encodeURIComponent(item.location)
        }"
      >
        Open in Apple Maps
      </a>
    `
    : "";

  return `
    <div class="row">

      <div class="icon">
        ${icons[item.type] || "•"}
      </div>

      <div class="grow">

        <div class="time">
          ${formatDate(item.date)}
          ${item.time ? " • " + escapeHTML(item.time) : ""}
        </div>

        <div class="title">
          ${escapeHTML(item.title)}
        </div>

        ${
          item.location
            ? `
              <div class="muted">
                ${escapeHTML(item.location)}
              </div>
            `
            : ""
        }

        ${
          item.confirmation
            ? `
              <div class="booking">
                Confirmation:
                ${escapeHTML(item.confirmation)}
              </div>
            `
            : ""
        }

        ${
          item.notes
            ? `
              <div class="item-notes">
                ${escapeHTML(item.notes)}
              </div>
            `
            : ""
        }

        <div class="item-actions">

          ${mapLink}

          <button
            class="text-button"
            onclick="
              editItem(
                ${tripIndex},
                '${item.id}'
              )
            "
          >
            Edit
          </button>

        </div>

      </div>
    </div>
  `;
}

function trips() {

  currentTripIndex = null;

  app.innerHTML = `

    <div class="toolbar">

      <div>
        <div class="section">
          My Trips
        </div>

        <div class="muted">
          Your offline travel organizer
        </div>
      </div>

      <button
        class="small-action"
        onclick="newTrip()"
      >
        + Trip
      </button>

    </div>

    ${
      data.trips.length

      ? data.trips.map((trip, index) => `

          <div
            class="hero"
            onclick="openTrip(${index})"
          >

            <small>
              ${
                index === 0
                  ? "NEXT ADVENTURE"
                  : "SAVED TRIP"
              }
            </small>

            <h2>
              ${escapeHTML(trip.name)}
            </h2>

            <div class="muted">
              ${escapeHTML(trip.destination)}
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

        `).join("")

      : `
        <div class="card">
          <b>No trips yet.</b>
          <p class="muted">
            Tap + Trip to create your first trip.
          </p>
        </div>
      `
    }
  `;
}

window.openTrip = function(index) {

  currentTripIndex = index;

  const trip = data.trips[index];

  const sortedItems =
    [...trip.items].sort(
      (a, b) =>
        ((a.date || "") + (a.time || ""))
          .localeCompare(
            (b.date || "") + (b.time || "")
          )
    );

  app.innerHTML = `

    <button
      class="action secondary"
      onclick="render()"
    >
      ‹ Back to Trips
    </button>

    <div class="trip-heading">

      <div>

        <div class="section">
          ${escapeHTML(trip.name)}
        </div>

        <div class="muted">
          ${escapeHTML(trip.destination)}
        </div>

        <div class="trip-dates">
          ${formatDate(trip.start)}
          —
          ${formatDate(trip.end)}
        </div>

      </div>

    </div>

    <div class="trip-controls">

      <button
        class="action secondary"
        onclick="editTrip(${index})"
      >
        ✏️ Edit Trip
      </button>

      <button
        class="action"
        onclick="newItem(${index})"
      >
        ＋ Add Itinerary Item
      </button>

    </div>

    <div class="card">

      ${
        sortedItems.length
          ? sortedItems
              .map(item => itemRow(item, index))
              .join("")
          : `
            <div class="empty-message">
              No itinerary items yet.
            </div>
          `
      }

    </div>
  `;
};

window.newTrip = function() {

  showTripEditor(null);
};

window.editTrip = function(index) {

  showTripEditor(index);
};

function showTripEditor(index) {

  const editing = index !== null;

  const trip = editing
    ? data.trips[index]
    : {
        name: "",
        destination: "",
        start: "",
        end: "",
        items: []
      };

  app.innerHTML = `

    <button
      class="action secondary"
      onclick="render()"
    >
      Cancel
    </button>

    <div class="section">
      ${editing ? "Edit Trip" : "New Trip"}
    </div>

    <div class="form-card">

      <label>Trip name</label>

      <input
        id="tripName"
        value="${escapeHTML(trip.name)}"
        placeholder="Japan Autumn Trip"
      >

      <label>Destination</label>

      <input
        id="tripDestination"
        value="${escapeHTML(trip.destination)}"
        placeholder="Nagoya • Takayama"
      >

      <label>Start date</label>

      <input
        id="tripStart"
        type="date"
        value="${trip.start || ""}"
      >

      <label>End date</label>

      <input
        id="tripEnd"
        type="date"
        value="${trip.end || ""}"
      >

      <button
        class="action"
        onclick="
          saveTripEditor(
            ${editing ? index : "null"}
          )
        "
      >
        Save Trip
      </button>

      ${
        editing
          ? `
            <button
              class="danger-button"
              onclick="deleteTrip(${index})"
            >
              Delete Trip
            </button>
          `
          : ""
      }

    </div>
  `;
}

window.saveTripEditor = function(index) {

  const name =
    document.querySelector("#tripName")
      .value.trim();

  const destination =
    document.querySelector("#tripDestination")
      .value.trim();

  const start =
    document.querySelector("#tripStart").value;

  const end =
    document.querySelector("#tripEnd").value;

  if (!name) {
    alert("Please enter a trip name.");
    return;
  }

  if (index === null) {

    data.trips.push({
      id: "trip-" + Date.now(),
      name,
      destination,
      start,
      end,
      items: []
    });

    currentTripIndex =
      data.trips.length - 1;

  } else {

    data.trips[index].name = name;
    data.trips[index].destination = destination;
    data.trips[index].start = start;
    data.trips[index].end = end;

    currentTripIndex = index;
  }

  save();

  openTrip(currentTripIndex);
};

window.deleteTrip = function(index) {

  const trip = data.trips[index];

  if (
    !confirm(
      `Delete "${trip.name}" and its itinerary?`
    )
  ) {
    return;
  }

  data.trips.splice(index, 1);

  save();

  currentTripIndex = null;

  render();
};

window.newItem = function(tripIndex) {

  showItemEditor(tripIndex, null);
};

window.editItem = function(tripIndex, itemID) {

  showItemEditor(tripIndex, itemID);
};

function showItemEditor(tripIndex, itemID) {

  const trip = data.trips[tripIndex];

  const editing = itemID !== null;

  const item = editing
    ? trip.items.find(x => x.id === itemID)
    : {
        type: "Sight",
        title: "",
        date: trip.start || "",
        time: "",
        location: "",
        notes: "",
        confirmation: ""
      };

  const typeOptions =
    types.map(type => `
      <option
        value="${type}"
        ${item.type === type ? "selected" : ""}
      >
        ${type}
      </option>
    `).join("");

  app.innerHTML = `

    <button
      class="action secondary"
      onclick="openTrip(${tripIndex})"
    >
      Cancel
    </button>

    <div class="section">
      ${
        editing
          ? "Edit Itinerary Item"
          : "Add Itinerary Item"
      }
    </div>

    <div class="form-card">

      <label>Type</label>

      <select id="itemType">
        ${typeOptions}
      </select>

      <label>Title</label>

      <input
        id="itemTitle"
        value="${escapeHTML(item.title)}"
        placeholder="Hotel, restaurant, attraction..."
      >

      <div class="two-column">

        <div>
          <label>Date</label>

          <input
            id="itemDate"
            type="date"
            value="${item.date || ""}"
          >
        </div>

        <div>
          <label>Time</label>

          <input
            id="itemTime"
            type="time"
            value="${item.time || ""}"
          >
        </div>

      </div>

      <label>Location</label>

      <input
        id="itemLocation"
        value="${escapeHTML(item.location)}"
        placeholder="Hotel or place name"
      >

      <label>Confirmation / booking number</label>

      <input
        id="itemConfirmation"
        value="${escapeHTML(item.confirmation || "")}"
        placeholder="Optional"
      >

      <label>Notes</label>

      <textarea
        id="itemNotes"
        rows="5"
        placeholder="Reservation details, directions, reminders..."
      >${escapeHTML(item.notes)}</textarea>

      <button
        class="action"
        onclick="
          saveItemEditor(
            ${tripIndex},
            ${editing ? `'${itemID}'` : "null"}
          )
        "
      >
        Save Itinerary Item
      </button>

      ${
        editing
          ? `
            <button
              class="danger-button"
              onclick="
                deleteItem(
                  ${tripIndex},
                  '${itemID}'
                )
              "
            >
              Delete Itinerary Item
            </button>
          `
          : ""
      }

    </div>
  `;
}

window.saveItemEditor =
function(tripIndex, itemID) {

  const title =
    document.querySelector("#itemTitle")
      .value.trim();

  if (!title) {

    alert(
      "Please enter a title for this itinerary item."
    );

    return;
  }

  const newItem = {
    id: itemID || "item-" + Date.now(),

    type:
      document.querySelector("#itemType").value,

    title,

    date:
      document.querySelector("#itemDate").value,

    time:
      document.querySelector("#itemTime").value,

    location:
      document.querySelector("#itemLocation")
        .value.trim(),

    confirmation:
      document.querySelector("#itemConfirmation")
        .value.trim(),

    notes:
      document.querySelector("#itemNotes")
        .value.trim()
  };

  const trip = data.trips[tripIndex];

  if (itemID) {

    const index =
      trip.items.findIndex(
        item => item.id === itemID
      );

    trip.items[index] = newItem;

  } else {

    trip.items.push(newItem);
  }

  save();

  openTrip(tripIndex);
};

window.deleteItem =
function(tripIndex, itemID) {

  const trip = data.trips[tripIndex];

  const item =
    trip.items.find(
      x => x.id === itemID
    );

  if (
    !confirm(
      `Delete "${item.title}"?`
    )
  ) {
    return;
  }

  trip.items =
    trip.items.filter(
      x => x.id !== itemID
    );

  save();

  openTrip(tripIndex);
};

function today() {

  currentTripIndex = null;

  const date =
    new Date().toISOString().slice(0, 10);

  const matches = [];

  data.trips.forEach(
    (trip, tripIndex) => {

      trip.items.forEach(item => {

        if (item.date === date) {

          matches.push({
            item,
            tripIndex,
            tripName: trip.name
          });
        }
      });
    }
  );

  matches.sort(
    (a, b) =>
      (a.item.time || "")
        .localeCompare(b.item.time || "")
  );

  app.innerHTML = `

    <div class="section">
      Today
    </div>

    <div class="muted today-date">
      ${formatDate(date)}
    </div>

    ${
      matches.length

      ? `
        <div class="card">

          ${
            matches
              .map(match =>
                itemRow(
                  match.item,
                  match.tripIndex
                )
              )
              .join("")
          }

        </div>
      `

      : `
        <div class="card">

          <b>Nothing scheduled today</b>

          <p class="muted">
            Your itinerary will appear here
            automatically during your trip.
          </p>

        </div>
      `
    }
  `;
}

function days() {

  currentTripIndex = null;

  if (!data.trips.length) {

    app.innerHTML = `
      <div class="section">
        Trip Days
      </div>

      <div class="card">
        No trips yet.
      </div>
    `;

    return;
  }

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

    <div class="muted days-trip-name">
      ${escapeHTML(trip.name)}
    </div>

    ${
      Object.keys(groups)
        .sort()
        .map(date => `

          <div class="card">

            <div class="day-heading">
              ${formatDate(date)}
            </div>

            ${
              groups[date]
                .sort(
                  (a,b) =>
                    (a.time || "")
                      .localeCompare(b.time || "")
                )
                .map(item =>
                  itemRow(item, 0)
                )
                .join("")
            }

          </div>

        `)
        .join("")
    }
  `;
}

function backup() {

  currentTripIndex = null;

  app.innerHTML = `

    <div class="section">
      Backup & Restore
    </div>

    <div class="card">

      <b>Protect your travel information</b>

      <p class="muted">
        Export a backup before your trip.
        Save it in Files or iCloud Drive.
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
          document
            .querySelector('#restore')
            .click()
        "
      >
        Restore Backup
      </button>

    </div>

    <div class="card">

      <b>Offline Ready</b>

      <p class="muted">
        My Travel stores your itinerary
        on this device and can operate
        without an internet connection.
      </p>

      <p class="muted">
        Apple Maps links require map data
        to be available separately.
      </p>

    </div>
  `;
}

window.exportData = function() {

  const blob =
    new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
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

document
  .querySelector("#restore")
  .addEventListener(
    "change",
    async event => {

      try {

        const file =
          event.target.files[0];

        if (!file) return;

        const restored =
          JSON.parse(
            await file.text()
          );

        if (!restored.trips) {
          throw new Error();
        }

        data = restored;

        save();

        alert(
          "My Travel backup restored."
        );

        tab = "trips";

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
    .register("sw.js")
    .catch(error => {
      console.log(
        "Service worker:",
        error
      );
    });
}

save();
render();
/* =========================================================
   MY TRAVEL v3 — OFFLINE DOCUMENTS & PHOTOS WALLET
   Files are stored locally on this device using IndexedDB.
   ========================================================= */

const WALLET_DB = "mytravel-wallet";
const WALLET_VERSION = 1;
const WALLET_STORE = "files";

function openWalletDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(WALLET_DB, WALLET_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(WALLET_STORE)) {
        const store = db.createObjectStore(WALLET_STORE, {
          keyPath: "id"
        });

        store.createIndex("tripId", "tripId", { unique: false });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("created", "created", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveWalletFile(record) {
  const db = await openWalletDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(WALLET_STORE, "readwrite");
    const store = tx.objectStore(WALLET_STORE);

    store.put(record);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function getWalletFiles(tripId = null) {
  const db = await openWalletDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(WALLET_STORE, "readonly");
    const store = tx.objectStore(WALLET_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      let records = request.result || [];

      if (tripId) {
        records = records.filter(record => record.tripId === tripId);
      }

      records.sort((a, b) =>
        new Date(b.created) - new Date(a.created)
      );

      db.close();
      resolve(records);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function getWalletFile(id) {
  const db = await openWalletDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(WALLET_STORE, "readonly");
    const request = tx.objectStore(WALLET_STORE).get(id);

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function deleteWalletFile(id) {
  const db = await openWalletDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(WALLET_STORE, "readwrite");
    tx.objectStore(WALLET_STORE).delete(id);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

function walletFileId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "wallet-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2);
}
