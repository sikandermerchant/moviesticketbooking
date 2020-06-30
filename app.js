const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
let movieName = document.getElementById("movie-name");
///Call function to get data from local storage and populate in UI
populateUI();
///ticket price for the selected seat
let ticketPrice = +movieSelect.value; ///by putting + we can convert the string to number. This is easier than using ParseInt
//Set selected movie index and price in Local storage
movieNameWithPrice = movieSelect.selectedOptions[0].text;
const regex = /\([^()]*\)/g;
movieName.innerText = movieNameWithPrice.replace(regex, "");

function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

//Update selected seat total price and count
function updateSelectedSeatCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  ///In order for us to save the selected seats we will have to do the following:
  //Copy the selected seats into an array using a spread operator - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  ///Map through the seats array using map method - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  //return a new array of indexes for each seat by using indexOf method - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
  //The above 3 steps will be done as below:
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex)); //since local storage stores strings hence we convert seatsIndex to strings 'selectedSeats' is the key
  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  //total for tickets for the selected movie
  total.innerText = selectedSeatsCount * ticketPrice;

  // const selectedSeatsValue = document.querySelector('.movie-container.movie').value;
  // console.log(selectedSeatsValue);
}

//Get data from local storage and populate in UI
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }
  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");
  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
  const selectedMovie = localStorage.getItem("selectedMovieIndex");
}
///Seat Click Event Listener
///Selecting a Seat - we want to add the class .selected to the seat that we have clicked on
//Couple of ways to do this: 1st by using a forEach Loop on the nodeList that we get from the querySelector
//2nd and the more performance efficient one is to add an event listener to the container and then delegate it ti the actual seat that is clicked
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected"); //element.classList.toggle is used here so we can add and remove accordingly
    updateSelectedSeatCount();
  }
  e.preventDefault();
});

//Movie select event listener
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  movieNameWithPrice = e.target.selectedOptions[0].text; //ref: https://stackoverflow.com/questions/14976495/get-selected-option-text-with-javascript and https://stackoverflow.com/questions/14976495/get-selected-option-text-with-javascript
  const regex = /\([^()]*\)/g; ///regex ref: https://stackoverflow.com/questions/640001/how-can-i-remove-text-within-parentheses-with-a-regex
  movieName.innerText = movieNameWithPrice.replace(regex, "");
  setMovieData(e.target.selectedIndex, e.target.value); ///https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedIndex
  updateSelectedSeatCount();

  e.preventDefault();
});

///Initial count and total on page load
updateSelectedSeatCount();
