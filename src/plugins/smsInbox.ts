// Thin wrapper around capacitor-sms-inbox
import { Capacitor } from "@capacitor/core";

// @ts-ignore - package may have different export patterns
let SmsInbox: any;

try {
  // Try named import first
  const { SmsInbox: NamedSmsInbox } = require("capacitor-sms-inbox");
  SmsInbox = NamedSmsInbox;
} catch {
  try {
    // Try default import
    const DefaultSmsInbox = require("capacitor-sms-inbox").default;
    SmsInbox = DefaultSmsInbox?.SmsInbox || DefaultSmsInbox;
  } catch {
    // Fallback - try direct require
    SmsInbox = require("capacitor-sms-inbox");
  }
}

export interface InboxMessage {
  body: string;
  address?: string; // sender
  date?: number; // epoch ms
}

export async function ensureSmsPermission(): Promise<boolean> {
  if (Capacitor.getPlatform() !== "android") return false;
  try {
    const perm = await SmsInbox.checkPermissions();
    if (perm?.read === "granted") return true;
    const req = await SmsInbox.requestPermissions();
    return req?.read === "granted";
  } catch (e) {
    console.warn("SMS permission check failed", e);
    return false;
  }
}

export async function readRecentMessages(days = 90, max = 1000): Promise<InboxMessage[]> {
  if (Capacitor.getPlatform() !== "android") return [];
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  try {
    // Fallback to getRawSMSList if filtering not available
    if (typeof SmsInbox.getSMSList === "function") {
      const res = await SmsInbox.getSMSList({
        max,
        startDate: since,
      });
      return (res?.messages || res || []).map((m: any) => ({ body: m.body || m.msg || "", address: m.address || m.sender, date: m.date }));
    }
    if (typeof SmsInbox.getRawSMSList === "function") {
      const res = await SmsInbox.getRawSMSList({ max });
      return (res?.messages || res || []).map((m: any) => ({ body: m.body || m.msg || "", address: m.address || m.sender, date: m.date }));
    }
  } catch (e) {
    console.warn("Reading SMS failed", e);
  }
  return [];
}
