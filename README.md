# my-web-project2

## Rationale

LobbyArch is a web application that helps users explore the National Film and Sound Archive of Australia's (NFSA) lobby card collection. I aimed to make the collection easier and more interesting to explore for users unfamiliar with Australian films. I did that by displaying results in an infinite carousel that randomly displays results each time the user refreshes the page. Users can then discover lobby cards visually and explore related films.

## How the Web Application Works

The application has a Hero section, a More Like This section and a search engine.

### Hero Section
The Hero section displays a carousel of lobby cards that users can navigate using previous and next buttons. Each selected card shows the film's title, production year and genre(s).

### More Like This Section
The More Like This section updates based on the selected card and displays two smaller carousels, one showing lobby cards from the same year and another showing cards with the same genre(s). This allows users to find connections between films.

### Search
The Search feature lets users find specific lobby cards after browsing the collection and finding a film they're interested in.

## Development Process

I developed the application in VS Code and ran it locally to test it in the browser. I used `console.log()` and the browser's developer tools to check the API data, identify errors and test interactions. After the main features were working, I focused on making the layout responsive and making it more DRY. I did not fully meet the final responsiveness and DRY requirements because I had to fit them into the last day.

I first fetched data from the NFSA API and used the browser console to understand the result structure. I then displayed the lobby cards and built the carousel and its navigation buttons.

One challenge was that the API returned only 25 results per request. I learned how to use pagination to fetch all results and store them in one array. This was important because I wanted users to dynamically explore as much of the collection as possible.

When developing More Like This, I used array filtering to find cards with matching years and genres. Some films had missing genre information, which caused errors that I had to troubleshoot.

## Research and Resources

I researched concepts outside the teaching material, including how to make a carousel, filter an array from multiple properties, display random items, and build a search bar. I found GeeksforGeeks to be the most helpful resource because  it explains concepts in a simple, summarised way. This helped me understand the code better. I also used generative AI, specifically GPT, to help me write more code and fix syntax errors and small details that were hard to identify. I used Tailwind for CSS and Bootstrap for the search icon. Tailwind helped with styling and responsive design because it is quick to use.

## Improvements Based on Feedback

As I reached the end of the project, I addressed feedback on my prototype by adding a footer with information about the web application. I also added clearer labelling for user actions, which made the design more comprehensive.

## Overall Reflection

Overall, the design of LobbyArch has combined skills in HTML, CSS and JavaScript. I learned to use the Tailwind framework and achieve a functional web application using an API.

## References 

GeeksforGeeks. (2025a, July 23). How to implement search filter functionality in REACT JS ? https://www.geeksforgeeks.org/reactjs/how-to-implement-search-filter-functionality-in-reactjs/

GeeksforGeeks. (2025b, August 5). How to filter an array of objects based on multiple properties in JavaScript ? https://www.geeksforgeeks.org/javascript/

how-to-filter-an-array-of-objects-based-on-multiple-properties-in-javascript/GeeksforGeeks. (2026a, March 18). Building a carousel with vanilla JavaScript. https://www.geeksforgeeks.org/

html/building-a-carousel-with-vanilla-javascript/GeeksforGeeks. (2026b, June 1). Generate random number in given range using JavaScript. https://www.geeksforgeeks.org/javascript/how-to-generate-random-number-in-given-range-using-javascript/

Tailwind. (n.d.). Styling with utility classes - core concepts. Retrieved 9 October 2026, from https://tailwindcss.com/docs/styling-with-utility-classes 