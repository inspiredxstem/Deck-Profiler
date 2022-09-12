const cardName = document.getElementById("cardname");
const mainDeck = document.getElementById("main_deck");
const playerDeck = document.getElementById("player_deck");
const search = document.getElementById("search");

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
  card.append(imageContainer);

  // Event Listener to add card to player's Deck
  card.addEventListener("click", () => {
    playerDeck.append(card);
  });

  mainDeck.append(card);

};

const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

document.querySelector("#cards-search").addEventListener("submit", (event) => {
  event.preventDefault();
  fetchCards(event.target.cardname.value);
});
