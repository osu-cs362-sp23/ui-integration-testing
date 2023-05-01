const form = document.getElementById("add-photo-form")
const urlInput = document.getElementById("url")
const captionInput = document.getElementById("caption")

form.addEventListener("submit", function (event) {
    event.preventDefault()
    const url = urlInput.value
    const caption = captionInput.value
    if (url && caption) {
        insertNewPhotoCard(url, caption)
        urlInput.value = ""
        captionInput.value = ""
    }
})

function insertNewPhotoCard(url, caption) {
    const photoItem = document.createElement("li")
    photoItem.classList.add("photo-card")

    const photoImg = document.createElement("img")
    photoImg.src = url
    photoImg.alt = caption

    const captionP = document.createElement("p")
    captionP.textContent = caption

    photoItem.append(photoImg, captionP)
    const photoContainer = document.getElementById("photo-card-list")
    photoContainer.appendChild(photoItem)
}
