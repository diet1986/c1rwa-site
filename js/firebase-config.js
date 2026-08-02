/**
 * Firebase Configuration — C1 RWA
 *
 * Firebase config keys are intentionally public for GitHub Pages static sites.
 * Security is enforced entirely through Firestore Security Rules, not hidden config.
 *
 * ─── Firestore Security Rules to apply in Firebase Console ───────────────────
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /complaints/{complaintId} {
 *       allow read:   if true;                    // anyone can read (status tracking)
 *       allow create: if true;                    // anyone can submit a complaint
 *       allow update: if request.auth != null;    // only authenticated admin can update
 *       allow delete: if request.auth != null;    // only authenticated admin can delete
 *     }
 *   }
 * }
 *
 * ─── Admin user setup ────────────────────────────────────────────────────────
 * Create the admin account manually in:
 *   Firebase Console → Authentication → Users → Add User
 *   Email: c1rwapv@gmail.com
 * ─────────────────────────────────────────────────────────────────────────────
 */

const firebaseConfig = {
    apiKey: "AIzaSyCEUgEqJex9luISGcYkM3tBQ-9-WHZ_Rfw",
    authDomain: "c1rwa-5e7f0.firebaseapp.com",
    projectId: "c1rwa-5e7f0",
    storageBucket: "c1rwa-5e7f0.firebasestorage.app",
    messagingSenderId: "537597627270",
    appId: "1:537597627270:web:5e53fa418c24f2a2153a07",
    measurementId: "G-VYPF1CR24K"
};

firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();
