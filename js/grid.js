let containerWidth = document.querySelector(".page").clientWidth;
const padding = 5;
const rows = Array.from(document.querySelectorAll(".row"));
const clickable = Array.from(document.querySelectorAll(".img-container"));
const modalBack = document.querySelector(".modal-back");
const modalImg = modalBack.querySelector("img");

let modalOpen = false;
let clickedIdx = 0;

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

window.onresize = resizeGrid;

clickable.forEach(img => {
    img.onclick = function () {
        getModalSrc(img.querySelector("img"));
        clickedIdx = clickable.indexOf(img);
        openModal();
    }
})

document.addEventListener("keydown", (e) => {
    if (modalOpen) {
        const keyCode = e.keyCode || e.which;
        const key = e.key || e.keyIdentifier;

        if (key === "ArrowLeft" || keyCode === 37) {
            clickedIdx = (clickedIdx - 1 + clickable.length) % clickable.length;
        } else if (key === "ArrowRight" || keyCode === 39 || key === " " || keyCode === 32 || key === "Enter" || keyCode === 13) {
            clickedIdx = (clickedIdx + 1) % clickable.length;
        }
        getModalSrc(clickable[clickedIdx].querySelector("img"));
    }
});


function getModalSrc(img) {
    const filename = img.src.replace(/^.*[\\\/]/, '');
    if (window.location.href.indexOf("tskaltubo") !== -1) {
        modalImg.src = "./img-tska/" + filename.replace("S", "L");
    } else {
        modalImg.src = "./img-main/" + filename.replace("S", "L");
    }
}

function resizeGrid() {
    document.querySelector(".page").style.setProperty('--pic-padding', padding + "px");
    containerWidth = document.querySelector(".page").clientWidth;

    rows.forEach(r => {
        const cols = Array.from(r.querySelectorAll(".col"));

        const colRatios = [];
        let totalAspectRatio = 0;
        cols.forEach((c, cIdx) => {
            const images = Array.from(c.querySelectorAll("img"));
            let w = images[0].clientWidth * 2 * padding, h = 0;
            images.forEach(image => {
                h += image.clientHeight * 2 * padding;
            });
            colRatios[cIdx] = w / h;
        });
        
        cols.forEach((c, cIdx) => {
            totalAspectRatio += colRatios[cIdx];
        });

        cols.forEach((c, cIdx) => {
            const pxWidth = containerWidth * colRatios[cIdx] / totalAspectRatio;
            c.style.width = (pxWidth / containerWidth * 100) + "%";
        });
    })


}

function openModal() {
    modalOpen = true;
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
    modalOpen = false;
    gsap.timeline({})
        .to(modalBack, {
            duration: .25,
            opacity: 0
        }, 0)
        .set(modalBack, {
            display: "none"
        })
}

