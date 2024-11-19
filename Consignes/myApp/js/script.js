document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");
  const loader = document.getElementById("loader");

  // Fonction pour afficher les résultats
  const displayResults = (results) => {
    resultsContainer.innerHTML = ""; // Effacer les anciens résultats
    results.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `
          <h3><a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank">${result.title}</a></h3>
          <p>${result.snippet}</p>
        `;
      resultsContainer.appendChild(resultItem);
    });
  };

  // Fonction pour gérer les erreurs
  const displayError = (message) => {
    resultsContainer.innerHTML = `<p style="color: red;">${message}</p>`;
  };

  // Écouter l'événement submit du formulaire
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) return; // Ne rien faire si l'entrée est vide

    // Afficher le loader
    loader.style.display = "block";
    resultsContainer.innerHTML = "";

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }

      const data = await response.json();
      if (data.query && data.query.search.length > 0) {
        displayResults(data.query.search);
      } else {
        displayError("Aucun résultat trouvé.");
      }
    } catch (error) {
      displayError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      // Masquer le loader
      loader.style.display = "none";
    }
  });
});
