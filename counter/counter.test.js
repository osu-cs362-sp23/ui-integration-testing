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

test("counter increments when clicked (by role)", async function () {
    initDomFromFiles(
        __dirname + "/counter.html",
        __dirname + "/counter.js"
    )
    const counter = domTesting.getByRole(document, "button")
    expect(counter).toHaveTextContent("0")
    const user = userEvent.setup()
    await user.click(counter)
    expect(counter).toHaveTextContent("1")
})

test("counter increments when clicked (by text)", async function () {
    initDomFromFiles(
        __dirname + "/counter.html",
        __dirname + "/counter.js"
    )
    const counter = domTesting.getByText(document, "0")
    const user = userEvent.setup()
    await user.click(counter)
    expect(counter).toHaveTextContent("1")
})
