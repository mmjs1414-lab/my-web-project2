const hero = document.querySelector("#hero");

const film = {
    title: "PICNIC AT HANGING ROCK",
    year: "1975",
    genre: "Drama"
};

hero.innerHTML = `
    <div class="text-center py-12">
    <p class="text-base font-sans mb-8 font-normal">
      Browse 833 Lobby Cards from the NFSA Collection
    </p>

<h1 class="text-4xl font-serif text-red-900 mb-4">${film.title}</h1>
  <p class="text-2xl font-sans font-medium">${film.year} · ${film.genre}</p>
    </div>
`;

