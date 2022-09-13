const cardName = document.getElementById("cardname");
const mainDeck = document.getElementById("main_deck");
const playerDeck = document.getElementById("player_deck");
const search = document.getElementById("search");

let playerDeckIdArray = [];

  fetch(`http://localhost:3000/deck1/`)
  .then((res) => res.json())
  .then((data) => {
    data
      .forEach((card) => {
        renderPlayerDeck(card);
        playerDeckIdArray.push(card.id);
      });
      return playerDeckIdArray;
  });




const fetchCards = (name) => {
  // Fuzzy search
  return fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${name}`)
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((item) => {
        renderSearchCards(item);
      });
    });
};

// Render Functions
const renderSearchCards = (card) => {
  const newCard = createCard(card.id, card.card_images[0].image_url_small);
  // Event Listener to add card to player's Deck
  newCard.addEventListener("click", () => {
    addCardToPlayerDeck(newCard);
  });

  mainDeck.append(newCard);
};

const renderPlayerDeck = (card) => {
  let playerCardCount = card.count;
  let newCard = createCard(card.id, card.image);
  playerDeck.append(newCard);
};

function createCard(id, url) {
  const card = document.createElement("a");
  const imageContainer = document.createElement("img");

  card.className = "card";
  card.id = id;
  imageContainer.src = url;
  imageContainer.className = "card-image";
  card.append(imageContainer);
  return card;
}

// Handle Functions
function addCardToPlayerDeck(card) {
  if (isLessThanThree(playerDeckIdArray, card.id)) {
    playerDeck.append(card.cloneNode(true));
    playerDeckIdArray.push(card.id);

    // note only works if card doesnt exist in deck already
    postCardToDatabase(card);
  }
}

const postCardToDatabase = (card) => {
  fetch("http://localhost:3000/deck1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: card.id,
      image: card.querySelector("img").src,
      count: 1,
    }),
  });
};

// Function to append card at least 3 times
const isLessThanThree = (myArray, val) => {
  return myArray.filter((x) => x === val).length < 3;
};

// Function that checks if its in deck
const existInDeck = () => {};

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
