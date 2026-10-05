//Globals
let middleImage = 0; // Display result from the first array
let yearImage = 0;   // Display same year from the first array
let genreImage = 0;  // Display same genre from the first array
let carouselResults = [];

async function getData(url) {
  try {
    // Fetch data from NFSA API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    // Convert response to JSON, log data to inspect
    const data = await response.json();
    console.log(data);

    // Call function to display results
    displayResults(data.results, "hero");
  } catch (error) {
    console.error(error.message);
    document.getElementById("hero").innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }
}

// Call getData with NFSA API URL
getData("https://api.collection.nfsa.gov.au/search?query=lobby%20card&hasMedia=yes&forms=Lobby%20card");

//------------------------------------- Hero --------------------------------------

function displayResults(results, section) {
  const outputDiv = document.getElementById(section);

  // Work out the previous and next positions
  let previousIndex = middleImage - 1;
  let nextIndex = middleImage + 1;

  // If previous goes before the first result, use the last result
  if (previousIndex < 0) {
    previousIndex = results.length - 1;
  }

  // If next goes past the last result, use the first result
  if (nextIndex >= results.length) {
    nextIndex = 0;
  }

  // Get the three lobby cards
  const previousItem = results[previousIndex];
  const item = results[middleImage];
  const nextItem = results[nextIndex];
  // Call More Like This here
  displayMoreLikeThis(results, item);


  // Combine the base image URL with the API file path
  const baseurl = "https://media.nfsacollection.net/";

  const previousImageurl =
    baseurl + previousItem.preview[0].filePath;
  const imageurl =
    baseurl + item.preview[0].filePath;
  const nextImageurl =
    baseurl + nextItem.preview[0].filePath;


  outputDiv.innerHTML = `
    <div class="text-center py-10">

      <p class="text-base font-sans mb-12 font-normal">
        Explore 833 lobby cards from the NFSA Collection and discover films through their titles, production years and genres.
      </p>

      <h1 class="text-4xl font-serif text-red-900 mb-2">
        ${item.title}
      </h1>

      <p class="text-2xl font-sans font-medium">
        ${item.productionDates[0].fromYear} · ${item.parentTitle.genres}
      </p>

      <div class="flex overflow-hidden justify-center gap-6 mt-6 h-80 w-auto">
        <img
          src="${previousImageurl}"
          alt="${previousItem.title}"
          class ="opacity-30"
        >

        <img
          src="${imageurl}"
          alt="${item.title}"
          class = "border-4 border-red-900"
        >

        <img
          src="${nextImageurl}"
          alt="${nextItem.title}"
          class ="opacity-30"
        >
      </div>

      <div class="flex justify-center gap-10 mt-2">
        <button id="previousButton"><</button>
        <p> Scroll down to discover more like this </p>
        <button id="nextButton">></button>
      </div>

    </div>
  `;


  // Next button
  document.getElementById("nextButton").addEventListener("click", () => {

    middleImage = middleImage + 1;

    if (middleImage >= results.length) {
      middleImage = 0;
    }

    displayResults(results, section);
  });


  // Previous button
  document.getElementById("previousButton").addEventListener("click", () => {

    middleImage = middleImage - 1;

    if (middleImage < 0) {
      middleImage = results.length - 1;
    }

    displayResults(results, section);
  });
}

//--------------------------------- More Like This -------------------------------------------

function displayMoreLikeThis(results, item) {

  const section = document.getElementById("more-like-this");

  const currentYear = item.productionDates[0].fromYear;
  const currentGenre = item.parentTitle.genres;

  // Filtering results
  const sameYearResults = results.filter(film => {
    return film.productionDates[0].fromYear === currentYear;
  });

  const sameGenreResults = results.filter(film => {
    return film.parentTitle.genres === currentGenre;
  });

  //Testing
  console.log("Same year:", sameYearResults);
  console.log("Same genre:", sameGenreResults);

  // Display results
  const yearItem = sameYearResults[0];
  const genreItem = sameGenreResults[0];

  const baseurl = "https://media.nfsacollection.net/";

  // Combine the base image URL with the API file path and filtered results 
  const yearImageurl =
    baseurl + yearItem.preview[0].filePath; 

  const genreImageurl =
    baseurl + genreItem.preview[0].filePath;

  section.innerHTML = `
    <div class="text-center py-10">

      <h2 class="text-4xl font-serif mb-12">
        More Like This
      </h2>

      <div class="flex justify-evenly">

        <div>
          <h3 class="text-2xl">
            ${currentYear}
          </h3>

          <p>
            Browse ${sameYearResults.length} Lobby Cards
          </p>

          <img
            src="${yearImageurl}"
            alt="${yearItem.title}"
            class="h-80 mt-6"
          >

          <p class="text-xl font-serif mt-4 text-red-900">
            ${yearItem.title}
          </p>
        </div>


        <div>
          <h3 class="text-2xl">
            ${currentGenre}
          </h3>

          <p>
            Browse ${sameGenreResults.length} Lobby Cards
          </p>

          <img
            src="${genreImageurl}"
            alt="${genreItem.title}"
            class="h-80 mt-6"
          >

          <p class="text-xl font-serif mt-4 text-red-900">
            ${genreItem.title}
          </p>
        </div>

      </div>

    </div>
  `;
}
