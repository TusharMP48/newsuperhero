// ---------------------
// FAVOURITES PAGE
// ---------------------

function loadFavourites() {
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const container = document.getElementById("cards-group"); // already has class="card-grid"

  if (favourites.length === 0) {
    container.innerHTML = `<p style="color:white;">No favourites added yet!</p>`;
    return;
  }

  let html = "";
  favourites.forEach((hero) => {
    html += `
      <div class="card">
        <img src="${hero.img}" alt="${hero.name}" class="card-img">
        <div class="card-body">
          <h5 class="card-title">
            ${hero.name}
            <i class="fa-solid fa-trash icon" onclick="removeFavourite(${hero.id})" title="Remove from Favourites"></i>
          </h5>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function removeFavourite(id) {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  favourites = favourites.filter((f) => String(f.id) !== String(id));
  localStorage.setItem("favourites", JSON.stringify(favourites));
  loadFavourites();
}