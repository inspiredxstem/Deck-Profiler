let test = document.getElementById("test")
test.textContent = "Hello"

const fetchCards = () => {
    return fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    .then(res => res.json())
}


// const createCards = () => {
//     return fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php", {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json',
//         },
//         body: JSON.stringify()
//     })


// .then(data => console.log(data))
// .then(data => console.log(data.data.map(a => a.card_images[0].image_url_small)))
// .then(data => console.log(data.data.map(a => a.id)))
// .then(data => console.log(data.data[0].card_images[0].image_url))

const searchCard = () => {

}