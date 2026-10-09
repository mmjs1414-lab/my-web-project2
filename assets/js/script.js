//Globals
let min = 0;
let max = 833;
let middleImage = Math.floor(Math.random() * (max - min + 1)) + min; // Random selection for middle image, changes when user refreshes
let yearImage = 0;   // Display same year from the first array
let genreImage = 0;  // Display same genre from the first array
let allResults = [];
let limit = 25;
let sameGenreResults = [];

// Reusable button styles 
const buttonStyle = "flex items-center justify-center border-2 border-red-900 text-red-900 rounded-full w-10 h-8 hover:bg-red-900 hover:text-orange-50 shrink-0";
const arrowStyle = "text-4xl leading-none -translate-y-1";

// NFSA API search URL
let currentQueryUrl =
  "https://api.collection.nfsa.gov.au/search?query=lobby%20card&hasMedia=yes&forms=Lobby%20card";

// Loading every page (34 pages) of results from the API before displaying the website
async function loadAllResults() {

  // Show loading message while API results are being fetched
  const outputDiv = document.getElementById("hero");
  outputDiv.innerHTML = `
    <div class="text-center justify-center py-20">
      <h2 class="text-4xl font-serif text-red-900 mb-6">
        Loading...
      </h2>
      <p> Please wait few seconds for the lobby cards to be fetched from the NFSA collection. </p>
    </div>
  `;

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

    // Filter out unwanted results 
    const filteredResults = data.results.filter(item => {

      const genres = item.parentTitle.genres;

      if (genres === null) {
        return true;
      }

      return !genres.includes("Sex and erotica")
    });

    // Add the new page of results to all previously loaded results 
    allResults = allResults.concat(filteredResults);
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

//--------------------------------- Search --------------------------------------

// Find the search input from the HTML
const searchInput = document.getElementById("searchInput");

// Run the search each time the user types
searchInput.addEventListener("input", function () {

  // Get the search text and make it lowercase
  const searchTerm = searchInput.value.toLowerCase();

  const searchResults = allResults.filter(item => {
    return item.title &&
      item.title.toLowerCase().includes(searchTerm);
  });

  // Test
  console.log("Search results:", searchResults);

  // Reset carousel to the first search result, other valyes causes error
  middleImage = 0;

  // If there are matching results, display them in hero
  if (searchResults.length > 0) {

    console.log("Number of matches:", searchResults.length);
    console.log("First match:", searchResults[0]);

    displayResults(searchResults, "hero");

    // If no matching result, display message in hero section
  } else {
    const outputDiv = document.getElementById("hero");
    const section = document.getElementById("more-like-this");

    outputDiv.innerHTML = `
    <div class="text-center py-20">
      <h2 class="text-4xl font-serif text-red-900">
        No results found for "${searchInput.value}"
      </h2>
  `;


    // Remove the previous More Like This results
    section.innerHTML = "";
  }
});

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
    <div class="text-center py-10 px-4">

      <p class="text-base font-sans mb-10 font-normal">
        Explore ${allResults.length} lobby cards from the NFSA Collection and discover films through their titles, production years and genres.
      </p>

      <h1 class="text-2xl md:text-4xl font-serif text-red-900 mb-2 break-words">
        ${item.title}
      </h1>

<p class="text-base md:text-2xl font-sans font-medium break-words">
  ${item.productionDates[0].fromYear} ·
  ${item.parentTitle.genres === null
      ? "Genre Unavailable"
      : item.parentTitle.genres.join(", ")}
</p>

      <div class="flex justify-center items-center gap-2 lg:gap-6 mt-6">
        <img
          src="${previousImageurl}"
          alt="${previousItem.title}"
          class ="hidden lg:block opacity-30 lg:w-96 lg:h-80 object-contain"
        >

        <img
          src="${imageurl}"
          alt="${item.title}"
          class = "block w-auto h-auto max-w-full max-h-64 lg:max-w-96 lg:max-h-80 border-4 border-red-900"
        >

        <img
          src="${nextImageurl}"
          alt="${nextItem.title}"
          class ="hidden lg:block opacity-30 lg:w-96 lg:h-80 object-contain"
        >

      </div>

      <div class="flex justify-center items-center gap-8 md:gap-6 mt-4">
        <button id="previousButton" class="${buttonStyle}">
        <span class="${arrowStyle}">←</span>
        </button>
        <p class="text-xs md:text-base"> Scroll down to discover more like this </p>
        <button id="nextButton" class="${buttonStyle}">
        <span class="${arrowStyle}">→</span>
        </button>
      </div>

    </div>
  `;


  // Next button
  document.getElementById("nextButton").addEventListener("click", () => {

    middleImage = middleImage + 1;

    // Return to the first result after reaching the end
    if (middleImage >= results.length) {
      middleImage = 0;
    }

    displayResults(results, section);
  });


  // Previous button
  document.getElementById("previousButton").addEventListener("click", () => {

    middleImage = middleImage - 1;

    // Go to the last result if the user moves before the first result
    if (middleImage < 0) {
      middleImage = results.length - 1;
    }

    displayResults(results, section);
  });
}

//--------------------------------- More Like This -------------------------------------------

// Reusable HTML for Same Year and Same Genre carousels
function displayCards(type, heading, results, index) {

  const item = results[index];
  const imageurl = "https://media.nfsacollection.net/" + item.preview[0].filePath;

  return `
    <div class="w-96 text-center">

      <h3 class="text-lg md:text-2xl font-medium mb-2 truncate">
        ${heading}
      </h3>

      <p>
        Browse ${results.length} Lobby Cards
      </p>

      <img
        src="${imageurl}"
        alt="${item.title}"
        class="max-w-full max-h-64 md:max-h-80 w-auto h-auto mx-auto mt-6 border-4 border-red-900"
      >

      <div class="flex items-center justify-center gap-16 sm:gap-16 md:gap-10 mt-4">

        <button id="previous${type}Button" class="${buttonStyle}">
          <span class="${arrowStyle}">←</span>
        </button>

        <p class="text-base md:text-xl font-serif text-red-900 w-32 md:w-56 shrink-0 text-center break-words">
          ${item.title}
        </p>

        <button id="next${type}Button" class="${buttonStyle}">
          <span class="${arrowStyle}">→</span>
        </button>

      </div>
    </div>
  `;
}

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
  const yearItem = sameYearResults[yearImage];
  const genreItem = sameGenreResults[genreImage];

  const baseurl = "https://media.nfsacollection.net/";

  // Combine the base image URL with the API file path and filtered results 
  const yearImageurl =
    baseurl + yearItem.preview[0].filePath;
  const genreImageurl =
    baseurl + genreItem.preview[0].filePath;


  // Secondary carousels layout and styling 

  section.innerHTML = `
    <div class="text-center mb-8 px-4">

      <h2 class="text-2xl font-serif mb-14 md:text-4xl">
        MORE LIKE <span class="text-red-900">"${item.title}"</span>
      </h2>

      <div class="flex flex-col md:flex-row justify-evenly items-center md:items-start gap-10 md:gap-6t">

      <!-- Same Year -->
      ${displayCards("Year", currentYear, sameYearResults, yearImage)}


<!-- Same Gnere -->
${displayCards(
    "Genre",
    currentGenre === null ? "Genre Unavailable" : currentGenre.join(", "),
    sameGenreResults,
    genreImage
  )}
</div>
</div>
`;

  console.log("Selected card:", item.title);
  console.log("Current genre:", currentGenre);

  // Next year button
  document.getElementById("nextYearButton").addEventListener("click", () => {

    yearImage = yearImage + 1;

    if (yearImage >= sameYearResults.length) {
      yearImage = 0;
    }

    displayMoreLikeThis(allResults, item);
  });


  // Previous year button
  document.getElementById("previousYearButton").addEventListener("click", () => {

    yearImage = yearImage - 1;

    if (yearImage < 0) {
      yearImage = sameYearResults.length - 1;
    }

    displayMoreLikeThis(allResults, item);
  });

  // Next genre button
  document.getElementById("nextGenreButton").addEventListener("click", () => {

    genreImage = genreImage + 1;

    if (genreImage >= sameGenreResults.length) {
      genreImage = 0;
    }

    displayMoreLikeThis(allResults, item);
  });


  // Previous genre button
  document.getElementById("previousGenreButton").addEventListener("click", () => {

    genreImage = genreImage - 1;

    if (genreImage < 0) {
      genreImage = sameGenreResults.length - 1;
    }

    displayMoreLikeThis(allResults, item);
  });
}