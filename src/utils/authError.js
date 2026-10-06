const messages = {
  "auth/email-already-in-use": "This email is already registered. Try logging in.",
  "auth/weak-password": "Password is too weak.",
  "auth/invalid-email": "Invalid email address.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/user-not-found": "Invalid email or password.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/operation-not-allowed": "This sign-in method is disabled in the Firebase console.",
  "auth/unauthorized-domain": "This domain is not authorized in Firebase (Authentication > Settings).",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "Invalid Firebase API key. Check your .env.",
  "auth/invalid-api-key": "Invalid Firebase API key. Check your .env.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

export const getAuthErrorMessage = (error) =>
  messages[error?.code] || error?.message || "Something went wrong.";