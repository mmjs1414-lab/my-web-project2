async function getData() {
  const url = "https://api.collection.nfsa.gov.au/search?query=lobby%20card&hasMedia=yes&forms=Lobby%20card";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    const hero = document.querySelector("#hero");
    let film = data.results[0]
    

    hero.innerHTML = `
    <div class="text-center py-12">
    <p class="text-base font-sans mb-8 font-normal">
      Browse 833 Lobby Cards from the NFSA Collection
    </p>

    
<h1 class="text-4xl font-serif text-red-900 mb-4">${film.title}</h1>
  <p class="text-2xl font-sans font-medium">${film.productionDates[0].fromYear} · ${film.parentTitle.genres}</p>
    </div>
`

  } catch (error) {
    console.error(error.message);
  }
}
getData();
