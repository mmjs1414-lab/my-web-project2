//Globals
let middleImage = 0; // Display result from the first array
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
    displayResults(data.results);
  } catch (error) {
    console.error(error.message);
    document.getElementById("hero").innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }
}

// Call getData with NFSA API URL
getData("https://api.collection.nfsa.gov.au/search?query=lobby%20card&hasMedia=yes&forms=Lobby%20card");

function displayResults(results) {
  const outputDiv = document.getElementById("hero");

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

  // Combine the base image URL with the API file path
  const baseurl = "https://media.nfsacollection.net/";

  const previousImageurl =
    baseurl + previousItem.preview[0].filePath;
  const imageurl =
    baseurl + item.preview[0].filePath;
  const nextImageurl =
    baseurl + nextItem.preview[0].filePath;


  outputDiv.innerHTML = `
    <div class="text-center py-12">

      <p class="text-base font-sans mb-9 font-normal">
        Browse 833 Lobby Cards from the NFSA Collection
      </p>

      <h1 class="text-4xl font-serif text-red-900 mb-4">
        ${item.title}
      </h1>

      <p class="text-2xl font-sans font-medium">
        ${item.productionDates[0].fromYear} · ${item.parentTitle.genres}
      </p>

      <div class="flex justify-center gap-6 mt-6 h-80 w-auto">
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

      <div>
        <button id="previousButton"><</button>
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

    displayResults(results);
  });


  // Previous button
  document.getElementById("previousButton").addEventListener("click", () => {

    middleImage = middleImage - 1;

    if (middleImage < 0) {
      middleImage = results.length - 1;
    }

    displayResults(results);
  });
}