let containerWidth = document.querySelector(".page").clientWidth;
const padding = 5;
const rows = Array.from(document.querySelectorAll(".row"));
const clickable = Array.from(document.querySelectorAll(".img-container"));
const modalBack = document.querySelector(".modal-back");
const modalWrapper = document.querySelector(".modal");
const modalImg = modalBack.querySelector("img");
const modalSubtitle = modalBack.querySelector(".subtitle");

let modalOpen = false;
let clickedIdx = 0;
let modalPicLoading = false;

gsap.to(".gallery", {
    duration: .2,
    opacity: 1
})
window.onload = function () {
    resizeGrid();

}

window.onresize = resizeGrid;

clickable.forEach(img => {
    img.onclick = function () {
        getModalSrc(img.querySelector("img"), img.querySelector(".subtitle > span"));
        clickedIdx = clickable.indexOf(img);
        openModal();
    }
})

let xDown = null;
let yDown = null;

document.addEventListener('touchstart', (evt) => {
    if (modalOpen) {
        const firstTouch = evt.touches[0];
        xDown = firstTouch.pageX;
        yDown = firstTouch.pageY;
        document.body.classList.add('no-scroll');
    }
}, false);
document.addEventListener('touchend', (evt) => {
    if (modalOpen) {
        const firstTouch = evt.touches[0];
        xDown = firstTouch.pageX;
        yDown = firstTouch.pageY;
    }
    document.body.classList.remove('no-scroll');
}, false);

document.addEventListener('touchmove', (e) => {
    if (modalOpen) {

        if (!xDown || !yDown) {
            return;
        }

        // e.preventDefault();

        let xUp = e.touches[0].clientX;
        let yUp = e.touches[0].clientY;

        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                clickedIdx = (clickedIdx - 1 + clickable.length) % clickable.length;
            } else {
                clickedIdx = (clickedIdx + 1) % clickable.length;
            }
        } else {
            closeModal();
        }

        xDown = null;
        yDown = null;

        getModalSrc(clickable[clickedIdx].querySelector("img"), clickable[clickedIdx].querySelector(".subtitle > span"));
    }
}, false);

modalBack.onclick = function (e) {
    if (e.target.nodeName.toLowerCase() !== "img") {
        closeModal();
    } else {
        if (!modalPicLoading) {
            clickedIdx = (clickedIdx + 1) % clickable.length;
            getModalSrc(clickable[clickedIdx].querySelector("img"), clickable[clickedIdx].querySelector(".subtitle > span"));
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (modalOpen) {
        // e.preventDefault();

        const keyCode = e.keyCode || e.which;
        const key = e.key || e.keyIdentifier;

        if (!modalPicLoading) {

            if (key === "ArrowLeft" || keyCode === 37) {
                clickedIdx = (clickedIdx - 1 + clickable.length) % clickable.length;
                getModalSrc(clickable[clickedIdx].querySelector("img"), clickable[clickedIdx].querySelector(".subtitle > span"));
            } else if (key === "ArrowRight" || keyCode === 39 || key === " " || keyCode === 32 || key === "Enter" || keyCode === 13) {
                clickedIdx = (clickedIdx + 1) % clickable.length;
                getModalSrc(clickable[clickedIdx].querySelector("img"), clickable[clickedIdx].querySelector(".subtitle > span"));
            }
        }
    }
});


function getModalSrc(img, subtitle) {

    modalPicLoading = true;
    gsap.to(modalWrapper, {
        duration: .2,
        opacity: 0
    })

    const filename = img.src.replace(/^.*[\\\/]/, '');
    if (window.location.href.indexOf("tskhaltubo") !== -1) {
        modalImg.src = "./img/" + filename.replace("S", "L");
    } else if (window.location.href.indexOf("sloviansk") !== -1) {
        modalImg.src = "./img/" + filename.replace("S", "L");
    } else {
        modalImg.src = "./img-main/" + filename.replace("S", "L");
    }

    modalImg.onload = function () {
        modalPicLoading = false;

        gsap.to(modalWrapper, {
            duration: .2,
            opacity: 1
        })

        if (subtitle) {
            modalSubtitle.innerHTML = subtitle.innerHTML;
            modalSubtitle.style.display = "block";
            modalSubtitle.style.height = "auto";
        } else {
            modalSubtitle.innerHTML = "";
            if (window.location.href.indexOf("tskhaltubo")) {
                modalSubtitle.style.height = "2em";
            } else {
                modalSubtitle.style.display = "none";
            }
        }
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
    document.body.style.overflow = 'hidden';

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
    document.body.style.overflow = '';

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

