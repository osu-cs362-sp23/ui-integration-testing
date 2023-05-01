const counter = document.getElementById("counter")
counter._count = 0
counter.addEventListener("click", function () {
    counter._count++
    counter.textContent = counter._count
})
