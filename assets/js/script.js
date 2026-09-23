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
  let html = "";

  // Results loop 
  results.forEach(item => {

    // Combine the base image URL with the API file path
    const baseurl = "https://media.nfsacollection.net/";
    const imageurl = baseurl + item.preview[0].filePath;

    html += `
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

      <img src="${imageurl}" alt="${item.title}" class= "mx-auto">
      </div>
    `;
  });

  outputDiv.innerHTML = html;
}