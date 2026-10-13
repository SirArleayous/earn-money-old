import "dotenv/config";
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  initializeApp({ credential: raw ? cert(JSON.parse(raw)) : applicationDefault() });
}

export const verifyToken = (token) => getAuth().verifyIdToken(token);

// Removes the Firebase login of a deleted user (best effort)
export const deleteAuthUser = async (email) => {
  try {
    const u = await getAuth().getUserByEmail(email);
    await getAuth().deleteUser(u.uid);
    return true;
  } catch {
    return false;
  }
};
