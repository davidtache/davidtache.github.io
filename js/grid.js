const containerWidth = document.querySelector(".page").clientWidth;
const padding = 7;
document.querySelector(".page").style.setProperty('--pic-padding', padding + "px");
const rows = Array.from(document.querySelectorAll(".row"));
const clickable = Array.from(document.querySelectorAll(".img-container"));
const modalBack = document.querySelector(".modal-back");
const modalImg = modalBack.querySelector("img");


rows.forEach(r => {
    const cols = Array.from(r.querySelectorAll(".col"));

    const colRatios = [];
    let totalAspectRatio = 0;

    cols.forEach((c, cIdx) => {
        const images = Array.from(c.querySelectorAll("img"));
        let w = images[0].naturalWidth, h = 0;
        images.forEach(image => {
            h += (image.naturalHeight);
        });
        if (images.length > 1) {
            w -= 2.5 * padding;
        }
        colRatios[cIdx] = w / h;
        totalAspectRatio += colRatios[cIdx];
    });

    cols.forEach((c, cIdx) => {
        const pxWidth = ((containerWidth - cols.length * padding) * colRatios[cIdx] / totalAspectRatio);
        c.style.width = (pxWidth / containerWidth * 100) + "%";
    });


})

clickable.forEach(img => {
    img.onclick = function () {
        const filename = img.querySelector("img").src.replace(/^.*[\\\/]/, '');
        // console.log(filename.replace("S", "L"))
        modalImg.src = "./img-main/" + filename.replace("S", "L");
        openModal();
    }
})

modalBack.onclick = function () {
    closeModal();
}

function openModal() {
    gsap.timeline({})
        .set(modalBack, {
            height: window.innerHeight,
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
