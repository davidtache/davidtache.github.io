let containerWidth = document.querySelector(".page").clientWidth;
const padding = 7;
document.querySelector(".page").style.setProperty('--pic-padding', padding + "px");
const rows = Array.from(document.querySelectorAll(".row"));
const clickable = Array.from(document.querySelectorAll(".img-container"));
const modalBack = document.querySelector(".modal-back");
const modalImg = modalBack.querySelector("img");

window.onload = function () {
    resizeGrid();
    gsap.to(".gallery", {
        duration: .2,
        opacity: 1
    })

    modalBack.onclick = function () {
        closeModal();
    }
}

function resizeGrid() {
    containerWidth = document.querySelector(".page").clientWidth;
    rows.forEach(r => {
        const cols = Array.from(r.querySelectorAll(".col"));

        const colSizes = [];
        cols.forEach(c => {
            const images = Array.from(c.querySelectorAll("img"));
            let w = images[0].naturalWidth, h = 0;
            images.forEach(image => {
                h += (image.naturalHeight);
            });
            colSizes.push([w, h]);
        });

        let totalAspectRatio = 0;
        const colRatios = [];
        cols.forEach((c, cIdx) => {
            colRatios[cIdx] = colSizes[cIdx][0] / colSizes[cIdx][1];
            if (c.classList.contains("fix-1")) {
                colRatios[cIdx] += 3.5 * (padding / containerWidth);
            } else if (c.classList.contains("fix-2")) {
                colRatios[cIdx] += .95 * (padding / containerWidth);
            } else if (c.classList.contains("fix-3")) {
                colRatios[cIdx] += (padding / containerWidth);
            }
            totalAspectRatio += colRatios[cIdx];
        });

        cols.forEach((c, cIdx) => {
            let pxWidth = ((containerWidth - cols.length * padding) * colRatios[cIdx] / totalAspectRatio);
            c.style.width = (pxWidth / containerWidth * 100) + "%";
        });
    })
}

function openModal() {
    gsap.timeline({})
        .set(modalBack, {
            height: "100vh",
            display: "flex"
        }, 0)
        .to(modalBack, {
            duration: .25,
            opacity: 1
        }, 0)
}

function closeModal() {
    gsap.timeline({})
        .to(modalBack, {
            duration: .25,
            opacity: 0
        }, 0)
        .set(modalBack, {
            display: "none"
        })
}

window.onresize = resizeGrid;