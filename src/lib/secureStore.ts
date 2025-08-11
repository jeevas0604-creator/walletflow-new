import { Preferences } from "@capacitor/preferences";
import CryptoJS from "crypto-js";

const PIN_KEY = "wf_pin_hash";

function getKeyFromPin(pin: string) {
  // Derive a key using PBKDF2 for better security
  return CryptoJS.PBKDF2(pin, "wf_salt_v1", { keySize: 256 / 32, iterations: 1000 }).toString();
}

export async function setPin(pin: string) {
  const hash = CryptoJS.SHA256(pin).toString();
  await Preferences.set({ key: PIN_KEY, value: hash });
}

export async function hasPin() {
  const { value } = await Preferences.get({ key: PIN_KEY });
  return !!value;
}

async function getPinKey(): Promise<string | null> {
  const { value } = await Preferences.get({ key: PIN_KEY });
  if (!value) return null;
  // Use part of the hash as the key material
  return value.slice(0, 32);
}

export async function saveEncrypted<T>(key: string, data: T) {
  const pinKey = await getPinKey();
  const json = JSON.stringify(data);
  const ciphertext = pinKey ? CryptoJS.AES.encrypt(json, pinKey).toString() : json;
  await Preferences.set({ key: `wf_${key}`, value: ciphertext });
}

export async function getDecrypted<T>(key: string, fallback: T): Promise<T> {
  const { value } = await Preferences.get({ key: `wf_${key}` });
  if (!value) return fallback;
  const pinKey = await getPinKey();
  if (!pinKey) {
    try { return JSON.parse(value) as T; } catch { return fallback; }
  }
  try {
    const bytes = CryptoJS.AES.decrypt(value, pinKey);
    const json = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
