
let a = document.getElementById("announcements");
announcements.forEach((x) => {
    let actions = x.file ? `<div class="card-actions"><button type="button" class="preview-pdf" data-file="${x.file}">Preview</button><a href="${x.file}" target="_blank" rel="noopener">Open PDF</a></div>` : "";
    a.innerHTML += `<div class='card'><div class="card-body"><h3>${x.title}</h3><p>${x.description}</p>${actions}</div></div>`;
});

let m = document.getElementById("members");
members.forEach(x => {
    let photo = x.photo ? `<img class="member-photo" src="${x.photo}" alt="${x.name}">` : "";
    m.innerHTML += `<div class='card member-card'>${photo}<div class="member-info"><h3>${x.name}</h3><p>${x.role}</p></div></div>`;
});

const galleryTrack = document.querySelector(".gallery-track");
const galleryDots = document.querySelector(".gallery-dots");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const photoModal = document.querySelector(".photo-modal");
const modalImage = document.querySelector(".photo-modal img");
const modalClose = document.querySelector(".modal-close");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");
const pdfModal = document.querySelector(".pdf-modal");
const pdfFrame = document.querySelector(".pdf-modal iframe");
const pdfClose = document.querySelector(".pdf-close");
const pdfOpen = document.querySelector(".pdf-open");
let galleryIndex = 0;
let galleryTimer;
let gallerySlides = [];

document.querySelectorAll(".preview-pdf").forEach(button => {
    button.addEventListener("click", () => {
        let file = button.dataset.file;
        pdfFrame.src = file;
        pdfOpen.href = file;
        pdfModal.classList.add("open");
        pdfModal.setAttribute("aria-hidden", "false");
    });
});

function closePdf() {
    pdfModal.classList.remove("open");
    pdfModal.setAttribute("aria-hidden", "true");
    pdfFrame.src = "";
}

if (pdfModal) {
    pdfClose.addEventListener("click", closePdf);
    pdfModal.addEventListener("click", event => { if (event.target === pdfModal) closePdf(); });
}

if (galleryTrack && typeof galleryImages !== "undefined") {
    galleryImages.forEach(photo => {
        let slide = document.createElement("button");
        slide.className = "gallery-slide";
        slide.type = "button";
        let image = document.createElement("img");
        image.src = photo.src;
        image.alt = photo.alt || "C1 RWA gallery photo";
        slide.appendChild(image);
        galleryTrack.appendChild(slide);
    });
    gallerySlides = [...document.querySelectorAll(".gallery-slide")];
}

function showGallerySlide(index) {
    galleryIndex = (index + gallerySlides.length) % gallerySlides.length;
    galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;
    document.querySelectorAll(".gallery-dot").forEach((dot, i) => dot.classList.toggle("active", i === galleryIndex));
}

function restartGalleryAuto() {
    clearInterval(galleryTimer);
    galleryTimer = setInterval(() => showGallerySlide(galleryIndex + 1), 3500);
}

function moveGallery(direction) {
    showGallerySlide(galleryIndex + direction);
    restartGalleryAuto();
}

function openPhoto(index) {
    showGallerySlide(index);
    const image = gallerySlides[galleryIndex].querySelector("img");
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    photoModal.classList.add("open");
    photoModal.setAttribute("aria-hidden", "false");
    clearInterval(galleryTimer);
}

function closePhoto() {
    photoModal.classList.remove("open");
    photoModal.setAttribute("aria-hidden", "true");
    restartGalleryAuto();
}

function moveModal(direction) {
    showGallerySlide(galleryIndex + direction);
    const image = gallerySlides[galleryIndex].querySelector("img");
    modalImage.src = image.src;
    modalImage.alt = image.alt;
}

if (galleryTrack && gallerySlides.length) {
    gallerySlides.forEach((slide, index) => {
        let dot = document.createElement("button");
        dot.className = "gallery-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Show photo ${index + 1}`);
        dot.addEventListener("click", () => { showGallerySlide(index); restartGalleryAuto(); });
        galleryDots.appendChild(dot);
        slide.addEventListener("click", () => openPhoto(index));
    });
    galleryPrev.addEventListener("click", () => moveGallery(-1));
    galleryNext.addEventListener("click", () => moveGallery(1));
    modalClose.addEventListener("click", closePhoto);
    modalPrev.addEventListener("click", () => moveModal(-1));
    modalNext.addEventListener("click", () => moveModal(1));
    photoModal.addEventListener("click", event => { if (event.target === photoModal) closePhoto(); });
    document.addEventListener("keydown", event => {
        if (!photoModal.classList.contains("open")) return;
        if (event.key === "Escape") closePhoto();
        if (event.key === "ArrowLeft") moveModal(-1);
        if (event.key === "ArrowRight") moveModal(1);
    });
    showGallerySlide(0);
    restartGalleryAuto();
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && pdfModal && pdfModal.classList.contains("open")) closePdf();
});
