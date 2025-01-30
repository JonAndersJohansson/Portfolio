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
