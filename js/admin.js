/**
 * admin.js — C1 RWA Admin Panel
 * Handles Firebase Auth login and Firestore complaint management.
 */

const STATUS_OPTIONS = [
    'Registered',
    'Under Review',
    'In Progress',
    'Resolved',
    'Closed'
];

// ── DOM refs ────────────────────────────────────────────────
const loginSection        = document.getElementById('loginSection');
const dashboardSection    = document.getElementById('dashboardSection');
const headerRight         = document.getElementById('headerRight');
const loginForm           = document.getElementById('loginForm');
const loginError          = document.getElementById('loginError');
const adminEmailDisplay   = document.getElementById('adminEmailDisplay');
const logoutBtn           = document.getElementById('logoutBtn');
const complaintsTableBody = document.getElementById('complaintsTableBody');
const loadingRow          = document.getElementById('loadingRow');
const noDataRow           = document.getElementById('noDataRow');
const toastEl             = document.getElementById('adminToast');

// ── Toast helper ─────────────────────────────────────────────
function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className = 'admin-toast ' + type + ' show';
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3200);
}

// ── Auth state observer ───────────────────────────────────────
auth.onAuthStateChanged(user => {
    if (user) {
        loginSection.style.display     = 'none';
        dashboardSection.style.display = '';
        headerRight.style.display      = '';
        adminEmailDisplay.textContent  = user.email;
        loadComplaints();
    } else {
        loginSection.style.display     = '';
        dashboardSection.style.display = 'none';
        headerRight.style.display      = 'none';
    }
});

// ── Login ─────────────────────────────────────────────────────
loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    loginError.textContent = '';
    const email    = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const btn      = document.getElementById('loginBtn');

    btn.disabled    = true;
    btn.textContent = 'Signing in…';

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
        loginError.textContent = friendlyAuthError(err.code);
        btn.disabled    = false;
        btn.textContent = 'Sign In';
    }
});

// ── Logout ────────────────────────────────────────────────────
logoutBtn.addEventListener('click', async () => {
    await auth.signOut();
});

// ── Load complaints (exposed globally for refresh button) ─────
async function loadComplaints() {
    loadingRow.style.display = '';
    noDataRow.style.display  = 'none';

    // Remove existing data rows
    Array.from(complaintsTableBody.querySelectorAll('tr.data-row')).forEach(r => r.remove());

    try {
        const snapshot = await db.collection('complaints')
            .orderBy('createdAt', 'desc')
            .get();

        loadingRow.style.display = 'none';

        if (snapshot.empty) {
            noDataRow.style.display = '';
            return;
        }

        snapshot.forEach(doc => renderRow(doc.id, doc.data()));
    } catch (err) {
        loadingRow.style.display = 'none';
        showToast('Failed to load complaints: ' + err.message, 'error');
    }
}

// ── Render a single table row ─────────────────────────────────
function renderRow(docId, data) {
    const tr = document.createElement('tr');
    tr.className = 'data-row';

    const date = data.createdAt
        ? new Date(data.createdAt.toMillis()).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
          })
        : '—';

    const resolvedDate = data.resolvedAt
        ? new Date(data.resolvedAt.toMillis()).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
          })
        : '—';

    const updatedDate = data.updatedAt
        ? new Date(data.updatedAt.toMillis()).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
          })
        : '—';

    const statusOptions = STATUS_OPTIONS.map(s =>
        `<option value="${s}"${data.status === s ? ' selected' : ''}>${s}</option>`
    ).join('');

    tr.innerHTML = `
        <td class="col-number"><span class="complaint-tag">${escHtml(data.complaintNumber || '—')}</span></td>
        <td class="col-name">${escHtml(data.name || '—')}</td>
        <td class="col-house">${escHtml(data.houseNo || '—')}</td>
        <td class="col-complaint">${escHtml(data.complaint || '—')}</td>
        <td class="col-status">
            <select class="status-select status-${slugify(data.status)}" data-docid="${escHtml(docId)}" aria-label="Update status for complaint ${escHtml(data.complaintNumber || '')}">
                ${statusOptions}
            </select>
        </td>
        <td class="col-date">${date}</td>
        <td class="col-updated">${updatedDate}</td>
        <td class="col-resolved">${resolvedDate}</td>
    `;

    tr.querySelector('.status-select').addEventListener('change', async function () {
        const newStatus = this.value;
        const id        = this.dataset.docid;
        this.disabled   = true;

        try {
            const updateData = {
                status:    newStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            // Set resolvedAt when marked Resolved or Closed, clear it otherwise
            if (newStatus === 'Resolved' || newStatus === 'Closed') {
                updateData.resolvedAt = firebase.firestore.FieldValue.serverTimestamp();
            } else {
                updateData.resolvedAt = null;
            }

            await db.collection('complaints').doc(id).update(updateData);
            this.className = `status-select status-${slugify(newStatus)}`;

            // Update the resolved date cell in the same row
            const resolvedCell = this.closest('tr').querySelector('.col-resolved');
            if (resolvedCell) {
                resolvedCell.textContent = (newStatus === 'Resolved' || newStatus === 'Closed')
                    ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—';
            }

            showToast(`Status updated to "${newStatus}"`, 'success');
        } catch (err) {
            showToast('Update failed: ' + err.message, 'error');
        } finally {
            this.disabled = false;
        }
    });

    complaintsTableBody.insertBefore(tr, noDataRow);
}

// ── Helpers ───────────────────────────────────────────────────
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function slugify(str) {
    return (str || '').toLowerCase().replace(/\s+/g, '-');
}

function friendlyAuthError(code) {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Incorrect email or password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please wait and try again.';
        case 'auth/network-request-failed':
            return 'Network error. Check your connection.';
        default:
            return 'Sign-in failed. Please try again.';
    }
}
