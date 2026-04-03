// src/api/calendarApi.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const loadCalendarState = async (userId) => {
  const ref = doc(db, "calendars", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data(); // здесь будет твой state.days, customBackgrounds и т.п.
};

export const saveCalendarState = async (userId, state) => {
  const ref = doc(db, "calendars", userId);
  await setDoc(ref, state, { merge: true });
};