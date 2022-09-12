const cardName = document.getElementById("cardname")
const mainDeck = document.getElementById("main_deck")
const search = document.getElementById("search")




const fetchCards = (name) => {
    // fuzzy search
    return fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${name}`)
    .then(res => res.json())
    .then(data => {
        data.data.forEach(character => {
            createCards(character)
        });
    })
}

const createCards = (dataObj) => {
    // create DOM objects
    const card = document.createElement("a");
    const imageThumbnailContainer = document.createElement("img");
    // extract necessary data from dataObj
    const thumbnailImageUrl = dataObj.card_images[0].image_url_small;
    const characterId = dataObj.id;


    card.className = "card";
    card.id = characterId;

    imageThumbnailContainer.src = thumbnailImageUrl;
    card.append(imageThumbnailContainer);

    mainDeck.append(card);
    
}

document.querySelector("#cards").addEventListener("submit", (event) => {
    event.preventDefault();
    fetchCards(event.target.cardname.value)    
})


