// ========================================
// Firebase Backend Integration (Production-Ready Template)
// ========================================
// To enable: Replace credentials below with your Firebase project keys,
// then uncomment the import statements at the top of relevant pages.
//
// Setup steps:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project: "examace-prod"
// 3. Add a Web App; copy the config object below
// 4. Enable Authentication → Email/Password + Google sign-in
// 5. Create Firestore database (production mode)
// 6. Deploy security rules from rules/firestore.rules
// ========================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "examace-prod.firebaseapp.com",
  projectId: "examace-prod",
  storageBucket: "examace-prod.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};

// ========================================
// AUTH HELPERS
// ========================================
const ExamAceAuth = {
  // Sign up new user
  async signup(email, password, fullName, examTarget) {
    try {
      // const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      // await firebase.firestore().collection('users').doc(cred.user.uid).set({
      //   fullName, email, examTarget,
      //   plan: 'free',
      //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      //   xp: 0, level: 1, streak: 0,
      //   subjects: []
      // });
      // return { success: true, uid: cred.user.uid };
      console.log('[Demo] Signup:', { email, fullName });
      return { success: true, uid: 'demo-uid-' + Date.now() };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Sign in existing user
  async signin(email, password) {
    try {
      // const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
      // return { success: true, uid: cred.user.uid };
      console.log('[Demo] Signin:', email);
      return { success: true, uid: 'demo-uid' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Sign in with Google
  async signinWithGoogle() {
    try {
      // const provider = new firebase.auth.GoogleAuthProvider();
      // const cred = await firebase.auth().signInWithPopup(provider);
      // return { success: true, uid: cred.user.uid };
      console.log('[Demo] Google sign-in');
      return { success: true, uid: 'demo-google-uid' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Sign out
  async signout() {
    // await firebase.auth().signOut();
    sessionStorage.clear();
    return true;
  },

  // Get current user
  getCurrentUser() {
    // return firebase.auth().currentUser;
    return JSON.parse(localStorage.getItem('examAceUser') || 'null');
  },

  // Listen to auth state
  onAuthChange(callback) {
    // firebase.auth().onAuthStateChanged(callback);
    callback(this.getCurrentUser());
  }
};

// ========================================
// FIRESTORE DATA HELPERS
// ========================================
const ExamAceDB = {
  // Save quiz attempt
  async saveAttempt(uid, attempt) {
    // await firebase.firestore().collection('attempts').add({
    //   uid, ...attempt,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp()
    // });
    const attempts = JSON.parse(localStorage.getItem('examAttempts') || '[]');
    attempts.push({ ...attempt, uid, timestamp: new Date().toISOString() });
    localStorage.setItem('examAttempts', JSON.stringify(attempts));
    return true;
  },

  // Get user attempts
  async getAttempts(uid) {
    // const snap = await firebase.firestore().collection('attempts').where('uid','==',uid).orderBy('timestamp','desc').limit(50).get();
    // return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return JSON.parse(localStorage.getItem('examAttempts') || '[]');
  },

  // Update user XP and stats
  async updateUserStats(uid, deltaXP, correct, total) {
    // const userRef = firebase.firestore().collection('users').doc(uid);
    // await firebase.firestore().runTransaction(async tx => {
    //   const doc = await tx.get(userRef);
    //   const data = doc.data();
    //   const newXP = (data.xp || 0) + deltaXP;
    //   const newLevel = Math.floor(newXP / 250) + 1;
    //   tx.update(userRef, { xp: newXP, level: newLevel });
    // });
    console.log('[Demo] Updated stats:', { deltaXP, correct, total });
    return true;
  },

  // Update streak
  async updateStreak(uid) {
    // const userRef = firebase.firestore().collection('users').doc(uid);
    // const doc = await userRef.get();
    // const lastActive = doc.data().lastActive?.toDate() || new Date(0);
    // const today = new Date();
    // const diff = (today - lastActive) / (1000 * 60 * 60 * 24);
    // if (diff < 1) return; // already counted today
    // const newStreak = diff < 2 ? (doc.data().streak || 0) + 1 : 1;
    // await userRef.update({ streak: newStreak, lastActive: today });
    return true;
  },

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    // const snap = await firebase.firestore().collection('users').orderBy('xp','desc').limit(limit).get();
    // return snap.docs.map(d => d.data());
    return [
      { name: 'Fatima Sani', xp: 9874, level: 24 },
      { name: 'Chinedu Okafor', xp: 8932, level: 22 },
      { name: 'Ama Sefa', xp: 7621, level: 20 }
    ];
  }
};

// ========================================
// FIRESTORE SECURITY RULES TEMPLATE
// ========================================
// Save as firestore.rules in Firebase Console:
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//
//     // Users can only read/edit their own profile
//     match /users/{uid} {
//       allow read: if request.auth != null;
//       allow write: if request.auth.uid == uid;
//     }
//
//     // Attempts: users can only see their own; admins see all
//     match /attempts/{id} {
//       allow read: if request.auth.uid == resource.data.uid
//                   || request.auth.token.role == 'admin';
//       allow create: if request.auth.uid == request.resource.data.uid;
//     }
//
//     // Questions are public read, admin write
//     match /questions/{id} {
//       allow read: if true;
//       allow write: if request.auth.token.role == 'admin';
//     }
//
//     // Audit log: admin write only
//     match /audit/{id} {
//       allow read: if request.auth.token.role == 'admin';
//       allow write: if request.auth.token.role == 'admin';
//     }
//   }
// }

// ========================================
// USAGE EXAMPLE
// ========================================
// document.getElementById('signupForm').onsubmit = async (e) => {
//   e.preventDefault();
//   const result = await ExamAceAuth.signup(
//     document.getElementById('email').value,
//     document.getElementById('password').value,
//     document.getElementById('name').value,
//     document.getElementById('examTarget').value
//   );
//   if (result.success) window.location = 'dashboard.html';
//   else alert(result.error);
// };

window.ExamAceAuth = ExamAceAuth;
window.ExamAceDB = ExamAceDB;
