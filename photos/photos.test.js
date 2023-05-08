/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom/extend-expect")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const fs = require("fs")

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        require(jsPath)
    })
}

test("photo card inserted when URL and caption are submitted", async function () {
    initDomFromFiles(
        __dirname + "/photos.html",
        __dirname + "/photos.js"
    )
    const urlInput = domTesting.getByLabelText(document, "Photo URL")
    const captionInput = domTesting.getByLabelText(document, "Caption")
    const addPhotoButton = domTesting.getByRole(document, "button")
    const photoCardList = domTesting.getByRole(document, "list")

    const user = userEvent.setup()
    await user.type(urlInput, "http://placekitten.com/480/480")
    await user.type(captionInput, "Cute kitty")
    await user.click(addPhotoButton)

    expect(photoCardList).not.toBeEmptyDOMElement()
    const photoCards = domTesting.queryAllByRole(photoCardList, "listitem")
    expect(photoCards).toHaveLength(1)
    const img = domTesting.queryByRole(photoCards[0], "img")
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute("src", "http://placekitten.com/480/480")
    expect(
        domTesting.queryByText(photoCards[0], "Cute kitty")
    ).not.toBeNull()
})

test("form fields are cleared when successfully submitted", async function () {
    initDomFromFiles(
        __dirname + "/photos.html",
        __dirname + "/photos.js"
    )
    const urlInput = domTesting.getByLabelText(document, "Photo URL")
    const captionInput = domTesting.getByLabelText(document, "Caption")
    const addPhotoButton = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(urlInput, "http://placekitten.com/480/480")
    await user.type(captionInput, "Cute kitty")
    await user.click(addPhotoButton)

    expect(urlInput).not.toHaveValue()
    expect(captionInput).not.toHaveValue()
})

test("form fields are not cleared when unsuccessful", async function () {
    initDomFromFiles(
        __dirname + "/photos.html",
        __dirname + "/photos.js"
    )
    const captionInput = domTesting.getByLabelText(document, "Caption")
    const addPhotoButton = domTesting.getByRole(document, "button")
    const photoCardList = domTesting.getByRole(document, "list")

    const user = userEvent.setup()
    await user.type(captionInput, "Only caption")
    await user.click(addPhotoButton)

    expect(captionInput).toHaveValue("Only caption")
    expect(photoCardList).toBeEmptyDOMElement()
})

test("inserts multiple photo cards", async function () {
    initDomFromFiles(
        __dirname + "/photos.html",
        __dirname + "/photos.js"
    )
    const urlInput = domTesting.getByLabelText(document, "Photo URL")
    const captionInput = domTesting.getByLabelText(document, "Caption")
    const addPhotoButton = domTesting.getByRole(document, "button")
    const photoCardList = domTesting.getByRole(document, "list")

    const user = userEvent.setup()
    await user.type(urlInput, "http://placekitten.com/480/480?image=1")
    await user.type(captionInput, "Cute kitty #1")
    await user.click(addPhotoButton)

    await user.type(urlInput, "http://placekitten.com/480/480?image=2")
    await user.type(captionInput, "Cute kitty #2")
    await user.click(addPhotoButton)

    expect(photoCardList).toMatchSnapshot()
})
