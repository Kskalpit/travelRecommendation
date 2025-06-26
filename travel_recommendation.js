let allPlaces = [];
let countriesList = [];

document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("recommendationDropdown");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resetBtn = document.getElementById("resetBtn");

  fetch("travel_recommendation_api.json")
    .then(res => res.json())
    .then(data => {
      const countryCities = data.countries?.flatMap(c => {
        countriesList.push(c.name.toLowerCase());
        return c.cities.map(city => ({ ...city, category: c.name }));
      }) || [];

      const temples = data.temples.map(t => ({ ...t, category: "temple" }));
      const beaches = data.beaches.map(b => ({ ...b, category: "beach" }));

      allPlaces = [...countryCities, ...temples, ...beaches];
    })
    .catch(err => {
      dropdown.innerHTML = `<p class="text-red-600 p-2">Error: ${err.message}</p>`;
    });

  if (searchBtn && searchInput && resetBtn) {
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim().toLowerCase();
      let matched = [];

      // Category-based logic
      if (["beach", "beaches"].includes(query)) {
        matched = allPlaces.filter(p => p.category === "beach").slice(0, 2);
      } else if (["temple", "temples"].includes(query)) {
        matched = allPlaces.filter(p => p.category === "temple").slice(0, 2);
      } else if (["country", "countries"].includes(query)) {
        // Return any 2 places from known countries
        matched = allPlaces.filter(p => countriesList.includes(p.category.toLowerCase())).slice(0, 2);
      } else if (countriesList.includes(query)) {
        matched = allPlaces.filter(p => p.category.toLowerCase() === query).slice(0, 2);
      } else {
        // fallback to name matching
        matched = allPlaces.filter(p =>
          p.name.toLowerCase().includes(query)
        ).slice(0, 2);
      }
      

      renderDropdown(matched);
    });

    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
    });
  }

  function renderDropdown(places) {
    dropdown.innerHTML = "";

    if (places.length === 0) {
      dropdown.innerHTML = `<p class="p-4 text-red-600 text-sm">No places found.</p>`;
      dropdown.classList.remove("hidden");
      return;
    }

    places.forEach(place => {
      const card = document.createElement("div");
      card.className = "flex items-start p-3 border-b hover:bg-gray-50 cursor-pointer";
      card.innerHTML = `
        <img src="${place.imageUrl}" alt="${place.name}" class="w-16 h-16 object-cover rounded mr-3" />
        <div>
          <h4 class="text-sm font-bold text-gray-800">${place.name}</h4>
          <p class="text-xs text-gray-600">${place.description}</p>
        </div>
      `;
      dropdown.appendChild(card);
    });

    dropdown.classList.remove("hidden");
  }
});
