//Globals
let middleImage = 10; // Display result from the first array
let yearImage = 0;   // Display same year from the first array
let genreImage = 0;  // Display same genre from the first array
let allResults = [];
let limit = 25;
let sameGenreResults = [];


// NFSA API search URL
let currentQueryUrl =
  "https://api.collection.nfsa.gov.au/search?query=lobby%20card&hasMedia=yes&forms=Lobby%20card";

// Loading every page (34 pages) of results from the API before displaying the website
async function loadAllResults() {

  let page = 1;

  // While loop for requesting pages until the last page is reached
  while (true) {

    // Request one page of 25 results
    const response = await fetch(
      `${currentQueryUrl}&page=${page}&limit=${limit}`
    );

    // Stop the code and show an error if the API request fails
    if (!response.ok) {
      throw new Error("Could not load data from the NFSA API");
    }

    // Convert response to JSON, log data to inspect
    const data = await response.json();
    console.log(data);

    // Add the new page of results to all previously loaded results 
    allResults = allResults.concat(data.results);
    console.log("Page:", page);
    console.log("Total results so far:", allResults.length); //Test

    // If fewer than 25 results are returned, this is the last page
    if (data.results.length < limit) {
      break;
    }

    page = page + 1;
  }

  // Display the hero only after all API results have finished loading
  displayResults(allResults, "hero");
}

loadAllResults();

//------------------------------------- Hero --------------------------------------

function displayResults(results, section) {
  // Find the HTML of Hero 
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

  // The 3 displayed lobby cards
  const previousItem = results[previousIndex];
  const item = results[middleImage];
  const nextItem = results[nextIndex];
  // Send the selected hero item to the More Like This seciton
  displayMoreLikeThis(results, item);


  // Combine the base image URL with the API file path
  const baseurl = "https://media.nfsacollection.net/";

  const previousImageurl =
    baseurl + previousItem.preview[0].filePath;
  const imageurl =
    baseurl + item.preview[0].filePath;
  const nextImageurl =
    baseurl + nextItem.preview[0].filePath;

  // Main carousel layout and styling 
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

    // Return to the first result after reaching the end
    if (middleImage >= allResults.length) {
      middleImage = 0;
    }

    displayResults(allResults, section);
  });


  // Previous button
  document.getElementById("previousButton").addEventListener("click", () => {

    middleImage = middleImage - 1;

    // Go to the last result if the user moves before the first result
    if (middleImage < 0) {
      middleImage = allResults.length - 1;
    }

    displayResults(allResults, section);
  });
}

//--------------------------------- More Like This -------------------------------------------

function displayMoreLikeThis(results, item) {

  const section = document.getElementById("more-like-this");

  const currentYear = item.productionDates[0].fromYear;

  const currentGenre = item.parentTitle.genres


  // Filtering results
  const sameYearResults = allResults.filter(film => {
    return film.productionDates[0].fromYear === currentYear;
  });

  // Store all matching genre results
  let sameGenreResults;

  // If the selected lobby card has no genre, find other results with no genre. 
  if (currentGenre === null) {
    sameGenreResults = allResults.filter(film => {
      return film.parentTitle.genres === null;
    });

  } else {
    // Find lobby cards that share at least one genre with the selected card
    sameGenreResults = allResults.filter(film => {
      return Array.isArray(film.parentTitle.genres) &&
        film.parentTitle.genres.some(genre =>
          currentGenre.includes(genre)
        );
    });
  }

  //Testing
  console.log("Same year:", sameYearResults);
  console.log("Same genre:", sameGenreResults);

  // Display results
  const yearItem = sameYearResults[0]; // First result of filtered  array
  const genreItem = sameGenreResults[0];

  const baseurl = "https://media.nfsacollection.net/";

  // Combine the base image URL with the API file path and filtered results 
  const yearImageurl =
    baseurl + yearItem.preview[0].filePath;
  const genreImageurl =
    baseurl + genreItem.preview[0].filePath;


  // Secondary carousels layout and styling 
  section.innerHTML = `
    <div class="text-center py-8">

      <h2 class="text-4xl font-serif mb-16">
        MORE LIKE "${item.title}"
      </h2>

      <div class="flex justify-evenly">

        <div>
          <h3 class="text-2xl font-medium">
            ${currentYear}
          </h3>

          <p>
            Browse ${sameYearResults.length} Lobby Cards
          </p>

          <img
            src="${yearImageurl}"
            alt="${yearItem.title}"
            class="h-80 mt-6 border-4 border-red-900"
          >

          <p class="text-xl font-serif mt-4 text-red-900">
            ${yearItem.title}
          </p>
        </div>


        <div>
          <h3 class="text-2xl font-medium">
            ${currentGenre === null ? "Genre Unavailable" : currentGenre.join(", ")}
          </h3>

          <p>
            Browse ${sameGenreResults.length} Lobby Cards
          </p>

          <img
            src="${genreImageurl}"
            alt="${genreItem.title}"
            class="h-80 mt-6 border-4 border-red-900"
          >

          <p class="text-xl font-serif mt-4 text-red-900">
            ${genreItem.title}
          </p>
        </div>

      </div>

    </div>
  `;

  console.log("Selected card:", item.title);
  console.log("Current genre:", currentGenre);
}
