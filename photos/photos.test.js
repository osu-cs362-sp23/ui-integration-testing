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
