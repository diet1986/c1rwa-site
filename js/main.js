
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

// ── Complaint Modal — Firestore ──────────────────────────────
const complaintModal      = document.getElementById('complaintModal');
const openComplaintBtn    = document.getElementById('openComplaintModal');
const closeComplaintBtn   = document.getElementById('closeComplaintModal');
const complaintForm       = document.getElementById('complaintForm');
const complaintSuccess    = document.getElementById('complaintSuccess');
const complaintNumberDisp = document.getElementById('complaintNumberDisplay');
const complaintSubmitBtn  = document.getElementById('complaintSubmitBtn');
const complaintDoneBtn    = document.getElementById('complaintDoneBtn');

function openComplaintModal() {
    complaintModal.classList.add('open');
    complaintModal.setAttribute('aria-hidden', 'false');
    complaintForm.style.display = '';
    complaintSuccess.style.display = 'none';
    complaintForm.reset();
    complaintSubmitBtn.disabled = false;
    complaintSubmitBtn.textContent = 'Submit Complaint';
}

function closeComplaintModal() {
    complaintModal.classList.remove('open');
    complaintModal.setAttribute('aria-hidden', 'true');
}

if (openComplaintBtn) openComplaintBtn.addEventListener('click', e => { e.preventDefault(); openComplaintModal(); });
if (closeComplaintBtn) closeComplaintBtn.addEventListener('click', closeComplaintModal);
if (complaintDoneBtn) complaintDoneBtn.addEventListener('click', closeComplaintModal);

if (complaintModal) {
    complaintModal.addEventListener('click', e => {
        if (e.target === complaintModal) closeComplaintModal();
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && complaintModal && complaintModal.classList.contains('open')) closeComplaintModal();
});

/**
 * Generate the next complaint number in the format C1-RWA-YYYY-NNNN.
 * Uses a Firestore transaction on a dedicated counter document to
 * guarantee uniqueness even under concurrent submissions.
 */
async function generateComplaintNumber() {
    const year        = new Date().getFullYear();
    const counterRef  = db.collection('meta').doc('complaintCounter');

    return db.runTransaction(async transaction => {
        const counterDoc = await transaction.get(counterRef);
        let seq = 1;

        if (counterDoc.exists) {
            const data = counterDoc.data();
            // Reset sequence if the stored year differs from the current year
            seq = (data.year === year) ? (data.seq + 1) : 1;
        }

        transaction.set(counterRef, { year, seq });
        return `C1-RWA-${year}-${String(seq).padStart(4, '0')}`;
    });
}

if (complaintForm) {
    complaintForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name      = document.getElementById('cName').value.trim();
        const houseNo   = document.getElementById('cHouse').value.trim();
        const complaint = document.getElementById('cComplaint').value.trim();

        if (!name || !houseNo || !complaint) {
            alert('Please fill in all required fields.');
            return;
        }

        complaintSubmitBtn.disabled = true;
        complaintSubmitBtn.textContent = 'Submitting…';

        try {
            const complaintNumber = await generateComplaintNumber();
            const now = firebase.firestore.FieldValue.serverTimestamp();

            await db.collection('complaints').add({
                complaintNumber,
                name,
                houseNo,
                complaint,
                status:    'Registered',
                createdAt: now,
                updatedAt: now
            });

            complaintForm.style.display = 'none';
            complaintNumberDisp.textContent = complaintNumber;
            complaintSuccess.style.display = '';
        } catch (err) {
            console.error('Complaint submission error:', err);
            alert('Something went wrong. Please try again or contact us directly.');
            complaintSubmitBtn.disabled = false;
            complaintSubmitBtn.textContent = 'Submit Complaint';
        }
    });
}

// ── Track Complaint ───────────────────────────────────────────
const trackForm       = document.getElementById('trackForm');
const trackInput      = document.getElementById('trackInput');
const trackResult     = document.getElementById('trackResult');

if (trackForm) {
    trackForm.addEventListener('submit', async e => {
        e.preventDefault();
        const number = trackInput.value.trim().toUpperCase();

        if (!number) {
            trackResult.innerHTML = '<p class="track-error">Please enter a complaint number.</p>';
            return;
        }

        trackResult.innerHTML = '<p class="track-loading">Searching…</p>';

        try {
            const snapshot = await db.collection('complaints')
                .where('complaintNumber', '==', number)
                .limit(1)
                .get();

            if (snapshot.empty) {
                trackResult.innerHTML = `<p class="track-error">No complaint found for <strong>${escTrack(number)}</strong>. Please check the number and try again.</p>`;
                return;
            }

            const data  = snapshot.docs[0].data();
            const date  = data.createdAt
                ? new Date(data.createdAt.toMillis()).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'long', year: 'numeric'
                  })
                : '—';

            const statusClass = slugifyTrack(data.status);

            trackResult.innerHTML = `
                <div class="track-card">
                    <div class="track-card-header">
                        <span class="track-number">${escTrack(data.complaintNumber)}</span>
                        <span class="track-status track-status--${statusClass}">${escTrack(data.status)}</span>
                    </div>
                    <div class="track-card-body">
                        <div class="track-field"><span class="track-label">Resident</span><span>${escTrack(data.name)}</span></div>
                        <div class="track-field"><span class="track-label">House No.</span><span>${escTrack(data.houseNo)}</span></div>
                        <div class="track-field"><span class="track-label">Submitted</span><span>${date}</span></div>
                        <div class="track-field track-field--full"><span class="track-label">Complaint</span><span>${escTrack(data.complaint)}</span></div>
                    </div>
                </div>`;
        } catch (err) {
            console.error('Track complaint error:', err);
            trackResult.innerHTML = '<p class="track-error">An error occurred. Please try again.</p>';
        }
    });
}

function escTrack(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function slugifyTrack(str) {
    return (str || '').toLowerCase().replace(/\s+/g, '-');
}
