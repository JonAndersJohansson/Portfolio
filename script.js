document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");

  async function loadPage(page, addToHistory = true) {
    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error("Sidan kunde inte laddas");
      const html = await response.text();
      content.innerHTML = html;
      if (addToHistory) {
        history.pushState({ page }, "", page);
      }
    } catch (error) {
      content.innerHTML = "<p>Fel vid inläsning av sidan.</p>";
    }
  }

  // Ladda "Om mig" vid första besöket
  loadPage("om-mig.html", false);

  // Lägg till klickhändelser för navigationslänkar
  document.querySelectorAll("a[data-page]").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const page = this.getAttribute("data-page");
      if (page) {
        loadPage(page);
      }
    });
  });

  // Hantera bakåt/framåt-knappar
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
      loadPage(event.state.page, false);
    }
  });
});

/*---------GÄSTBOK-------------*/
document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");

  async function loadPage(page, addToHistory = true) {
    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error("Sidan kunde inte laddas");
      const html = await response.text();
      content.innerHTML = html;
      if (addToHistory) {
        history.pushState({ page }, "", page);
      }

      // Kör gästbokens funktioner om gästboken laddas
      if (page === "referens.html") {
        initGuestbook();
      }
    } catch (error) {
      content.innerHTML = "<p>Fel vid inläsning av sidan.</p>";
    }
  }

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const page = this.getAttribute("data-page");
      if (page) {
        loadPage(page);
      }
    });
  });

  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
      loadPage(event.state.page, false);
    }
  });

  function initGuestbook() {
    const form = document.getElementById("guestbook-form");
    if (!form) return;

    const nameInput = document.getElementById("name");
    const genderInput = document.getElementById("gender");
    const ageInput = document.getElementById("age");
    const messageInput = document.getElementById("message");
    const entriesList = document.getElementById("entries-list");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameInput.value.trim();
      let gender = genderInput.value;
      const age = ageInput.value;
      const message = messageInput.value.trim();
      const timestamp = new Date().toISOString(); // Spara tid i ISO-format

      const genderSymbol = gender === "Man" ? "P" : "F";
      const profilePic = gender === "Man" ? "pics/him.png" : "pics/her.png";

      if (name && gender && age && message) {
        const listItem = document.createElement("li");
        listItem.classList.add("guestbook-entry");

        listItem.innerHTML = `
                <img src="${profilePic}" alt="${genderSymbol}" class="profile-pic">
                <div><p class="timestamp">${formatDate(timestamp)}</p></div>
                <div class="entry-content">
                    <span class="alias">${name}</span> ${genderSymbol}${age}
                    <p class="message">${message}</p>
                </div>
            `;

        entriesList.appendChild(listItem);
        saveEntry(name, genderSymbol, age, message, profilePic, timestamp);

        // Rensa fält
        nameInput.value = "";
        genderInput.value = "Man";
        ageInput.value = "";
        messageInput.value = "";
      }
    });

    function saveEntry(name, gender, age, message, profilePic, timestamp) {
      let entries = JSON.parse(localStorage.getItem("guestbook")) || [];
      entries.push({ name, gender, age, message, profilePic, timestamp });
      localStorage.setItem("guestbook", JSON.stringify(entries));
    }

    function loadEntries() {
      let entries = JSON.parse(localStorage.getItem("guestbook")) || [];
      entriesList.innerHTML = "";
      entries.forEach((entry) => {
        const listItem = document.createElement("li");
        listItem.classList.add("guestbook-entry");

        listItem.innerHTML = `
                <img src="${entry.profilePic}" alt="${
          entry.gender
        }" class="profile-pic">
                <div class="entry-content">
                    <p class="timestamp">${formatDate(entry.timestamp)}</p>
                    <span class="alias">${entry.name}</span> ${entry.gender}${
          entry.age
        }
                    <p class="message">${entry.message}</p>
                </div>
            `;

        entriesList.appendChild(listItem);
      });
    }

    loadEntries();
  }

  // Funktion för att formatera datum
  function formatDate(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const entryDate = new Date(date);
    const entryDay = new Date(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate()
    );

    let formattedDate;
    if (entryDay.getTime() === today.getTime()) {
      formattedDate = "Idag";
    } else if (entryDay.getTime() === yesterday.getTime()) {
      formattedDate = "Igår";
    } else if (entryDay.getTime() === twoDaysAgo.getTime()) {
      formattedDate = "I förrgår";
    } else {
      formattedDate = entryDate.toLocaleDateString("sv-SE", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
    }

    const formattedTime = entryDate.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate}, kl ${formattedTime}`;
  }

  document.addEventListener("DOMContentLoaded", function () {
    initGuestbook();
  });
});
