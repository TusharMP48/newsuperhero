/*
  Marvel API replaced — the old public/hash keys expired.
  Now using the free, keyless Superhero API:
  https://github.com/akabab/superhero-api
*/

const API_URL = "https://akabab.github.io/superhero-api/api/all.json";

let allHeroes = [];
let heroesLoaded = false;

async function loadAllHeroes() {
  if (heroesLoaded) return allHeroes;
  const res = await fetch(API_URL);
  allHeroes = await res.json();
  heroesLoaded = true;
  return allHeroes;
}

// ---------------------
// SHOW HEROES (Live Search) - called by input's onkeyup
// ---------------------
async function showCorrespondingHeros() {
  const name = document.getElementById("name").value.trim();
  const cardsGroup = document.getElementById("cards-group");

  if (!name) {
    cardsGroup.innerHTML = "";
    document.getElementById("characterSection").innerHTML = "";
    document.getElementById("comicSection").innerHTML = "";
    return;
  }

  cardsGroup.innerHTML = `<p style="color:white;">Loading...</p>`;

  try {
    await loadAllHeroes();

    const query = name.toLowerCase();
    const matches = allHeroes.filter((h) => h.name.toLowerCase().includes(query));

    if (matches.length === 0) {
      cardsGroup.innerHTML = `<p style="color: white;">No heroes found for "<strong>${name}</strong>".</p>`;
      return;
    }

    let html = "<div class='card-grid'>";
    matches.slice(0, 40).forEach((hero) => {
      const imgSrc =
        hero.images && hero.images.md
          ? hero.images.md
          : "https://via.placeholder.com/220x260?text=No+Image";

      html += `
        <div class="card">
          <img src="${imgSrc}" onclick="showDetails(${hero.id})" alt="${hero.name}" class="card-img">
          <div class="card-body">
            <h5 class="card-title">
              ${hero.name}
              <i id="fav-${hero.id}" class="fa-solid fa-plus icon" onclick="addFavourite(${hero.id})" title="Add to Favourites"></i>
            </h5>
          </div>
        </div>
      `;
    });
    html += "</div>";
    cardsGroup.innerHTML = html;
  } catch (err) {
    cardsGroup.innerHTML = `<h2 id="characterMainTitle">An error has occurred. Please check your connection.</h2>`;
  }
}

// ---------------------
// SHOW CHARACTER DETAILS (click on a card image)
// ---------------------
async function showDetails(id) {
  localStorage.setItem("id", id);

  document.getElementById("characterSpinnerSection").innerHTML = `
    <strong class="text-primary">Loading character...</strong>
    <div class="text-primary spinner-border ml-auto" role="status" aria-hidden="true"></div>
  `;

  try {
    await loadAllHeroes();
    const hero = allHeroes.find((h) => String(h.id) === String(id));

    if (!hero) {
      document.getElementById("characterSection").innerHTML =
        `<h2 id="characterMainTitle">Character not found.</h2>`;
      return;
    }

    renderCharacter(hero);
  } catch (err) {
    document.getElementById("characterSection").innerHTML =
      `<h2 id="characterMainTitle">An error has occurred, check connection.</h2>`;
  } finally {
    document.getElementById("characterSpinnerSection").innerHTML = "";
  }
}

function renderCharacter(hero) {
  const imageUrl =
    hero.images && hero.images.lg
      ? hero.images.lg
      : "https://via.placeholder.com/250x250?text=No+Image";

  const bio = hero.biography || {};
  const stats = hero.powerstats || {};
  const work = hero.work || {};
  const conn = hero.connections || {};

  const output = `
    <h2 id="characterMainTitle">Character</h2>
    <div class="character-card">
      <div class="character-img">
        <img src="${imageUrl}" alt="${hero.name}">
      </div>
      <div class="character-info">
        <h3>${hero.name}</h3>
        <p>${bio.fullName ? "Full Name: " + bio.fullName : "No description available."}</p>
        <p class="character-meta">
          Publisher: ${bio.publisher || "Unknown"} |
          Alignment: ${bio.alignment || "Unknown"} |
          Occupation: ${work.occupation || "Unknown"}
        </p>
        <p class="character-meta">
          INT: ${stats.intelligence ?? "-"} |
          STR: ${stats.strength ?? "-"} |
          SPD: ${stats.speed ?? "-"} |
          DUR: ${stats.durability ?? "-"} |
          POW: ${stats.power ?? "-"} |
          COM: ${stats.combat ?? "-"}
        </p>
        <p class="character-meta">Group affiliation: ${conn.groupAffiliation || "None listed"}</p>
      </div>
    </div>
  `;

  document.getElementById("characterSection").innerHTML = output;
  // The free API has no comics data, so this stays empty.
  document.getElementById("comicSection").innerHTML = "";
}

// ---------------------
// FAVOURITES
// ---------------------
function addFavourite(id) {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const hero = allHeroes.find((h) => String(h.id) === String(id));
  if (!hero) return;

  if (!favourites.some((f) => String(f.id) === String(id))) {
    favourites.push({
      id: hero.id,
      name: hero.name,
      img:
        hero.images && hero.images.md
          ? hero.images.md
          : "https://via.placeholder.com/220x260?text=No+Image",
    });
    localStorage.setItem("favourites", JSON.stringify(favourites));
    alert("Hero added to favourites!");
  } else {
    alert("Hero already in favourites.");
  }
}

// ---------------------
// PAGE INIT (index.html body onload="character()")
// ---------------------
function character() {
  document.getElementById("characterSection").innerHTML =
    '<h2 id="characterMainTitle">Type Name & press a key to get results....</h2>';
}