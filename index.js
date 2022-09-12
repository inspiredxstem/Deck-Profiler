const cardName = document.getElementById("cardname");
const mainDeck = document.getElementById("main_deck");
const playerDeck = document.getElementById("player_deck");
const search = document.getElementById("search");

let playerDeckIdArray = [];

const fetchCards = (name) => {
  // Fuzzy search
  return fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${name}`)
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((character) => {
        createCards(character);
      });
    });
};

const createCards = (dataObj) => {
  // Create DOM objects
  const card = document.createElement("a");
  const imageContainer = document.createElement("img");
  // Extract necessary data from dataObj
  const thumbnailImageUrl = dataObj.card_images[0].image_url_small;
  const characterId = dataObj.id;

  card.className = "card";
  card.id = characterId;
  imageContainer.src = thumbnailImageUrl;
  imageContainer.className = "card-image";
  card.append(imageContainer);

  // Event Listener to add card to player's Deck
  card.addEventListener("click", () => {
    let playerDeckCards = playerDeck.getElementsByClassName("card");

    // If less than 3 of the same card in player deck, append card.
    if (isLessThanThree(playerDeckIdArray, card.id)) {
      playerDeck.append(card.cloneNode(true));
      playerDeckIdArray.push(card.id);
    }
  });
  mainDeck.append(card);
};

// Function to append card at least 3 times
const isLessThanThree = (myArray, val) => {
  return myArray.filter((x) => x === val).length < 3;
};

const clearList = (parent) => {
  let first = parent.firstElementChild;
  while (first) {
    first.remove();
    first = parent.firstElementChild;
  }
};

document.querySelector("#cards-search").addEventListener("submit", (event) => {
  event.preventDefault();
  clearList(mainDeck);
  fetchCards(event.target.cardname.value);
  document.querySelector("#cards-search").reset();
});

// MVP
