document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");

  //------------------Byt bild-------------------
  const guestbookImg = document.querySelector(".guestbook-logo");

  guestbookImg.addEventListener("click", function (event) {
    event.preventDefault(); // Förhindrar att länken följer sin `href`
    this.src = "pics/guestbook2.png"; // Byter bildkälla
  });
  //--------------------------------------------------
  async function loadPage(page, addToHistory = true) {
    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error("Sidan kunde inte laddas");
      const html = await response.text();
      content.innerHTML = html;

      if (addToHistory) {
        history.replaceState(null, null, "/"); // Tar bort sub-URL från adressfältet
      }

      // Initiera funktioner för specifika sidor
      if (page === "kontakt.html") {
        setTimeout(initContactForm, 100);
      }
      if (page === "referens.html") {
        setTimeout(initGuestbook, 100);
      }
    } catch (error) {
      content.innerHTML = "<p>Fel vid inläsning av sidan.</p>";
    }
  }

  // 🚀 Om sidan laddas direkt på en undersida (ex. kontakt.html), ladda rätt innehåll
  const currentPath = window.location.pathname.substring(1); // Ta bort "/"
  if (
    [
      "kontakt.html",
      "kunskap.html",
      "om-mig.html",
      "referens.html",
      "portfolj.html",
    ].includes(currentPath)
  ) {
    loadPage(currentPath, false);
  } else {
    loadPage("om-mig.html", false); // Standardvy om ingen undersida anges
  }

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

  console.log("✅ `DOMContentLoaded` kördes en gång, inga dubbletter.");
});

/*--------- GÄSTBOK -------------*/
function initGuestbook() {
  const form = document.getElementById("guestbook-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const genderInput = document.getElementById("gender");
  const ageInput = document.getElementById("age");
  const messageInput = document.getElementById("reference-message-input");
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
                    <p class="p-blue">${name}</p><p class="inline-p"> ${genderSymbol}${age}</p>
                    <p class="entry-message">${message}</p>
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

  entries.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.classList.add("guestbook-entry");

    listItem.innerHTML = `
          <img src="${entry.profilePic}" alt="${
      entry.gender
    }" class="profile-pic">
          <div class="entry-content">
              <p class="timestamp">${formatDate(entry.timestamp)}</p>
              <p class="p-blue">${entry.name}</p><p class="inline-p"> ${
      entry.gender
    }${entry.age}</p>
              <p class="message">${entry.message}</p>
          </div>
      `;

    entriesList.appendChild(listItem);
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

/*---------- Kontaktformulär -------------*/
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  console.log("✅ Kontaktformuläret hittades och initieras!");

  const popup = document.getElementById("confirmation-popup");
  const closeButton = document.getElementById("close-popup");

  popup.classList.add("hidden");

  if (closeButton) {
    closeButton.removeEventListener("click", closePopup);
    closeButton.addEventListener("click", closePopup);
  } else {
    console.error("❌ Stäng-knappen för popupen hittades inte!");
  }

  function closePopup() {
    console.log("🔴 Popup stängs!");
    popup.classList.add("hidden");
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        console.log("✅ Formulär skickat, visar popup!");
        popup.classList.remove("hidden");
        form.reset();
      } else {
        throw new Error("Fel vid skickandet.");
      }
    } catch (error) {
      alert("Ett fel uppstod: " + error.message);
    }
  });
}
