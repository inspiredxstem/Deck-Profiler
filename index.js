const cardName = document.getElementById("cardname");
const mainDeck = document.getElementById("main_deck");
const playerDeck = document.getElementById("player_deck");
const search = document.getElementById("search");

let playerDeckIdArray = [];

// ADD FUNCTIONALITY: on click to dropdown menu, select deck and render cards
let selectDeck = "deck1";

fetch(`http://localhost:3000/${selectDeck}/`)
  .then((res) => res.json())
  .then((data) => {
    data.forEach((card) => {
      for (let i = 0; i < card.count; i++) {
        renderPlayerDeck(card);
        playerDeckIdArray.push(card.id);
      }
    });
    return playerDeckIdArray;
  })
  .then((data) => {
    console.log("initial render playerDeck", data);
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
  let newCard = createCard(card.id, card.image);

  playerDeck.append(newCard);

  addDeleteEvent(newCard, card);

};


function addDeleteEvent(newCard, card) {
  newCard.addEventListener("click", () => {
    let decrement = card.count - 1;
    if (card.count > 1) {
      updatePlayerDeck(selectDeck, card.id, decrement);
    } else {
      deletePlayerCard(card.id);
    }
    document.getElementById(card.id).remove();
  });
}

// oh it should go to addCardToPlayerDeck no?
// can we write a function to add delete event? i think so lets try it ok
//the issue is that dom element we just add are added without delete click events. So where we render dom elements, we need to add delete evenets

function deletePlayerCard(cardId) {
  fetch(`http://localhost:3000/${selectDeck}/${cardId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    }
  });
}

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
    if (playerDeckIdArray.includes(card.id)) {
      fetch(`http://localhost:3000/${selectDeck}/${card.id}`)
        .then((res) => res.json())
        .then((data) => {
          let increment = data.count + 1;
          updatePlayerDeck(selectDeck, card.id, increment);
        });
    } else {
      // note only works if card doesnt exist in deck already
      postCardToDatabase(card);
    } 
    playerDeck.append(card.cloneNode(true))
  }
  playerDeckIdArray.push(card.id);
}

const updatePlayerDeck = (selectDeck, test, newCount) => {
  return fetch(`http://localhost:3000/${selectDeck}/${test}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      count: newCount,
    }),
  }).then((res) => res.json());
};

const postCardToDatabase = (card) => {
  fetch(`http://localhost:3000/${selectDeck}/`, {
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
