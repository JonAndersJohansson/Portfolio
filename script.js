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
  document.querySelectorAll(".nav a").forEach((link) => {
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
      if (page === "gastbok.html") {
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
    if (!form) return; // Avsluta om gästbok inte finns

    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const entriesList = document.getElementById("entries-list");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameInput.value.trim();
      const message = messageInput.value.trim();

      if (name && message) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${name}:</strong> ${message}`;
        entriesList.appendChild(listItem);

        saveEntry(name, message);

        nameInput.value = "";
        messageInput.value = "";
      }
    });

    function saveEntry(name, message) {
      let entries = JSON.parse(localStorage.getItem("guestbook")) || [];
      entries.push({ name, message });
      localStorage.setItem("guestbook", JSON.stringify(entries));
    }

    function loadEntries() {
      let entries = JSON.parse(localStorage.getItem("guestbook")) || [];
      entries.forEach((entry) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${entry.name}:</strong> ${entry.message}`;
        entriesList.appendChild(listItem);
      });
    }

    loadEntries();
  }
});
