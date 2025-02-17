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

/*--------Byter bild----------*/
document.addEventListener("DOMContentLoaded", function () {
  const guestbookImg = document.querySelector(".guestbook-logo");

  guestbookImg.addEventListener("click", function (event) {
    event.preventDefault(); // Förhindrar att länken följer sin `href`
    this.src = "pics/guestbook2.png"; // Byter bildkälla
  });
});

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

      // Kör gästboken om referens.html laddas
      if (page === "referens.html") {
        setTimeout(initGuestbook, 100);
      }
    } catch (error) {
      content.innerHTML = "<p>Fel vid inläsning av sidan.</p>";
    }
  }

  document.querySelectorAll("a[data-page]").forEach((link) => {
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

    loadEntries(); // Ladda inlägg direkt vid sidladdning

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameInput.value.trim();
      let gender = genderInput.value;
      const age = ageInput.value;
      const message = messageInput.value.trim();
      const timestamp = new Date().toISOString();

      const genderSymbol = gender === "Man" ? "P" : "F";
      const profilePic = gender === "Man" ? "pics/him.png" : "pics/her.png";

      if (name && gender && age && message) {
        const listItem = document.createElement("li");
        listItem.classList.add("guestbook-entry");

        listItem.innerHTML = `
                  <img src="${profilePic}" alt="${genderSymbol}" class="profile-pic">
                  <div class="entry-content">
                      <p class="timestamp">${formatDate(timestamp)}</p>
                      <span class="alias">${name}</span><p class="inline-p"> ${genderSymbol}${age}</p>
                      <p class="message">${message}</p>
                  </div>
              `;

        saveEntry(name, genderSymbol, age, message, profilePic, timestamp);
        entriesList.appendChild(listItem);

        nameInput.value = "";
        genderInput.value = "Man";
        ageInput.value = "";
        messageInput.value = "";
      }
    });
  }

  function saveEntry(name, gender, age, message, profilePic, timestamp) {
    let entries = JSON.parse(localStorage.getItem("guestbook")) || [];
    entries.push({ name, gender, age, message, profilePic, timestamp });
    localStorage.setItem("guestbook", JSON.stringify(entries));
  }

  function loadEntries() {
    let entries = JSON.parse(localStorage.getItem("guestbook")) || [];
    const entriesList = document.getElementById("entries-list");

    // Lägg till sparade inlägg, men rensa INTE listan!
    entries.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.classList.add("guestbook-entry");

      listItem.innerHTML = `
            <img src="${entry.profilePic}" alt="${
        entry.gender
      }" class="profile-pic">
            <div class="entry-content">
                <p class="timestamp">${formatDate(entry.timestamp)}</p>
                <span class="alias">${entry.name}</span><p class="inline-p"> ${
        entry.gender
      }${entry.age}</p>
                <p class="message">${entry.message}</p>
            </div>
        `;

      entriesList.appendChild(listItem); // Lägg till efter de statiska inläggen
    });
  }

  function formatDate(date) {
    const entryDate = new Date(date);
    return (
      entryDate.toLocaleDateString("sv-SE", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      }) +
      ", kl " +
      entryDate.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  if (window.location.pathname.includes("referens.html")) {
    initGuestbook();
  }
});
