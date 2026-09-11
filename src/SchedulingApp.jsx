import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

/* ═══════════ ACTIVITIES ═══════════ */
var ACT = [
  {
    code: "NICMIN",
    label: "NIC minori",
    def: 1,
    cat: "com",
    alloc: "fix",
    ord: 0,
    pair: true,
  },
  {
    code: "NICSP",
    label: "NIC sperim.",
    def: 1,
    cat: "com",
    alloc: "fix",
    ord: 1,
    pair: true,
  },
  {
    code: "222",
    label: "222",
    def: 2,
    cat: "pc",
    alloc: "fix",
    ord: 2,
    pair: false,
  },
  {
    code: "CIECHI",
    label: "Ciechi",
    def: 1,
    cat: "com",
    alloc: "fix",
    ord: 3,
    pair: true,
  },
  {
    code: "CIC",
    label: "CIC",
    def: 2,
    cat: "com",
    alloc: "fix",
    ord: 4,
    pair: true,
  },
  {
    code: "VD",
    label: "Visite Dirette",
    def: 1,
    cat: "com",
    alloc: "fix",
    ord: 5,
    pair: true,
  },
  {
    code: "NIC",
    label: "NIC",
    def: 6,
    cat: "com",
    alloc: "fix",
    ord: 7,
    pair: true,
  },
  {
    code: "CICNOTO",
    label: "CIC Noto",
    def: 1,
    cat: "com",
    alloc: "fix",
    ord: 8,
    pair: true,
    dows: [1, 2, 3, 4],
  },
  {
    code: "CICVDSR",
    label: "CIC/VD SR",
    def: 2,
    cat: "com",
    alloc: "fix",
    ord: 9,
    pair: true,
    dows: [1, 2, 3, 4],
  },
  {
    code: "VDOM",
    label: "V. Domiciliari",
    def: 0,
    cat: "com",
    alloc: "pre",
    ord: 50,
    pair: true,
  },
  {
    code: "PU",
    label: "Prest.Universale",
    def: 0,
    cat: "pc",
    alloc: "pre",
    ord: 51,
    pair: true,
  },
  {
    code: "VALID",
    label: "ATTI",
    def: 0,
    cat: "pc",
    alloc: "dyn",
    ord: 80,
    pair: false,
  },
  {
    code: "EST",
    label: "Att.Esterna",
    def: 0,
    cat: "st",
    alloc: "no",
    ord: 99,
    pair: false,
  },
  {
    code: "SW",
    label: "Smart Working",
    def: 0,
    cat: "st",
    alloc: "no",
    ord: 99,
    pair: false,
  },
  {
    code: "FER",
    label: "Ferie",
    def: 0,
    cat: "st",
    alloc: "no",
    ord: 99,
    pair: false,
  },
];
var OPA = ACT.filter(function (a) {
  return a.cat !== "st";
});
var DISP = [
  "CIC",
  "NIC",
  "NICSP",
  "NICMIN",
  "VD",
  "222",
  "CICNOTO",
  "CICVDSR",
  "VALID",
  "PU",
  "VDOM",
  "CIECHI",
];
var OPD = DISP.map(function (c) {
  return ACT.find(function (a) {
    return a.code === c;
  });
}).filter(Boolean);
var FIX = ACT.filter(function (a) {
  return a.alloc === "fix";
}).sort(function (a, b) {
  return a.ord - b.ord;
});
var SLOTABLE = FIX;
var WDS = [
  { n: 1, l: "Lun" },
  { n: 2, l: "Mar" },
  { n: 3, l: "Mer" },
  { n: 4, l: "Gio" },
  { n: 5, l: "Ven" },
];
var COL = {
  CIC: { bg: "#fef3c7", tx: "#92400e", bd: "#fcd34d" },
  NIC: { bg: "#e0e7ff", tx: "#3730a3", bd: "#a5b4fc" },
  NICSP: { bg: "#e0f2fe", tx: "#075985", bd: "#7dd3fc" },
  NICMIN: { bg: "#ddd6fe", tx: "#6d28d9", bd: "#a78bfa" },
  VD: { bg: "#d1fae5", tx: "#065f46", bd: "#6ee7b7" },
  VDOM: { bg: "#dbeafe", tx: "#1e3a8a", bd: "#93c5fd" },
  PU: { bg: "#fef9c3", tx: "#854d0e", bd: "#fde047" },
  VALID: { bg: "#fce7f3", tx: "#9d174d", bd: "#f9a8d4" },
  222: { bg: "#ede9fe", tx: "#5b21b6", bd: "#c4b5fd" },
  CIECHI: { bg: "#ffe4e6", tx: "#9f1239", bd: "#fda4af" },
  CICNOTO: { bg: "#ffedd5", tx: "#9a3412", bd: "#fdba74" },
  CICVDSR: { bg: "#fee2e2", tx: "#991b1b", bd: "#fca5a5" },
};
var VDOM_PAIRS = [
  ["Costa Manuela", "Arcifa Veronica"],
  ["Ligreggi Antonella", "Scifo Nicole"],
  ["Liuzzo Ludovico", "Grieco Angela"],
  ["Di Paola Danila", "Iosia Serena"],
  ["Lo Pumo Roberta", "Sofia Salvatore"],
  ["Palmeri Andrea", "Tumino Mariagrazia"],
  ["Bonfiglio Claudia", "Spina Anna"],
];

/* ═══════════ USERS ═══════════ */
var DU = [
  ["Arcifa Veronica", true, "STR", false, false, [1, 2, 3, 4, 5], null, true],
  ["Alberio Anna", false, "ACN", false, false, [1, 3, 4, 5], null, false],
  ["Amato Chiara", false, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  ["Bonfiglio Claudia", true, "STR", true, true, [1, 2, 3, 4, 5], 4, false],
  [
    "Calabrese Giorgia",
    false,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  ["Caruso Danila", false, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  ["Costa Manuela", true, "STR", true, false, [1, 2, 3, 4, 5], 3, false],
  [
    "Di Guardo Caterina",
    false,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  ["Di Paola Danila", true, "STR", false, false, [1, 2, 3, 4, 5], 3, false],
  ["Grieco Angela", true, "STR", true, false, [1, 2, 3, 4, 5], 4, false],
  ["Iosia Serena", true, "STR", true, false, [1, 2, 3, 4, 5], 4, false],
  ["La Delfa Rosalba", true, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  [
    "Licciardello Gabriele",
    true,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  ["Ligreggi Antonella", true, "STR", true, false, [1, 2, 3, 4, 5], 1, false],
  ["Liuzzo Ludovico", true, "STR", true, false, [1, 2, 3, 4, 5], 4, false],
  ["Lo Pumo Roberta", true, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  ["Martines Annamaria", true, "ACN", false, false, [1, 2, 3], null, false],
  ["Marzullo Isabella", true, "STR", false, false, [1, 2, 3, 4, 5], 3, false],
  [
    "Milana Maria Chiara",
    false,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  [
    "Ministeri Federica",
    true,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  ["Monaco Lucia", true, "ACN", false, false, [3, 4, 5], null, false],
  ["Munciv\u00EC Marina", true, "ACN", false, false, [1, 2, 3, 4], null, false],
  ["Nannola Chiara", false, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  ["Palmeri Andrea", true, "STR", true, false, [1, 2, 3, 4, 5], 2, false],
  ["Pappalardo Elisa", true, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  [
    "Pittari Veronica",
    false,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  ["Prossimo Giusi", false, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  ["Russo Ilenia", true, "ACN", false, false, [2, 3, 4, 5], null, false],
  [
    "Scalisi Francesco",
    false,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  ["Scifo Nicole", false, "STR", false, false, [1, 2, 3, 4, 5], null, true],
  ["Sofia Salvatore", true, "STR", false, false, [1, 2, 3, 4, 5], null, false],
  ["Sollima Giovanni", false, "ACN", false, false, [1, 2, 4], null, false],
  ["Spina Anna", true, "STR", true, false, [1, 2, 3, 4, 5], 2, false],
  [
    "Tumino Mariagrazia",
    true,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    true,
  ],
  [
    "Valenti Giuseppe",
    false,
    "STR",
    false,
    false,
    [1, 2, 3, 4, 5],
    null,
    false,
  ],
  ["Valenti Vincenzo", true, "ACN", true, false, [1, 2, 4], null, false],
  ["Amore Greta", false, "STR", false, false, [1, 2, 3, 4, 5], null, false],
];
var MN = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

/* ═══════════ HELPERS ═══════════ */
var CPX = [
  "Di",
  "Lo",
  "La",
  "De",
  "Del",
  "Della",
  "Degli",
  "Dei",
  "Delle",
  "Dal",
];
function pS(f) {
  var p = f.trim().split(/\s+/);
  if (p.length <= 1) return { s: f, f: "" };
  if (p[0].endsWith("'") || p[0].endsWith("\u2019"))
    return { s: p.slice(0, 2).join(" "), f: p.slice(2).join(" ") };
  if (CPX.includes(p[0]) && p.length > 2)
    return { s: p.slice(0, 2).join(" "), f: p.slice(2).join(" ") };
  return { s: p[0], f: p.slice(1).join(" ") };
}
function sN(users) {
  var ps = users.map(function (u) {
    return Object.assign({ id: u.id }, pS(u.name));
  });
  var c = {};
  ps.forEach(function (p) {
    c[p.s] = (c[p.s] || 0) + 1;
  });
  var r = {};
  ps.forEach(function (p) {
    r[p.id] = c[p.s] > 1 && p.f ? p.s + " " + p.f[0] + "." : p.s;
  });
  return r;
}
function dk(y, m, d) {
  return (
    y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0")
  );
}
function nD(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function isWE(y, m, d) {
  var w = new Date(y, m, d).getDay();
  return w === 0 || w === 6;
}
function jd(y, m, d) {
  return new Date(y, m, d).getDay();
}
function dn(y, m, d) {
  return ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"][jd(y, m, d)];
}
function eMon(y) {
  var a = y % 19,
    b = Math.floor(y / 100),
    c = y % 100,
    d2 = Math.floor(b / 4),
    e = b % 4,
    f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d2 - g + 15) % 30,
    i = Math.floor(c / 4),
    k = c % 4,
    l = (32 + 2 * e + 2 * i - h - k) % 7,
    m2 = Math.floor((a + 11 * h + 22 * l) / 451),
    mo = Math.floor((h + l - 7 * m2 + 114) / 31),
    da = ((h + l - 7 * m2 + 114) % 31) + 1;
  return new Date(new Date(y, mo - 1, da).getTime() + 864e5);
}
function isH(y, m, d) {
  var mm = m + 1;
  if (mm === 1 && d === 1) return "Capodanno";
  if (mm === 1 && d === 6) return "Epifania";
  if (mm === 2 && d === 5) return "Sant'Agata";
  if (mm === 4 && d === 25) return "Liberazione";
  if (mm === 5 && d === 1) return "Festa Lavoro";
  if (mm === 6 && d === 2) return "Repubblica";
  if (mm === 8 && d === 15) return "Ferragosto";
  if (mm === 11 && d === 1) return "Ognissanti";
  if (mm === 12 && d === 8) return "Immacolata";
  if (mm === 12 && d === 25) return "Natale";
  if (mm === 12 && d === 26) return "S.Stefano";
  var em = eMon(y);
  if (em.getMonth() === m && em.getDate() === d) return "Pasquetta";
  return null;
}
function isOff(y, m, d) {
  return isWE(y, m, d) || !!isH(y, m, d);
}

function mAS(vo) {
  var s = {};
  ACT.forEach(function (a) {
    s[a.code] = vo
      ? { al: false, w: 0 }
      : { al: a.code !== "222" && a.code !== "VDOM" && a.code !== "PU", w: 1 };
  });
  return s;
}
function mU(nm, ml, ct, e2, ec, wd, sw, vo, id) {
  return {
    id: id || "u" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    name: nm,
    ml: ml,
    ct: ct,
    e222: e2,
    eCi: ec,
    wd: wd || [1, 2, 3, 4, 5],
    swDay: sw,
    vo: !!vo,
    notes: "",
    as: mAS(vo),
  };
}
function mDU() {
  var NP = ["Calabrese Giorgia", "Nannola Chiara", "Amore Greta"],
    CP = ["Licciardello Gabriele", "Russo Ilenia", "Sofia Salvatore"];
  return DU.map(function (r, i) {
    var u = mU(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], "d" + i);
    if (NP.includes(u.name)) u.as.NICMIN = { al: true, w: 3 };
    if (CP.includes(u.name)) u.as.CIECHI = { al: true, w: 3 };
    if (u.e222) u.as["222"] = { al: true, w: 1 };
    if (u.name === "Arcifa Veronica") {
      ACT.forEach(function (a) {
        u.as[a.code] =
          a.code === "VDOM" ? { al: true, w: 1 } : { al: false, w: 0 };
      });
      u.eCi = false;
    }
    return u;
  });
}
function mDS() {
  var s = {};
  ACT.forEach(function (a) {
    s[a.code] = a.def;
  });
  return s;
}

/* CML v14: pure domain functions, shared by generation and the editor. */
const VERSION = "v14";
const STORAGE_KEY = "cml-v9";
const BACKUP_KEY = "cml-v14-recovery";
const NPI_NAMES = ["Calabrese Giorgia", "Nannola Chiara", "Amore Greta"];
const PU_NAMES = ["Palmeri Andrea", "Di Paola Danila"];
const DEFAULT_OFF = new Set(["CIECHI", "CICNOTO", "CICVDSR"]);
const HEAVY = new Set(["CIC", "VD", "CICNOTO", "CICVDSR"]);
const FIXED_PAIR = new Set(["VDOM", "PU"]);
const AC = Object.fromEntries(ACT.map((a) => [a.code, a]));
const clone = (value) => JSON.parse(JSON.stringify(value));
const object = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};
const bounded = (value, fallback, min, max) =>
  Number.isFinite(Number(value))
    ? Math.max(min, Math.min(max, Math.round(Number(value))))
    : fallback;
const unique = (values) => [...new Set(values)];
const monthKey = (year, month) => year + "-" + month;
const dateLabel = (key) =>
  new Date(key + "T12:00:00").toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
const weekKey = (key) => {
  const d = new Date(key + "T12:00:00");
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dk(d.getFullYear(), d.getMonth(), d.getDate());
};
const pairKey = (pair) => pair.filter(Boolean).slice().sort().join("|");
const allIds = (day) =>
  Object.values(day || {}).flatMap((a) =>
    Array.isArray(a) ? a.filter(Boolean) : [],
  );
function seedRandom(seed) {
  let a = 2166136261;
  for (const c of String(seed)) {
    a ^= c.charCodeAt(0);
    a = Math.imul(a, 16777619);
  }
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function defaultState() {
  const users = mDU().map((u) => ({ ...u, active: true }));
  const id = (name) => users.find((u) => u.name === name)?.id;
  return {
    _v: VERSION,
    _migrations: [
      "greta-2026-09",
      "licciardello-str-2026-09",
      "licciardello-nannola-compatible-2026-09",
    ],
    users,
    gS: mDS(),
    inc: [],
    dR: { [id("Costa Manuela")]: { 2: ["CIC", "NIC", "VD"] } },
    ovA: {},
    asA: {},
    exA: {},
    swE: {},
    wdE: {},
    ntA: {},
    locks: {},
    seeds: {},
  };
}
function sanitizeState(raw) {
  if (
    !raw ||
    typeof raw !== "object" ||
    !Array.isArray(raw.users) ||
    !raw.users.length
  )
    throw new Error(
      "Questo file non contiene un archivio CML valido (manca l’elenco utenti).",
    );
  if (raw.users.length > 500)
    throw new Error("L’archivio contiene troppi utenti.");
  if (raw._v && !/^v(?:[1-9]|1[0-4])$/.test(String(raw._v)))
    throw new Error(
      "Versione dell’archivio non supportata. Usa una versione compatibile dell’app.",
    );
  const used = new Set();
  const users = raw.users.map((u) => {
    if (
      !u ||
      typeof u.id !== "string" ||
      !/^[\w-]{1,100}$/.test(u.id) ||
      ["__proto__", "constructor", "prototype"].includes(u.id) ||
      typeof u.name !== "string" ||
      !u.name.trim() ||
      used.has(u.id)
    )
      throw new Error(
        "L’archivio contiene un utente non valido o un identificativo duplicato.",
      );
    used.add(u.id);
    const base = mAS(!!u.vo),
      settings = object(u.as);
    const as = Object.fromEntries(
      ACT.map((a) => {
        const v = object(settings[a.code]);
        return [
          a.code,
          {
            al: typeof v.al === "boolean" ? v.al : base[a.code].al,
            w: bounded(v.w, base[a.code].w, 0, 3),
          },
        ];
      }),
    );
    // Old 222 flags were the only effective setting. Preserve explicit settings when present.
    if (u.e222 && !settings["222"]) as["222"] = { al: true, w: 1 };
    return {
      id: u.id,
      name: u.name.trim().slice(0, 160),
      ml: !!u.ml,
      ct: u.ct === "ACN" ? "ACN" : "STR",
      e222: !!u.e222,
      eCi: !!u.eCi,
      wd: unique(
        (Array.isArray(u.wd) ? u.wd : [1, 2, 3, 4, 5]).filter(
          (d) => Number.isInteger(d) && d >= 1 && d <= 5,
        ),
      ),
      swDay:
        Number.isInteger(u.swDay) && u.swDay >= 1 && u.swDay <= 5
          ? u.swDay
          : null,
      vo: !!u.vo,
      active: u.active !== false,
      notes: typeof u.notes === "string" ? u.notes.slice(0, 4000) : "",
      as,
    };
  });
  if (
    !raw._migrations?.includes?.("greta-2026-09") &&
    !users.some((u) => u.name.toLowerCase() === "amore greta")
  ) {
    let id = "u-amore-greta";
    while (used.has(id)) id += "-1";
    const greta = mU(
      "Amore Greta",
      false,
      "STR",
      false,
      false,
      [1, 2, 3, 4, 5],
      null,
      false,
      id,
    );
    greta.as.NICMIN = { al: true, w: 3 };
    greta.active = true;
    users.push(greta);
    used.add(id);
  }
  if (!raw._migrations?.includes?.("licciardello-str-2026-09")) {
    for (const user of users) {
      const name = user.name.toLowerCase().replace(/\s+/g, " ");
      if (["licciardello gabriele", "gabriele licciardello"].includes(name))
        user.ct = "STR";
    }
  }
  const gS = Object.fromEntries(
    ACT.map((a) => [a.code, bounded(object(raw.gS)[a.code], a.def, 0, 20)]),
  );
  const removeOldConflict = !raw._migrations?.includes?.(
    "licciardello-nannola-compatible-2026-09",
  );
  const idsForNames = (names) => new Set(
    users
      .filter(u => names.includes(u.name.toLowerCase().replace(/\s+/g, " ")))
      .map(u => u.id),
  );
  const gabrieleIds = idsForNames(["licciardello gabriele", "gabriele licciardello"]);
  const nannolaIds = idsForNames(["nannola chiara", "chiara nannola"]);
  const inc = unique(
    (Array.isArray(raw.inc) ? raw.inc : [])
      .filter(
        (p) =>
          Array.isArray(p) &&
          p.length === 2 &&
          p[0] !== p[1] &&
          p.every((id) => used.has(id)),
      )
      .map(pairKey),
  )
    .map((s) => s.split("|"))
    .filter(p => !removeOldConflict || !(
      (gabrieleIds.has(p[0]) && nannolaIds.has(p[1])) ||
      (nannolaIds.has(p[0]) && gabrieleIds.has(p[1]))
    ));
  const dR = {};
  for (const [id, days] of Object.entries(object(raw.dR)))
    if (used.has(id)) {
      for (const [dow, codes] of Object.entries(object(days)))
        if (/^[1-5]$/.test(dow) && Array.isArray(codes)) {
          const list = unique(codes.filter((c) => DISP.includes(c)));
          if (list.length) (dR[id] ||= {})[dow] = list;
        }
    }
  const out = {
    _v: VERSION,
    _migrations: [
      "greta-2026-09",
      "licciardello-str-2026-09",
      "licciardello-nannola-compatible-2026-09",
    ],
    users,
    gS,
    inc,
    dR,
    ovA: {},
    asA: {},
    exA: {},
    swE: {},
    wdE: {},
    ntA: {},
    locks: {},
    seeds: {},
  };
  for (const field of ["ovA", "asA", "exA", "swE", "wdE", "locks"]) {
    for (const [mk, days] of Object.entries(object(raw[field]))) {
      if (!/^\d{4}-(?:[0-9]|1[01])$/.test(mk))
        throw new Error("Mese non valido nell’archivio.");
      const [y, m] = mk.split("-").map(Number);
      out[field][mk] = {};
      for (const [key, values] of Object.entries(object(days))) {
        const d = Number(key.slice(-2));
        if (key !== dk(y, m, d) || d < 1 || d > nD(y, m))
          throw new Error("Data non valida nell’archivio: " + key);
        const day = {};
        for (const [id, value] of Object.entries(object(values))) {
          if (field === "asA") {
            if (
              !DISP.includes(id) ||
              !Array.isArray(value) ||
              value.length > 1000
            )
              throw new Error("Assegnazioni non valide per " + key + ".");
            if (value.some((uid) => uid !== null && !used.has(uid)))
              throw new Error(
                "Il planning contiene riferimenti a utenti mancanti. Importazione annullata per non perdere dati.",
              );
            day[id] = AC[id].pair ? value.slice() : value.filter(Boolean);
          } else if (field === "ovA" && DISP.includes(id)) {
            const v = object(value),
              o = {};
            if (typeof v.enabled === "boolean") o.enabled = v.enabled;
            if (Number.isFinite(v.slots)) o.slots = bounded(v.slots, 0, 0, 20);
            if (["CIECHI", "CIC"].includes(id) && Array.isArray(v.presidents))
              o.presidents = unique(
                v.presidents.filter((uid) => used.has(uid)),
              );
            if (id === "CIECHI" && typeof v.allowMlPair === "boolean")
              o.allowMlPair = v.allowMlPair;
            day[id] = o;
          } else if (field === "locks" && DISP.includes(id) && value === true)
            day[id] = true;
          else if (used.has(id)) {
            if (field === "exA" && Array.isArray(value)) {
              const v = unique(value.filter((c) => c === "FER" || c === "EST"));
              if (v.length) day[id] = v;
            }
            if (field === "swE" && ["SW", "NO"].includes(value))
              day[id] = value;
            if (field === "wdE" && ["ON", "OFF"].includes(value))
              day[id] = value;
          }
        }
        out[field][mk][key] = day;
      }
    }
  }
  for (const field of ["ntA", "seeds"])
    for (const [mk, value] of Object.entries(object(raw[field])))
      if (/^\d{4}-(?:[0-9]|1[01])$/.test(mk) && typeof value === "string")
        out[field][mk] = value.slice(0, field === "ntA" ? 20000 : 100);
  return out;
}
function availability(state, year, month) {
  const mk = monthKey(year, month),
    map = {};
  for (let d = 1; d <= nD(year, month); d++) {
    const key = dk(year, month, d),
      dow = jd(year, month, d);
    map[key] = {};
    for (const u of state.users) {
      let reason = null;
      if (u.active === false) reason = ["INATTIVO"];
      else if (isOff(year, month, d)) reason = ["CHIUSO"];
      else {
        const ex = state.exA[mk]?.[key]?.[u.id],
          work = state.wdE[mk]?.[key]?.[u.id],
          sw = state.swE[mk]?.[key]?.[u.id];
        const works = work === "ON" || (work !== "OFF" && u.wd.includes(dow));
        if (ex?.length) reason = ex;
        else if (!works) reason = ["N/D"];
        else if (sw === "SW" || (sw !== "NO" && u.swDay === dow))
          reason = ["SW"];
      }
      if (reason) map[key][u.id] = reason;
    }
  }
  return map;
}
function createContext(state, year, month) {
  const mk = monthKey(year, month),
    byId = Object.fromEntries(state.users.map((u) => [u.id, u]));
  const resolve = (names) =>
    names.map((n) => state.users.find((u) => u.name === n)?.id);
  const vdom = VDOM_PAIRS.map(resolve).filter((p) => p.every(Boolean)),
    pu = resolve(PU_NAMES);
  const days = Array.from({ length: nD(year, month) }, (_, i) =>
    dk(year, month, i + 1),
  );
  return {
    state,
    year,
    month,
    mk,
    byId,
    vdom,
    pu: pu.every(Boolean) ? pu : [],
    days,
    workDays: days.filter((k) => !isOff(year, month, Number(k.slice(-2)))),
    ind: availability(state, year, month),
    overrides: state.ovA[mk] || {},
    locks: state.locks[mk] || {},
  };
}
function isEnabled(ctx, key, code) {
  const a = AC[code],
    dow = new Date(key + "T12:00:00").getDay();
  if (
    !a ||
    !ctx.workDays.includes(key) ||
    (a.dows && !a.dows.includes(dow)) ||
    (code === "VDOM" && dow === 5)
  )
    return false;
  return ctx.overrides[key]?.[code]?.enabled ?? !DEFAULT_OFF.has(code);
}
function capacity(ctx, key, code) {
  return (
    ctx.overrides[key]?.[code]?.slots ??
    ctx.state.gS[code] ??
    AC[code]?.def ??
    0
  );
}
function presidents(ctx, key) {
  return (
    ctx.overrides[key]?.CIECHI?.presidents ??
    ctx.state.users.filter((u) => u.eCi).map((u) => u.id)
  );
}
function cicExceptions(ctx, key) {
  return ctx.overrides[key]?.CIC?.presidents || [];
}
function incompatible(ctx, a, b) {
  return ctx.state.inc.some((p) => p.includes(a) && p.includes(b));
}
function eligibilityReason(ctx, key, code, uid) {
  const u = ctx.byId[uid];
  if (!u) return "Operatore non presente in anagrafica";
  if (ctx.ind[key]?.[uid]) return ctx.ind[key][uid].join(", ");
  if (!isEnabled(ctx, key, code))
    return "Attività non attiva in questa giornata";
  if (u.vo && code !== "VDOM") return "Abilitato solo alle domiciliari";
  if (code === "VDOM") {
    if (!ctx.vdom.some((p) => p.includes(uid)))
      return "Non appartiene a una coppia domiciliare";
  } else if (code === "PU") {
    if (!ctx.pu.includes(uid)) return "Non appartiene alla coppia PU";
  } else {
    if (!u.as[code]?.al) return "Attività non abilitata";
    if (u.as[code].w === 0) return "Peso 0: non assegnare";
  }
  if (code === "222" && !u.e222) return "Manca l’abilitazione 222";
  if (code === "NICMIN" && !u.ml && !NPI_NAMES.includes(u.name))
    return "NIC minori richiede ML e neuropsichiatra abilitata";
  const allowed =
    ctx.state.dR[uid]?.[String(new Date(key + "T12:00:00").getDay())];
  if (allowed?.length && !allowed.includes(code))
    return "Restrizione giorno: " + allowed.join(", ");
  return "";
}
function compositionReason(ctx, key, code, pair) {
  const [a, b] = pair.map((id) => ctx.byId[id]);
  if (pair[0] && pair[0] === pair[1])
    return "Una persona non può occupare entrambi i posti";
  if (code === "VDOM" || code === "PU") {
    const list = code === "VDOM" ? ctx.vdom : [ctx.pu];
    if (
      !a ||
      !b ||
      !list.some((p) => p.length === 2 && pairKey(p) === pairKey(pair))
    )
      return "La coppia fissa deve essere presente per intero";
  } else if (code === "NICMIN") {
    if (a && !a.ml) return "Il primo posto richiede un medico legale";
    if (b && (!NPI_NAMES.includes(b.name) || b.ml))
      return "Il secondo posto richiede una NPI: Nannola, Calabrese o Amore";
  } else if (code === "CICNOTO") {
    if (a && !a.ml)
      return "Il primo posto della commissione Noto richiede un medico legale";
  } else if (code === "CIC") {
    const exception = a && !a.ml && cicExceptions(ctx, key).includes(a.id);
    if (a && !a.ml && !exception)
      return "Presidente CIC non-ML: serve una deroga nominativa per questa giornata";
    if (a && b && !exception && a.ml === b.ml)
      return "La coppia CIC ordinaria richiede ML + non-ML";
  } else if (code === "CIECHI") {
    if (a && !presidents(ctx, key).includes(a.id))
      return "Il presidente non è abilitato per questa giornata";
    if (
      a &&
      b &&
      a.ml === b.ml &&
      !(a.ml && ctx.overrides[key]?.CIECHI?.allowMlPair)
    )
      return "Ciechi richiede ML + non-ML, oppure la deroga ML + ML per questa giornata";
  } else {
    if (a && b && a.ml === b.ml) return "La coppia richiede un ML e un non-ML";
  }
  return "";
}
function emptyDay() {
  return Object.fromEntries(DISP.map((c) => [c, []]));
}
function activePairs(arr) {
  let n = 0;
  for (let i = 0; i < arr.length; i += 2) if (arr[i] && arr[i + 1]) n++;
  return n;
}
function shortageReason(ctx, key, code, day) {
  const used = new Set(allIds(day));
  const pool = ctx.state.users.filter(
    (u) =>
      !used.has(u.id) &&
      !eligibilityReason(ctx, key, code, u.id) &&
      ![...used].some((id) => incompatible(ctx, id, u.id)),
  );
  if (code === "NICMIN" && !pool.some((u) => NPI_NAMES.includes(u.name)))
    return "Neuropsichiatra non disponibile o già impegnata";
  if (
    code === "CIECHI" &&
    !pool.some((u) => presidents(ctx, key).includes(u.id))
  )
    return "Presidente abilitato non disponibile o già impegnato";
  if (code === "222") return "Operatori abilitati disponibili insufficienti";
  const ml = pool.filter((u) => u.ml).length,
    non = pool.length - ml;
  return (
    "Restano " +
    ml +
    " ML e " +
    non +
    " non-ML utilizzabili; verificare ruoli, disponibilità e vincoli"
  );
}
function validateDay(ctx, key, rawDay) {
  const day = rawDay || {},
    issues = [],
    seen = new Map();
  const add = (severity, kind, code, message, uid = "") =>
    issues.push({
      severity,
      kind,
      code,
      message,
      uid,
      key: [kind, code, uid, message].join("/"),
    });
  for (const code of DISP) {
    const arr = Array.isArray(day[code]) ? day[code] : [];
    arr.forEach((uid) => {
      if (!uid) return;
      const reason = eligibilityReason(ctx, key, code, uid);
      if (reason)
        add(
          "error",
          "eligibility",
          code,
          (ctx.byId[uid]?.name || uid) + ": " + reason,
          uid,
        );
      if (seen.has(uid))
        add(
          "error",
          "duplicate",
          code,
          (ctx.byId[uid]?.name || uid) + " compare anche in " + seen.get(uid),
          uid,
        );
      seen.set(uid, code);
    });
    if (AC[code].pair)
      for (let i = 0; i < arr.length; i += 2) {
        if (!arr[i] && !arr[i + 1]) continue;
        const reason = compositionReason(ctx, key, code, arr.slice(i, i + 2));
        if (reason)
          add(
            "error",
            "composition",
            code,
            "Coppia " + (i / 2 + 1) + ": " + reason,
          );
        else if (!arr[i] || !arr[i + 1])
          add(
            "warn",
            "hole",
            code,
            "Coppia " + (i / 2 + 1) + ": manca un componente",
          );
      }
    if (AC[code].alloc === "fix" && isEnabled(ctx, key, code)) {
      const count = AC[code].pair
          ? activePairs(arr)
          : arr.filter(Boolean).length,
        target = capacity(ctx, key, code);
      if (count < target)
        add(
          "warn",
          "shortage",
          code,
          count +
            "/" +
            target +
            (AC[code].pair ? " coppie. " : " operatori. ") +
            shortageReason(ctx, key, code, day),
        );
      if (count > target)
        add(
          "error",
          "capacity",
          code,
          "Superato il numero di slot: " + count + "/" + target,
        );
    }
  }
  for (const pair of ctx.state.inc)
    if (pair.every((id) => seen.has(id)))
      add(
        "error",
        "incompatibility",
        "",
        pair.map((id) => ctx.byId[id]?.name).join(" e ") +
          ": incompatibili nella stessa giornata",
        pairKey(pair),
      );
  const unplaced = ctx.state.users.filter(
    (u) =>
      !u.vo && u.active !== false && !ctx.ind[key]?.[u.id] && !seen.has(u.id),
  );
  return {
    issues,
    unplaced,
    assigned: seen.size,
    errors: issues.filter((i) => i.severity === "error"),
    warnings: issues.filter((i) => i.severity === "warn"),
  };
}
function residualReason(ctx, key, u, day) {
  const conflicts = unique(allIds(day)).filter((id) =>
    incompatible(ctx, id, u.id),
  );
  if (conflicts.length)
    return (
      "Incompatibilità in giornata con " +
      conflicts.map((id) => ctx.byId[id]?.name).join(", ")
    );
  const r = eligibilityReason(ctx, key, "VALID", u.id);
  return (
    r || "Disponibile: può essere assegnato ad ATTI o a un posto compatibile"
  );
}
function cleanAvailability(ctx, month) {
  const next = clone(month || {});
  for (const [key, day] of Object.entries(next))
    for (const code of DISP) {
      const arr = day[code];
      if (!Array.isArray(arr)) continue;
      const bad = (id) => id && (!ctx.byId[id] || ctx.ind[key]?.[id]);
      if (FIXED_PAIR.has(code)) {
        const v = [];
        for (let i = 0; i < arr.length; i += 2)
          if (arr[i] && arr[i + 1] && !bad(arr[i]) && !bad(arr[i + 1]))
            v.push(arr[i], arr[i + 1]);
        day[code] = v;
      } else
        day[code] = AC[code].pair
          ? arr.map((id) => (bad(id) ? null : id))
          : arr.filter((id) => id && !bad(id));
    }
  return next;
}
function cleanExisting(ctx, key, raw, lockedFirst = true) {
  const day = emptyDay(),
    used = new Set();
  const order = DISP.slice().sort(
    (a, b) => Number(!!ctx.locks[key]?.[b]) - Number(!!ctx.locks[key]?.[a]),
  );
  for (const code of order) {
    const arr = raw?.[code] || [];
    if (!isEnabled(ctx, key, code)) continue;
    const can = (uid) =>
      uid &&
      !used.has(uid) &&
      !eligibilityReason(ctx, key, code, uid) &&
      ![...used].some((id) => incompatible(ctx, id, uid));
    const limit =
      AC[code].alloc === "fix"
        ? capacity(ctx, key, code) * (AC[code].pair ? 2 : 1)
        : Infinity;
    if (FIXED_PAIR.has(code)) {
      for (let i = 0; i < arr.length; i += 2)
        if (
          can(arr[i]) &&
          can(arr[i + 1]) &&
          !incompatible(ctx, arr[i], arr[i + 1]) &&
          !compositionReason(ctx, key, code, arr.slice(i, i + 2))
        ) {
          day[code].push(arr[i], arr[i + 1]);
          used.add(arr[i]);
          used.add(arr[i + 1]);
        }
    } else if (AC[code].pair) {
      for (let i = 0; i < Math.min(arr.length, limit); i += 2) {
        let pair = [
          can(arr[i]) ? arr[i] : null,
          can(arr[i + 1]) ? arr[i + 1] : null,
        ];
        if (pair[0] && pair[1] && incompatible(ctx, pair[0], pair[1]))
          pair[1] = null;
        if (compositionReason(ctx, key, code, pair)) {
          if (!compositionReason(ctx, key, code, [pair[0], null]))
            pair[1] = null;
          else if (!compositionReason(ctx, key, code, [null, pair[1]]))
            pair[0] = null;
          else pair = [null, null];
        }
        day[code].push(...pair);
        pair.filter(Boolean).forEach((id) => used.add(id));
      }
    } else
      for (const uid of arr)
        if (day[code].length < limit && can(uid)) {
          day[code].push(uid);
          used.add(uid);
        }
  }
  return day;
}
function removeUid(day, uid, keepCode = "", keepIndex = -1) {
  // Process a fixed pair together: removing its first duplicate may shift
  // the retained pair, so a second pass must not reuse the former index.
  const ids = Array.isArray(uid) ? uid : [uid];
  for (const code of DISP) {
    const arr = day[code] || [];
    if (FIXED_PAIR.has(code)) {
      const v = [];
      for (let i = 0; i < arr.length; i += 2) {
        const remove =
          [arr[i], arr[i + 1]].some((id) => ids.includes(id)) &&
          !(code === keepCode && Math.floor(keepIndex / 2) === i / 2);
        if (!remove) v.push(arr[i] ?? null, arr[i + 1] ?? null);
      }
      day[code] = v;
    } else if (AC[code].pair)
      day[code] = arr.map((id, i) =>
        ids.includes(id) && !(code === keepCode && i === keepIndex) ? null : id,
      );
    else
      day[code] = arr.filter(
        (id, i) => !ids.includes(id) || (code === keepCode && i === keepIndex),
      );
  }
}
function applyManual(ctx, month, operation) {
  const next = clone(month || {}),
    keys = unique([operation.key, operation.source?.key].filter(Boolean));
  keys.forEach((k) => (next[k] ||= emptyDay()));
  const day = next[operation.key],
    code = operation.code,
    a = AC[code];
  if (!a || !isEnabled(ctx, operation.key, code))
    throw new Error("Questa attività non è attiva nel giorno scelto.");
  const checkPlacement = (key, code, ids) => {
    for (const uid of ids.filter(Boolean)) {
      const reason = eligibilityReason(ctx, key, code, uid);
      if (reason) throw new Error((ctx.byId[uid]?.name || uid) + ": " + reason);
    }
  };
  if (operation.type === "set" && operation.uid)
    checkPlacement(operation.key, code, [operation.uid]);
  if (operation.type === "pair" && operation.pair)
    checkPlacement(operation.key, code, operation.pair);
  if (operation.type === "pair") {
    const at = operation.index,
      pair = operation.pair;
    if (!FIXED_PAIR.has(code)) throw new Error("Operazione non valida.");
    const old = day[code] || [];
    if (pair) {
      const groups = [];
      for (let i = 0; i < old.length; i += 2)
        if (i === at) groups.push(pair.slice());
        else if (!old.slice(i, i + 2).some((id) => pair.includes(id)))
          groups.push(old.slice(i, i + 2));
      if (at >= old.length) groups.push(pair.slice());
      day[code] = groups.flat();
      const newAt = day[code].findIndex((id) => id === pair[0]);
      removeUid(day, pair, code, newAt);
    } else old.splice(at, 2);
  } else if (operation.type === "set") {
    const uid = operation.uid,
      at = operation.index;
    if (FIXED_PAIR.has(code)) throw new Error("Modifica l’intera coppia.");
    const arr = day[code] || [];
    if (a.pair) {
      while (arr.length <= at) arr.push(null);
      arr[at] = uid || null;
    } else if (uid) {
      if (at < arr.length) arr[at] = uid;
      else arr.push(uid);
    } else arr.splice(at, 1);
    day[code] = arr;
    if (uid) removeUid(day, uid, code, at);
  } else if (operation.type === "move") {
    const src = operation.source,
      sourceDay = next[src.key],
      srcArray = sourceDay[src.code] || [],
      tgtArray = day[code] || [],
      from = src.index,
      to = operation.index;
    if (src.key === operation.key && src.code === code && from === to)
      return next;
    if (FIXED_PAIR.has(src.code) || FIXED_PAIR.has(code)) {
      if (src.code !== code)
        throw new Error(
          "Le coppie fisse si spostano intere nella stessa attività.",
        );
      const s = Math.floor(from / 2) * 2,
        t = Math.floor(to / 2) * 2,
        p = srcArray.slice(s, s + 2),
        q = tgtArray.slice(t, t + 2);
      if (p.length !== 2 || p.some((x) => !x))
        throw new Error("La coppia di partenza è incompleta.");
      checkPlacement(operation.key, code, p);
      if (q.length === 2) checkPlacement(src.key, src.code, q);
      if (src.key === operation.key) {
        if (s === t) return next;
        if (q.length === 2) {
          srcArray.splice(s, 2, ...q);
          srcArray.splice(t, 2, ...p);
        } else {
          srcArray.splice(s, 2);
          srcArray.push(...p);
        }
      } else {
        if (q.length === 2 && q.every(Boolean)) {
          srcArray.splice(s, 2, ...q);
          tgtArray.splice(t, 2, ...p);
        } else {
          srcArray.splice(s, 2);
          tgtArray.push(...p);
        }
        sourceDay[src.code] = srcArray;
        day[code] = tgtArray;
        removeUid(day, p, code, q.length === 2 ? t : tgtArray.length - 2);
        if (q.length === 2) removeUid(sourceDay, q, src.code, s);
      }
    } else {
      const uid = srcArray[from];
      if (!uid) throw new Error("L’assegnazione di partenza è cambiata.");
      checkPlacement(operation.key, code, [uid]);
      if (tgtArray[to]) checkPlacement(src.key, src.code, [tgtArray[to]]);
      if (src.key === operation.key && src.code === code) {
        const other = srcArray[to] || null;
        if (a.pair) {
          while (srcArray.length <= to) srcArray.push(null);
          srcArray[to] = uid;
          srcArray[from] = other;
        } else {
          if (to < srcArray.length)
            [srcArray[from], srcArray[to]] = [srcArray[to], srcArray[from]];
          else {
            srcArray.splice(from, 1);
            srcArray.push(uid);
          }
        }
      } else {
        const other = tgtArray[to] || null;
        if (AC[src.code].pair) srcArray[from] = other;
        else if (other) srcArray[from] = other;
        else srcArray.splice(from, 1);
        if (a.pair) {
          while (tgtArray.length <= to) tgtArray.push(null);
          tgtArray[to] = uid;
        } else if (to < tgtArray.length) tgtArray[to] = uid;
        else tgtArray.push(uid);
        sourceDay[src.code] = srcArray;
        day[code] = tgtArray;
        removeUid(day, uid, code, to);
        if (other) removeUid(sourceDay, other, src.code, from);
      }
    }
    sourceDay[src.code] = sourceDay[src.code] || srcArray;
    day[code] = day[code] || tgtArray;
  }
  for (const key of keys) {
    const old = new Set(
      validateDay(ctx, key, month?.[key]).errors.map((i) => i.key),
    );
    const added = validateDay(ctx, key, next[key]).errors.filter(
      (i) => !old.has(i.key),
    );
    if (added.length) throw new Error(added[0].message);
  }
  if (
    a.pair &&
    (operation.uid || operation.pair || operation.type === "move")
  ) {
    const i = Math.floor(operation.index / 2) * 2,
      pair = (next[operation.key][code] || []).slice(i, i + 2);
    if (pair.some(Boolean)) {
      const reason = compositionReason(ctx, operation.key, code, pair);
      if (reason) throw new Error(reason);
    }
  }
  return next;
}
function historyStats(ctx, month) {
  const stats = Object.fromEntries(
    ctx.state.users.map((u) => [
      u.id,
      {
        by: {},
        weeks: {},
        heavy: 0,
        lastHeavy: "",
        lastCode: {},
        partners: {},
      },
    ]),
  );
  for (const key of Object.keys(month || {}).sort())
    recordStats(stats, key, month[key]);
  return stats;
}
function recordStats(stats, key, day) {
  for (const code of DISP)
    (day[code] || []).forEach((id, index) => {
      const s = stats[id];
      if (!s) return;
      s.by[code] = (s.by[code] || 0) + 1;
      const w = (s.weeks[weekKey(key)] ||= { by: {}, heavy: 0 });
      w.by[code] = (w.by[code] || 0) + 1;
      s.lastCode[code] = key;
      if (HEAVY.has(code)) {
        s.heavy++;
        w.heavy++;
        s.lastHeavy = key;
      }
      if (AC[code].pair) {
        const partner = day[code][index % 2 ? index - 1 : index + 1];
        if (partner) s.partners[partner] = (s.partners[partner] || 0) + 1;
      }
    });
}
function opportunityMap(ctx) {
  return Object.fromEntries(
    ctx.state.users.map((u) => [
      u.id,
      Object.fromEntries(
        DISP.map((code) => [
          code,
          Math.max(
            1,
            ctx.workDays.filter((k) => !eligibilityReason(ctx, k, code, u.id))
              .length,
          ),
        ]),
      ),
    ]),
  );
}
function candidateCost(ctx, key, code, id, stats, opportunities, rng) {
  const u = ctx.byId[id],
    s = stats[id],
    w = s.weeks[weekKey(key)] || { by: {}, heavy: 0 };
  const scale = ctx.workDays.length / opportunities[id][code];
  const previous = ctx.workDays[ctx.workDays.indexOf(key) - 1];
  let score = (s.by[code] || 0) * scale * 24 + (w.by[code] || 0) * 45;
  if (HEAVY.has(code))
    score +=
      s.heavy * scale * 20 +
      w.heavy * 90 +
      (s.lastHeavy === previous ? 110 : 0);
  else if (code === "NIC" || code === "NICSP")
    score += ((s.by.NIC || 0) + (s.by.NICSP || 0)) * scale * 8;
  if (s.lastCode[code] === previous) score += HEAVY.has(code) ? 55 : 12;
  score -= ((u.as[code]?.w ?? 1) - 1) * 7;
  if (code === "NICSP" && u.ml && u.ct === "STR") score -= 4;
  return score + rng() * 18;
}
function fillDay(ctx, key, base, stats, opportunities, rng) {
  const day = clone(base),
    used = new Set(allIds(day));
  const eligible = (id, code) =>
    !used.has(id) &&
    !eligibilityReason(ctx, key, code, id) &&
    ![...used].some((other) => incompatible(ctx, id, other));
  const assign = (code, pair, index) => {
    pair.forEach((id) => used.add(id));
    if (index === undefined) day[code].push(...pair);
    else
      pair.forEach((id, i) => {
        day[code][index + i] = id;
      });
  };
  for (const a of FIX) {
    const code = a.code;
    if (ctx.locks[key]?.[code] || !isEnabled(ctx, key, code)) continue;
    const target = capacity(ctx, key, code);
    day[code] ||= [];
    if (!a.pair) {
      while (day[code].filter(Boolean).length < target) {
        const list = ctx.state.users
          .filter((u) => eligible(u.id, code))
          .map((u) => ({
            id: u.id,
            cost: candidateCost(
              ctx,
              key,
              code,
              u.id,
              stats,
              opportunities,
              rng,
            ),
          }))
          .sort((a, b) => a.cost - b.cost);
        if (!list.length) break;
        assign(code, [list[0].id]);
      }
      continue;
    }
    while (day[code].length < target * 2) day[code].push(null);
    for (let at = 0; at < target * 2; at += 2) {
      const current = [day[code][at] || null, day[code][at + 1] || null];
      if (current.every(Boolean)) continue;
      const pool = ctx.state.users
        .filter((u) => eligible(u.id, code))
        .map((u) => u.id);
      const first = current[0] ? [current[0]] : pool,
        second = current[1] ? [current[1]] : pool;
      let best = null,
        bestCost = Infinity;
      const costs = Object.fromEntries(
        pool.map((id) => [
          id,
          candidateCost(ctx, key, code, id, stats, opportunities, rng),
        ]),
      );
      for (const aId of first)
        for (const bId of second) {
          if (
            aId === bId ||
            incompatible(ctx, aId, bId) ||
            compositionReason(ctx, key, code, [aId, bId])
          )
            continue;
          let cost =
            (costs[aId] || 0) +
            (costs[bId] || 0) +
            (stats[aId]?.partners[bId] || 0) * 7;
          // Three NPI now participate. Monthly/weekly counts lead; the seed breaks ties.
          if (cost < bestCost) {
            best = [aId, bId];
            bestCost = cost;
          }
        }
      if (best) assign(code, best, at);
    }
  }
  // A final assignment never bypasses eligibility or whole-day incompatibility.
  if (!ctx.locks[key]?.VALID) {
    const pool = ctx.state.users
      .filter((u) => eligible(u.id, "VALID"))
      .map((u) => ({ id: u.id, rank: rng() }))
      .sort((a, b) => a.rank - b.rank);
    for (const p of pool) if (eligible(p.id, "VALID")) assign("VALID", [p.id]);
  }
  return day;
}
function preschedule(ctx, current, rng) {
  const pre = Object.fromEntries(ctx.workDays.map((k) => [k, emptyDay()]));
  // Reserve every locked cell before selecting any other assignment.
  for (const key of ctx.workDays)
    for (const code of DISP)
      if (ctx.locks[key]?.[code])
        pre[key][code] = (current?.[key]?.[code] || []).slice();
  const fits = (key, code, pair) =>
    !ctx.locks[key]?.[code] &&
    pair.every(
      (id) =>
        !eligibilityReason(ctx, key, code, id) &&
        !allIds(pre[key]).includes(id),
    ) &&
    !incompatible(ctx, pair[0], pair[1]) &&
    !pair.some((id) =>
      allIds(pre[key]).some((other) => incompatible(ctx, id, other)),
    );
  const existing = (code, pair) =>
    ctx.workDays.filter((key) => {
      const arr = pre[key][code];
      for (let i = 0; i < arr.length; i += 2)
        if (pairKey(arr.slice(i, i + 2)) === pairKey(pair)) return true;
      return false;
    });
  const ordered = ctx.vdom
    .map((pair, index) => ({
      pair,
      index,
      days: ctx.workDays.filter((key) => fits(key, "VDOM", pair)).length,
    }))
    .sort((a, b) => a.days - b.days);
  ordered.forEach(({ pair, index }) => {
    if (existing("VDOM", pair).length) return;
    const options = ctx.workDays
      .filter((key) => fits(key, "VDOM", pair))
      .map((key) => ({
        key,
        score:
          (pre[key].VDOM.length ? 100 : 0) +
          Math.abs(
            ctx.workDays.indexOf(key) -
              ((index + 0.5) * ctx.workDays.length) / ctx.vdom.length,
          ) +
          rng() * 3,
      }))
      .sort((a, b) => a.score - b.score);
    if (options.length) pre[options[0].key].VDOM.push(...pair);
  });
  if (ctx.pu.length === 2) {
    for (let pass = 0; pass < 2; pass++) {
      const assigned = existing("PU", ctx.pu);
      if (assigned.length >= 2) break;
      const target =
        ctx.workDays.length * (assigned.length === 0 ? 0.25 : 0.75);
      const options = ctx.workDays
        .filter((key) => !assigned.includes(key) && fits(key, "PU", ctx.pu))
        .map((key) => ({
          key,
          score: Math.abs(ctx.workDays.indexOf(key) - target) + rng() * 3,
        }))
        .sort((a, b) => a.score - b.score);
      if (options.length) pre[options[0].key].PU.push(...ctx.pu);
    }
  }
  return pre;
}
function monthScore(ctx, month, opportunities) {
  let quotaDeficit = 0;
  for (const pair of ctx.vdom) {
    let n = 0;
    for (const k of ctx.workDays)
      for (let i = 0; i < (month[k].VDOM || []).length; i += 2)
        if (pairKey(month[k].VDOM.slice(i, i + 2)) === pairKey(pair)) n++;
    quotaDeficit += Math.max(0, 1 - n);
  }
  if (ctx.pu.length === 2) {
    let n = 0;
    for (const k of ctx.workDays)
      for (let i = 0; i < (month[k].PU || []).length; i += 2)
        if (pairKey(month[k].PU.slice(i, i + 2)) === pairKey(ctx.pu)) n++;
    quotaDeficit += Math.max(0, 2 - n);
  }
  const deficit = FIX.map((a) =>
    ctx.workDays.reduce(
      (sum, k) =>
        sum +
        (isEnabled(ctx, k, a.code)
          ? Math.max(
              0,
              capacity(ctx, k, a.code) -
                (a.pair
                  ? activePairs(month[k][a.code])
                  : month[k][a.code].filter(Boolean).length),
            )
          : 0),
      0,
    ),
  );
  let unplaced = 0;
  for (const k of ctx.workDays) {
    const used = new Set(allIds(month[k]));
    unplaced += ctx.state.users.filter(
      (u) =>
        !u.vo && u.active !== false && !ctx.ind[k][u.id] && !used.has(u.id),
    ).length;
  }
  const stats = historyStats(ctx, month);
  let balance = 0;
  for (const u of ctx.state.users) {
    const s = stats[u.id];
    if (u.vo) continue;
    const heavyOpp = Math.max(opportunities[u.id].CIC, opportunities[u.id].VD);
    balance += ((s.heavy * s.heavy) / Math.max(1, heavyOpp)) * 80;
    for (const w of Object.values(s.weeks)) balance += w.heavy * w.heavy * 30;
    for (const code of ["CIC", "VD", "NIC", "NICSP"])
      balance +=
        ((s.by[code] || 0) ** 2 / opportunities[u.id][code]) *
        (HEAVY.has(code) ? 50 : 10);
  }
  for (const u of ctx.state.users)
    for (let i = 1; i < ctx.workDays.length; i++) {
      const heavy = (k) =>
        [...HEAVY].some((c) => month[k]?.[c]?.includes(u.id));
      if (heavy(ctx.workDays[i - 1]) && heavy(ctx.workDays[i])) balance += 100;
    }
  return [quotaDeficit, ...deficit, unplaced, balance];
}
function lexLess(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
}
function generateMonth(ctx, options = {}) {
  const seed = String(options.seed ?? ctx.mk),
    attempts = options.attempts ?? 20,
    current = options.current || {};
  for (const key of ctx.workDays) {
    const locked = emptyDay();
    for (const code of DISP)
      if (ctx.locks[key]?.[code])
        locked[code] = (current[key]?.[code] || []).slice();
    const errors = validateDay(ctx, key, locked).errors;
    if (errors.length)
      throw new Error(
        "Cella bloccata da correggere il " +
          Number(key.slice(-2)) +
          ": " +
          errors[0].message,
      );
  }
  const opportunities = opportunityMap(ctx);
  let best = null,
    bestScore = null;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const rng = seedRandom(seed + "/" + attempt),
      pre = preschedule(ctx, current, rng),
      stats = historyStats(ctx, {}),
      out = {};
    for (const key of ctx.days) {
      if (!ctx.workDays.includes(key)) {
        out[key] = {};
        continue;
      }
      out[key] = fillDay(ctx, key, pre[key], stats, opportunities, rng);
      recordStats(stats, key, out[key]);
    }
    const score = monthScore(ctx, out, opportunities);
    if (!bestScore || lexLess(score, bestScore)) {
      best = out;
      bestScore = score;
    }
  }
  return { asg: best, seed, score: bestScore, attempts };
}
function repairDay(ctx, key, month) {
  const day = cleanExisting(ctx, key, month[key] || {}),
    previous = {};
  for (const k of ctx.workDays)
    if (k !== key && month[k]) previous[k] = month[k];
  if (!ctx.locks[key]?.VALID) day.VALID = [];
  const stats = historyStats(ctx, previous);
  const opportunities = opportunityMap(ctx),
    baseSeed = (ctx.state.seeds[ctx.mk] || ctx.mk) + "/repair/" + key;
  let result = fillDay(
    ctx,
    key,
    day,
    stats,
    opportunities,
    seedRandom(baseSeed),
  );
  const deficits = (d) =>
    FIX.map((a) =>
      isEnabled(ctx, key, a.code)
        ? Math.max(
            0,
            capacity(ctx, key, a.code) -
              (a.pair
                ? activePairs(d[a.code] || [])
                : (d[a.code] || []).length),
          )
        : 0,
    );
  const changes = (d) =>
    DISP.reduce(
      (sum, c) =>
        sum +
        Math.max(d[c]?.length || 0, month[key]?.[c]?.length || 0) -
        Array.from(
          { length: Math.max(d[c]?.length || 0, month[key]?.[c]?.length || 0) },
          (_, i) => (d[c]?.[i] === month[key]?.[c]?.[i] ? 1 : 0),
        ).reduce((a, b) => a + b, 0),
      0,
    );
  // At most two displaced occupants; locked cells and fixed pairs remain reserved.
  for (let pass = 0; pass < 2; pass++) {
    let best = result,
      bestScore = [...deficits(result), changes(result)];
    for (const a of FIX)
      if (!ctx.locks[key]?.[a.code])
        for (let i = 0; i < (result[a.code] || []).length; i++) {
          if (!result[a.code][i]) continue;
          const trial = clone(result);
          if (a.pair) trial[a.code][i] = null;
          else trial[a.code].splice(i, 1);
          if (!ctx.locks[key]?.VALID) trial.VALID = [];
          const candidate = fillDay(
            ctx,
            key,
            trial,
            stats,
            opportunities,
            seedRandom(baseSeed + "/" + pass + "/" + a.code + "/" + i),
          );
          const score = [...deficits(candidate), changes(candidate)];
          if (lexLess(score, bestScore)) {
            best = candidate;
            bestScore = score;
          }
        }
    if (best === result) break;
    result = best;
  }
  return { ...month, [key]: result };
}
function quotaIssues(ctx, month) {
  const out = [];
  for (const pair of ctx.vdom) {
    let count = 0;
    for (const day of Object.values(month || {}))
      for (let i = 0; i < (day.VDOM || []).length; i += 2)
        if (pairKey(day.VDOM.slice(i, i + 2)) === pairKey(pair)) count++;
    if (count !== 1)
      out.push({
        code: "VDOM",
        message:
          pair.map((id) => ctx.byId[id].name).join(" + ") +
          ": " +
          count +
          "/1 uscite nel mese",
      });
  }
  if (ctx.pu.length === 2) {
    let count = 0;
    for (const day of Object.values(month || {}))
      for (let i = 0; i < (day.PU || []).length; i += 2)
        if (pairKey(day.PU.slice(i, i + 2)) === pairKey(ctx.pu)) count++;
    if (count !== 2)
      out.push({
        code: "PU",
        message: "Prestazione universale: " + count + "/2 uscite nel mese",
      });
  }
  return out;
}

/* Persistence adapter. The default remains a single React file with no backend. */
function localArchive() {
  return {
    label: "Questo dispositivo",
    shared: false,
    async load() {
      const text = localStorage.getItem(STORAGE_KEY);
      if (!text) return { data: null, revision: 0, updatedAt: null };
      let raw;
      try {
        raw = JSON.parse(text);
      } catch {
        throw new Error(
          "La memoria salvata non è leggibile. Importa un backup; l’originale non è stato sovrascritto.",
        );
      }
      return {
        data: sanitizeState(raw),
        revision: Number(raw._revision) || 0,
        updatedAt: raw._savedAt || null,
      };
    },
    async save(data, revision) {
      const write = () => {
        const before = localStorage.getItem(STORAGE_KEY);
        let old;
        try {
          old = before ? JSON.parse(before) : {};
        } catch {
          throw new Error(
            "Memoria non leggibile: esporta una copia prima di procedere.",
          );
        }
        if ((Number(old._revision) || 0) !== revision) {
          const e = new Error(
            "La memoria è stata aggiornata in un’altra finestra.",
          );
          e.conflict = true;
          throw e;
        }
        const updatedAt = new Date().toISOString(),
          next = {
            ...data,
            _v: VERSION,
            _revision: revision + 1,
            _savedAt: updatedAt,
          };
        try {
          if (
            before &&
            (!old._savedAt ||
              Date.now() -
                Date.parse(
                  localStorage.getItem(BACKUP_KEY + "-time") || "1970-01-01",
                ) >
                300000)
          ) {
            localStorage.setItem(BACKUP_KEY, before);
            localStorage.setItem(BACKUP_KEY + "-time", updatedAt);
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          throw new Error(
            "Salvataggio non riuscito: memoria del browser piena o non disponibile. Scarica il backup JSON.",
          );
        }
        return { revision: revision + 1, updatedAt };
      };
      return navigator.locks?.request
        ? navigator.locks.request(STORAGE_KEY, write)
        : write();
    },
    subscribe(callback) {
      const fn = (e) => {
        if (e.key === STORAGE_KEY) callback();
      };
      window.addEventListener("storage", fn);
      return () => window.removeEventListener("storage", fn);
    },
  };
}
function downloadFile(name, content, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function exportArchive(data) {
  downloadFile(
    "CML_backup_" + new Date().toISOString().slice(0, 10) + ".json",
    JSON.stringify({ ...data, _v: VERSION }, null, 2),
  );
}
function useArchive(store) {
  const [data, setData] = useState(null),
    [status, setStatus] = useState("loading"),
    [error, setError] = useState(""),
    [updatedAt, setUpdatedAt] = useState(null);
  const [epoch, setEpoch] = useState(0);
  const ref = useRef({
      data: null,
      saved: "",
      revision: 0,
      busy: false,
      alive: true,
    }),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    ref.current.alive = true;
    store
      .load()
      .then((r) => {
        if (!alive) return;
        const d = r.data ? sanitizeState(r.data) : defaultState();
        ref.current = {
          ...ref.current,
          data: d,
          saved: JSON.stringify(d),
          revision: r.revision || 0,
        };
        setData(d);
        setUpdatedAt(r.updatedAt);
        setStatus(r.data ? "saved" : "new");
      })
      .catch((e) => {
        if (alive) {
          setError(e.message);
          setStatus("load-error");
        }
      });
    return () => {
      alive = false;
      ref.current.alive = false;
    };
  }, [store]);
  useEffect(() => {
    if (!data) return;
    ref.current.data = data;
    if (JSON.stringify(data) === ref.current.saved) return;
    if (status === "conflict") return;
    setStatus("pending");
    const timer = setTimeout(async () => {
      if (ref.current.busy) return;
      ref.current.busy = true;
      const snapshot = ref.current.data;
      let succeeded = false;
      try {
        const result = await store.save(snapshot, ref.current.revision);
        succeeded = true;
        ref.current.revision = result.revision;
        ref.current.saved = JSON.stringify(snapshot);
        if (ref.current.alive) {
          setUpdatedAt(result.updatedAt);
          setError("");
          setStatus(
            JSON.stringify(ref.current.data) === ref.current.saved
              ? "saved"
              : "pending",
          );
        }
      } catch (e) {
        if (ref.current.alive) {
          setError(e.message);
          setStatus(e.conflict ? "conflict" : "save-error");
        }
      } finally {
        ref.current.busy = false;
        if (
          succeeded &&
          ref.current.alive &&
          JSON.stringify(ref.current.data) !== ref.current.saved
        )
          setRetry((n) => n + 1);
      }
    }, 650);
    return () => clearTimeout(timer);
  }, [data, store, retry]);
  useEffect(() => {
    const receive = async () => {
      try {
        const r = await store.load();
        if (r.revision <= ref.current.revision) return;
        if (
          ref.current.busy ||
          JSON.stringify(ref.current.data) !== ref.current.saved
        ) {
          setStatus("conflict");
          setError(
            "È stata salvata una versione più recente. Conserva la tua copia prima di caricarla.",
          );
          return;
        }
        const d = sanitizeState(r.data);
        ref.current = {
          ...ref.current,
          data: d,
          saved: JSON.stringify(d),
          revision: r.revision,
        };
        setData(d);
        setUpdatedAt(r.updatedAt);
        setError("");
        setStatus("saved");
        setEpoch((n) => n + 1);
      } catch (e) {
        setError(e.message);
      }
    };
    return store.subscribe?.(receive);
  }, [store]);
  useEffect(() => {
    const before = (e) => {
      if (
        ref.current.data &&
        JSON.stringify(ref.current.data) !== ref.current.saved
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, []);
  const replace = (next) => {
    ref.current.data = next;
    setData(next);
    if (status !== "conflict") setError("");
    if (status === "load-error") {
      ref.current.saved = "";
      setStatus("pending");
    }
  };
  const reload = async () => {
    if (ref.current.busy)
      throw new Error("Attendi la fine del salvataggio in corso.");
    if (ref.current.data) exportArchive(ref.current.data);
    const r = await store.load();
    const d = r.data ? sanitizeState(r.data) : defaultState();
    ref.current = {
      ...ref.current,
      data: d,
      saved: JSON.stringify(d),
      revision: r.revision,
    };
    setData(d);
    setUpdatedAt(r.updatedAt);
    setError("");
    setStatus("saved");
    setEpoch((n) => n + 1);
  };
  return {
    data,
    setData: replace,
    status,
    error,
    updatedAt,
    epoch,
    reload,
    retry: () => setRetry((n) => n + 1),
  };
}

/* Interface */
const ICONS = {
  calendar:
    "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 0a4 4 0 0 1 0 8",
  chart: "M4 3v18h17M8 16v-4m5 4V7m5 9v-7",
  sliders: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 10h6m2 2h6m2 4h6",
  shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Zm-4 10 3 3 5-6",
  folder: "M3 5h6l2 3h10v12H3V5Z",
  left: "m14 6-6 6 6 6",
  right: "m10 6 6 6-6 6",
  download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
  upload: "M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4",
  undo: "M3 10h11a7 7 0 0 1 7 7M3 10l5-5m-5 5 5 5",
  redo: "M21 10H10a7 7 0 0 0-7 7m18-7-5-5m5 5-5 5",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  check: "m5 12 4 4L19 6",
  alert: "m12 3 10 18H2L12 3Zm0 6v5m0 3v.5",
  lock: "M6 10V7a6 6 0 0 1 12 0v3M4 10h16v12H4V10Z",
  unlock: "M6 10V7a6 6 0 0 1 11-3M4 10h16v12H4V10Z",
  spark: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z",
  print: "M6 8V2h12v6M6 17H3V8h18v9h-3M6 14h12v8H6v-8Z",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6",
  refresh:
    "M21 4v6h-6m-12 10v-6h6M5 7a8 8 0 0 1 14-1l2 4M3 14l2 4a8 8 0 0 0 14-1",
};
function Icon({ name, size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[name] || ICONS.calendar} />
    </svg>
  );
}
function Button({ icon, children, primary = false, className = "", ...props }) {
  return (
    <button
      className={"cml-button " + (primary ? "primary " : "") + className}
      {...props}
    >
      {icon && <Icon name={icon} />} {children}
    </button>
  );
}
function ActivityTag({ code }) {
  return (
    <span
      className="activity-tag"
      style={{
        background: COL[code]?.bg,
        color: COL[code]?.tx,
        borderColor: COL[code]?.bd,
      }}
    >
      {code === "VALID"
        ? "ATTI"
        : code === "CICNOTO"
          ? "CIC Noto"
          : code === "CICVDSR"
            ? "CIC/VD SR"
            : code}
    </span>
  );
}
function Dialog({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const old = document.activeElement;
    ref.current?.showModal();
    return () => {
      ref.current?.close();
      old?.focus?.();
    };
  }, []);
  return (
    <dialog
      className={"cml-dialog " + (wide ? "wide" : "")}
      ref={ref}
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-heading">
        <h2 id="dialog-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Chiudi finestra"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;650;700;800&display=swap');
*{box-sizing:border-box}body{margin:0}.cml-app{--ink:#193547;--muted:#697e8b;--line:#dfe7eb;--teal:#087f79;--nav:#123346;background:#f2f5f7;color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;font-size:14px;min-height:100vh;display:grid;grid-template-columns:204px minmax(0,1fr)}
.cml-app button,.cml-app input,.cml-app select,.cml-app textarea,.cml-dialog button,.cml-dialog input,.cml-dialog select{font:inherit}button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.45}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #20a6a6;outline-offset:3px}.cml-app input,.cml-app select,.cml-app textarea,.cml-dialog input,.cml-dialog select{border:1px solid #cbd8df;border-radius:7px;background:white;color:#193547;padding:9px 10px;min-height:38px}.cml-app input[type=checkbox],.cml-dialog input[type=checkbox]{min-height:18px;width:18px;height:18px;accent-color:#087f79}.cml-app textarea{width:100%;resize:vertical;min-height:100px}.cml-app h1,.cml-app h2,.cml-app h3,.cml-dialog h2{margin:0;font-weight:700;letter-spacing:-.035em}.cml-app h1{font-size:30px}.cml-app h2{font-size:22px}.cml-app h3{font-size:16px}.cml-app p{line-height:1.65}.muted{color:#697e8b}.small{font-size:12px}.cml-sidebar{background:var(--nav);color:#d5e3e9;position:sticky;top:0;height:100vh;padding:30px 17px;display:flex;flex-direction:column;gap:34px}.cml-brand{display:flex;align-items:center;gap:10px;padding:0 8px}.cml-brand-mark{background:#75d4c7;color:#123346;display:grid;place-items:center;width:35px;height:35px;border-radius:10px;font-size:27px;font-weight:700}.cml-brand strong{font-size:16px;letter-spacing:-.03em;color:white;display:block}.cml-brand small{font-size:11px;letter-spacing:.14em;color:#91aebd;display:block;margin-top:4px}.nav-label{font-size:10px;letter-spacing:.16em;color:#7f9aa9;padding:0 12px;margin-bottom:12px}.cml-nav{display:grid;gap:5px}.cml-nav button{display:flex;align-items:center;gap:11px;width:100%;text-align:left;border:0;border-radius:8px;background:transparent;color:#b4c9d5;padding:12px;font-weight:500;font-size:13px}.cml-nav button.active{background:#244b60;color:white;box-shadow:inset 3px 0 #77d9cb}.cml-nav button:hover{background:#244b60}.nav-foot{margin-top:auto;padding:16px 10px;border-top:1px solid #335366;color:#99b2c1;font-size:12px;line-height:1.7}.nav-foot strong{display:block;color:#d4e4ed;font-weight:500}.cml-main{padding:27px 30px;min-width:0}.topline{display:flex;justify-content:space-between;align-items:center;margin-bottom:23px}.eyebrow{font-size:10px;font-weight:700;letter-spacing:.17em;color:#728591;text-transform:uppercase}.save-state{display:flex;align-items:center;gap:7px;color:#347063;font-size:12px}.save-state.error{color:#b13a43}.page-heading{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:22px}.month-heading{display:flex;align-items:center;gap:17px}.month-nav{display:flex;gap:5px}.icon-button{border:1px solid #d8e2e8;color:#526e80;background:white;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;min-width:34px;min-height:34px;padding:6px}.icon-button:hover{background:#edf3f5}.cml-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;border:1px solid #d4e0e6;border-radius:7px;background:white;color:#294d63;padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap}.cml-button:hover{background:#f4f8fa}.cml-button.primary{background:#087f79;border-color:#087f79;color:white}.cml-button.primary:hover{background:#086e68}.cml-button.danger{color:#ae3545;border-color:#e6bac1}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:17px}.toolbar-group{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.segmented{display:inline-flex;background:#e5ebef;padding:3px;border-radius:8px;gap:2px}.segmented button{border:0;border-radius:6px;background:transparent;color:#607785;padding:7px 13px;font-size:12px;font-weight:600}.segmented button.active{color:#24495f;background:white;box-shadow:0 1px 3px #15394715}.summary-strip{display:flex;align-items:center;gap:24px;flex-wrap:wrap;border:1px solid var(--line);background:white;border-radius:9px;padding:13px 18px;margin-bottom:18px}.summary-stat{display:flex;align-items:baseline;gap:6px;font-size:12px;color:#6a7e8a}.summary-stat b{font-size:18px;color:#274b60;letter-spacing:-.04em}.summary-stat.warn b{color:#b47515}.summary-stat:last-child{margin-left:auto}.grid-card{border:1px solid #d7e2e8;border-radius:10px;background:white;overflow:hidden;box-shadow:0 2px 6px #1c405505}.grid-intro{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:14px 17px;border-bottom:1px solid #e3e9ee}.grid-intro strong{font-size:13px}.grid-intro span{font-size:12px;color:#7b8d98}.planning-scroll{overflow:auto;max-height:calc(100vh - 315px);min-height:290px}.planning-table{border-collapse:separate;border-spacing:0;width:100%;font-size:12px}.planning-table th{position:sticky;top:0;z-index:3;padding:11px 8px;background:#f9fbfc;border-bottom:1px solid #dbe5eb;text-align:left;font-weight:650;color:#536e7e;min-width:122px;white-space:nowrap}.planning-table th.date-col{min-width:106px}.planning-table td{vertical-align:top;border-bottom:1px solid #e7edf1;border-right:1px solid #edf1f4;padding:8px 6px;background:white;min-width:122px}.planning-table .date-col{position:sticky;left:0;background:#f9fbfc;z-index:2;min-width:106px;border-right:1px solid #d7e2e8;padding:10px}.planning-table th.date-col{z-index:4}.planning-table tr.selected td{background:#f8fcfc}.planning-table tr.selected .date-col{background:#eaf6f4;box-shadow:inset 3px 0 #0b938a}.date-button{border:0;background:none;text-align:left;color:#24475c;padding:0;display:block;width:100%}.date-number{font-size:19px;letter-spacing:-.06em;font-weight:650}.date-dow{font-size:11px;margin-left:6px;text-transform:uppercase;color:#7a8e9a}.day-state{display:flex;gap:4px;align-items:center;margin-top:7px;font-size:10px;color:#538374}.day-state.warn{color:#a5701e}.day-state.error{color:#b14453}.day-state svg{width:13px;height:13px}.pair-tile{border:1px solid var(--tile-border);border-left:3px solid var(--tile-border);background:var(--tile-bg);border-radius:5px;padding:3px 4px;margin-bottom:5px;min-width:104px}.name-button{display:flex;align-items:center;gap:4px;text-align:left;padding:3px 2px;background:transparent;border:0;width:100%;font-size:12px;line-height:1.25;color:var(--tile-text);border-radius:3px;min-height:25px;white-space:nowrap}.name-button:hover{background:#ffffffa0}.name-button[draggable=true]{cursor:grab}.name-button .role{font-size:8px;line-height:14px;padding:0 3px;flex-shrink:0;font-weight:700;border:1px solid currentColor;border-radius:3px;opacity:.75}.name-button.str .person-name{font-weight:650}.name-button.hole{color:#8b9ba5;font-weight:400;min-height:25px;border:1px dashed #b7c9d0;margin:2px 0}.name-button.hole span{font-size:10px}.cell-tools{display:flex;justify-content:space-between;gap:4px;align-items:center;margin-top:5px}.cell-tools button{border:0;background:none;color:#99aeb9;padding:2px;display:flex;align-items:center;gap:3px;font-size:10px;min-height:21px}.cell-tools button.locked{color:#af8125}.cell-tools svg{width:13px;height:13px}.cell-empty{font-size:11px;color:#b2c0c8;text-align:center;padding:10px 0}.cell-disabled{background:#f9fafb!important}.cell-disabled span{color:#c5cfd5;display:block;text-align:center;padding:9px;font-size:12px}.planning-table tr.weekend td{padding:4px 8px;min-height:0;background:#f5f7f9;color:#9babb4;font-size:10px}.planning-table tr.weekend .date-col{font-size:10px}.grid-footer{font-size:11px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:12px 16px;color:#7c909e;border-top:1px solid #e1e8ed;background:#fbfcfd}.legend{display:flex;gap:13px;flex-wrap:wrap}.legend-item{display:inline-flex;gap:5px;align-items:center}.legend-dot{width:7px;height:7px;border-radius:2px}.activity-tag{display:inline-flex;align-items:center;border:1px solid;padding:3px 7px;border-radius:5px;font-size:11px;font-weight:650;white-space:nowrap}.empty-planning{padding:20px;border-bottom:1px solid #e4ebef;background:#f6fbfa;display:flex;justify-content:space-between;align-items:center;gap:15px}.empty-planning p{margin:5px 0 0;font-size:13px;color:#70838f}.banner{border:1px solid #e9cba1;background:#fff8e9;color:#8b5816;border-radius:8px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:16px;font-size:13px;line-height:1.5}.banner.error{border-color:#e9bfc5;background:#fff3f4;color:#a13f4e}.panel{background:white;border:1px solid #dbe5ea;border-radius:10px;padding:22px;margin-bottom:18px}.panel-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:17px}.form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}.field{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:600;color:#5c7382}.field input,.field select{width:100%;font-weight:400}.form-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.check-label{display:inline-flex;align-items:center;gap:7px;font-size:13px}.data-scroll{overflow:auto}.data-table{width:100%;border-collapse:collapse;font-size:13px}.data-table th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;font-weight:600;color:#7c909c;text-align:left;padding:10px 12px;border-bottom:1px solid #dbe5eb;white-space:nowrap}.data-table td{padding:11px 12px;border-bottom:1px solid #e8eef2;vertical-align:middle}.data-table .number{text-align:center;font-variant-numeric:tabular-nums}.data-table tbody tr:hover{background:#f8fbfc}.data-table td:first-child{font-weight:550}.data-table input[type=number]{width:64px;padding:5px}.data-table .light-cell{background:#f1f7fa}.data-table .heavy-cell{background:#fff8ec}.load-bar{height:5px;width:100px;background:#eaf0f4;border-radius:5px;overflow:hidden}.load-bar span{display:block;height:100%;background:#2f9e93}.cml-dialog{font-family:'DM Sans',system-ui,sans-serif;border:1px solid #d6e3ea;border-radius:14px;box-shadow:0 30px 90px #09233440;padding:24px;width:min(560px,calc(100vw - 32px));max-height:88vh;color:#193547;background:#fff}.cml-dialog.wide{width:min(940px,calc(100vw - 32px))}.cml-dialog::backdrop{background:#102c4366;backdrop-filter:blur(3px)}.dialog-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:20px}.dialog-heading h2{font-size:21px}.dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:22px;padding-top:16px;border-top:1px solid #e3eaef}.dialog-copy{font-size:14px;line-height:1.7;color:#617987}.issue-list{display:grid;gap:8px;margin:12px 0}.issue{padding:10px 12px;border-radius:6px;background:#fff8ed;color:#956921;font-size:12px;line-height:1.55}.issue.error{background:#fff1f3;color:#a43d51}.issue code{font:inherit;font-weight:700}.day-panel-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.day-activities{display:grid;gap:9px}.day-activity{border:1px solid #e0e8ed;border-radius:7px;padding:11px}.day-activity-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.assignment-slot{display:flex;gap:5px;align-items:center;margin-top:6px}.assignment-slot select{min-width:0;flex:1;font-size:12px!important;padding:7px!important}.person-list{display:grid;gap:7px}.person-line{padding:9px 11px;border:1px solid #e2e9ed;border-radius:6px;font-size:12px}.person-line small{display:block;margin-top:4px;color:#788d99;line-height:1.5}.cml-toast{position:fixed;right:24px;bottom:22px;background:#173e52;color:white;padding:13px 18px;border-radius:9px;max-width:min(520px,90vw);box-shadow:0 5px 20px #16394e25;font-size:13px;z-index:9999}.cml-toast.error{background:#9f3d4e}.week-select{max-width:180px;font-size:12px!important}.busy{display:flex;align-items:center;gap:10px;padding:15px;background:#eff9f6;border:1px solid #bfe5d9;border-radius:7px;color:#2b7563}.spinner{width:16px;height:16px;border:2px solid #c2ded5;border-top-color:#128170;border-radius:50%;animation:cml-spin 1s linear infinite}@keyframes cml-spin{to{transform:rotate(360deg)}}.date-range{display:flex;gap:10px;align-items:end;flex-wrap:wrap}.day-toggle{border:1px solid #d9e4ea;border-radius:6px;background:#fff;color:#8195a1;min-width:33px;min-height:33px;padding:4px;font-size:12px}.day-toggle.on{background:#e7f5ef;color:#1a7962;border-color:#aed7c8}.day-toggle.off{background:#fff0f1;color:#b04253;border-color:#ecc6cd}.day-toggle.sw{background:#e9f2fc;color:#356fa6;border-color:#b7d1ed}.day-toggle.changed{box-shadow:inset 0 -3px #d4a144}.mini-count{font-size:11px;color:#7a8f9d}.button-link{background:none;border:0;color:#087f79;text-decoration:underline;padding:0;font:inherit}.members-chips{display:flex;gap:7px;flex-wrap:wrap}.settings-note{font-size:12px;color:#738894;line-height:1.6;margin-top:10px}.conflict-tag{background:#fff0f2;color:#9f3c4c;border-radius:4px;padding:4px 8px;font-size:12px}.rule-weight{width:155px}.planning-scroll.compact .name-button{font-size:11px;min-height:22px;padding:2px}.planning-scroll.compact td{padding:5px}.planning-scroll.compact .pair-tile{margin-bottom:3px}
@media(min-width:1700px){.cml-main{padding:32px 40px}.planning-table th,.planning-table td{min-width:126px}.name-button{font-size:13px}}
@media(max-width:1100px){.cml-app{grid-template-columns:74px minmax(0,1fr)}.cml-sidebar{padding:24px 10px;align-items:center}.cml-brand{padding:0}.cml-brand div:last-child,.nav-label,.nav-foot,.cml-nav button span{display:none}.cml-nav button{justify-content:center;padding:13px}.cml-main{padding:24px 20px}.summary-strip{gap:16px}.summary-stat:last-child{margin-left:0}}
@media(max-width:700px){.cml-app{display:block}.cml-sidebar{height:auto;position:static;padding:13px 15px;flex-direction:row;justify-content:space-between;gap:16px}.cml-brand div:last-child{display:block}.cml-brand strong{font-size:13px}.cml-brand small{font-size:8px}.cml-brand-mark{width:30px;height:30px}.cml-nav{display:flex;gap:2px;overflow:auto}.cml-nav button{padding:8px}.cml-nav button svg{width:17px}.cml-main{padding:19px 12px}.topline{margin-bottom:18px}.eyebrow{font-size:8px;max-width:130px;line-height:1.6}.save-state{font-size:10px}.cml-app h1{font-size:25px}.page-heading{align-items:flex-start}.page-heading .toolbar-group{gap:4px}.page-heading .cml-button{font-size:11px;padding:6px 8px}.month-heading{gap:8px}.month-nav{gap:2px}.summary-strip{gap:10px 17px;padding:12px}.summary-stat{font-size:10px}.summary-stat b{font-size:16px}.planning-scroll{max-height:65vh}.grid-intro span{display:none}.day-panel-grid{grid-template-columns:1fr}.cml-dialog{padding:18px}.panel{padding:16px}.banner{align-items:flex-start;flex-direction:column}}
@media(max-width:700px){.cml-sidebar>.cml-brand{display:none}.cml-sidebar>div{min-width:0;width:100%}.cml-nav{width:100%;justify-content:space-between}.cml-nav button{min-width:34px;width:auto;flex:1}.page-heading{flex-wrap:wrap}.month-heading h1{white-space:nowrap}}
@media(prefers-reduced-motion:reduce){.spinner{animation:none}}
`;

function MonthGrid({
  ctx,
  month,
  mode,
  week,
  selected,
  onSelect,
  onEdit,
  onMove,
  onLock,
  compact,
}) {
  const names = useMemo(() => sN(ctx.state.users), [ctx.state.users]),
    drag = useRef(null),
    generated = Object.keys(month).length > 0;
  const days = ctx.days.filter((k) => mode === "month" || weekKey(k) === week);
  return (
    <div className={"planning-scroll " + (compact ? "compact" : "")}>
      <table className="planning-table">
        <thead>
          <tr>
            <th className="date-col">Giorno</th>
            {OPD.map((a) => (
              <th key={a.code}>
                <ActivityTag code={a.code} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((key) => {
            const day = month[key] || {},
              d = Number(key.slice(-2)),
              off = !ctx.workDays.includes(key),
              report = generated && !off ? validateDay(ctx, key, day) : null;
            if (off)
              return (
                <tr className="weekend" key={key}>
                  <td className="date-col">
                    {dn(ctx.year, ctx.month, d)} {d}
                  </td>
                  <td colSpan={DISP.length}>
                    {isH(ctx.year, ctx.month, d) || ""}
                  </td>
                </tr>
              );
            const trouble =
              report && (report.issues.length || report.unplaced.length);
            return (
              <tr key={key} className={selected === key ? "selected" : ""}>
                <td className="date-col">
                  <button
                    className="date-button"
                    onClick={() => onSelect(key)}
                    aria-label={"Apri giornata " + dateLabel(key)}
                  >
                    <span className="date-number">
                      {String(d).padStart(2, "0")}
                    </span>
                    <span className="date-dow">
                      {dn(ctx.year, ctx.month, d)}
                    </span>
                    {generated && !trouble && (
                      <span className="day-state">
                        <Icon name="check" />
                        Verificato
                      </span>
                    )}
                    {!!report?.errors.length && (
                      <span
                        className="day-state error"
                        title={report.errors.map((i) => i.message).join("\n")}
                      >
                        <Icon name="alert" />
                        {report.errors.length} errori
                      </span>
                    )}
                    {!!report?.warnings.length && (
                      <span
                        className="day-state warn"
                        title={report.warnings
                          .map((i) => i.code + ": " + i.message)
                          .join("\n")}
                      >
                        <Icon name="alert" />
                        {report.warnings.length} avvisi
                      </span>
                    )}
                    {!!report?.unplaced.length && (
                      <span
                        className="day-state"
                        style={{ color: "#246ab3" }}
                        title={report.unplaced
                          .map(
                            (u) =>
                              u.name + ": " + residualReason(ctx, key, u, day),
                          )
                          .join("\n")}
                      >
                        <Icon name="users" />
                        {report.unplaced.length} da assegnare
                      </span>
                    )}
                  </button>
                </td>
                {OPD.map((a) => {
                  if (!isEnabled(ctx, key, a.code))
                    return (
                      <td className="cell-disabled" key={a.code}>
                        <span>—</span>
                      </td>
                    );
                  const arr = day[a.code] || [],
                    color = COL[a.code],
                    slots =
                      a.alloc === "fix"
                        ? capacity(ctx, key, a.code) * (a.pair ? 2 : 1)
                        : arr.length;
                  const count = Math.max(arr.length, generated ? slots : 0),
                    groups = [];
                  const drop = (e, index) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const source = drag.current;
                    drag.current = null;
                    if (source)
                      onMove({
                        type: "move",
                        key,
                        code: a.code,
                        index,
                        source,
                      });
                  };
                  const render = (id, index) => (
                    <button
                      key={index}
                      className={
                        "name-button " +
                        (id
                          ? ctx.byId[id]?.ct === "STR"
                            ? "str"
                            : ""
                          : "hole")
                      }
                      draggable={!!id}
                      onDragStart={(e) => {
                        drag.current = { key, code: a.code, index };
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", id);
                      }}
                      onDragEnd={() => {
                        drag.current = null;
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => drop(e, index)}
                      onClick={() => onEdit(key, a.code, index)}
                      title={
                        id
                          ? ctx.byId[id]?.name +
                            " · " +
                            (ctx.byId[id]?.ml ? "ML" : "non-ML") +
                            " · " +
                            ctx.byId[id]?.ct
                          : "Completa il posto"
                      }
                    >
                      {id ? (
                        <>
                          <span className="person-name">
                            {names[id] || "Utente mancante"}
                          </span>
                          {ctx.byId[id]?.ml && <span className="role">ML</span>}
                        </>
                      ) : (
                        <>
                          <Icon name="plus" size={11} />
                          <span>Posto libero</span>
                        </>
                      )}
                    </button>
                  );
                  for (let i = 0; i < count; i += a.pair ? 2 : 1)
                    groups.push(
                      a.pair ? (
                        <div className="pair-tile" key={i}>
                          {render(arr[i], i)}
                          {render(arr[i + 1], i + 1)}
                        </div>
                      ) : (
                        render(arr[i], i)
                      ),
                    );
                  return (
                    <td
                      key={a.code}
                      style={{
                        "--tile-bg": color.bg + "80",
                        "--tile-border": color.bd,
                        "--tile-text": color.tx,
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) =>
                        drop(
                          e,
                          arr.findIndex((x) => !x) >= 0
                            ? arr.findIndex((x) => !x)
                            : arr.length,
                        )
                      }
                    >
                      {groups.length ? (
                        groups
                      ) : (
                        <div className="cell-empty">
                          {a.alloc === "pre"
                            ? "Nessuna uscita"
                            : "Da pianificare"}
                        </div>
                      )}
                      <div className="cell-tools">
                        <button
                          onClick={() =>
                            onEdit(
                              key,
                              a.code,
                              arr.findIndex((x) => !x) >= 0
                                ? arr.findIndex((x) => !x)
                                : arr.length,
                            )
                          }
                          aria-label={"Modifica " + a.label + " del " + d}
                        >
                          <Icon name="plus" />
                          Modifica
                        </button>
                        <button
                          className={ctx.locks[key]?.[a.code] ? "locked" : ""}
                          aria-label={
                            (ctx.locks[key]?.[a.code]
                              ? "Sblocca "
                              : "Blocca ") +
                            a.label +
                            " del " +
                            d
                          }
                          title="Protegge dalla rigenerazione. Le nuove assenze restano prioritarie."
                          onClick={() => onLock(key, a.code)}
                        >
                          <Icon
                            name={ctx.locks[key]?.[a.code] ? "lock" : "unlock"}
                          />
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function AssignmentEditor({ ctx, month, edit, onApply, onClose, onOverride }) {
  const { key, code } = edit,
    a = AC[code],
    day = month[key] || {},
    arr = day[code] || [],
    [error, setError] = useState(""),
    [search, setSearch] = useState("");
  const count = a.pair
    ? Math.max(
        arr.length,
        a.alloc === "fix" ? capacity(ctx, key, code) * 2 : arr.length + 2,
      )
    : Math.max(
        arr.length + 1,
        a.alloc === "fix" ? capacity(ctx, key, code) : 0,
      );
  const attempt = (op) => {
    try {
      onApply(op);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };
  const options = (index) =>
    ctx.state.users
      .filter(
        (u) =>
          arr[index] === u.id ||
          !search ||
          u.name.toLowerCase().includes(search.toLowerCase()),
      )
      .map((u) => {
        let reason = "";
        try {
          applyManual(ctx, month, { type: "set", key, code, index, uid: u.id });
        } catch (e) {
          reason = e.message;
        }
        return { u, reason };
      })
      .filter((x) => !x.reason || arr[index] === x.u.id)
      .sort((a, b) => a.u.name.localeCompare(b.u.name));
  return (
    <Dialog
      title={a.label + " · " + Number(key.slice(-2)) + " " + MN[ctx.month]}
      onClose={onClose}
    >
      <p className="dialog-copy">
        {FIXED_PAIR.has(code)
          ? "Le coppie fisse si modificano per intero."
          : "Sono proposti solo gli operatori compatibili. Se già assegnati nella giornata, vengono spostati qui."}
      </p>
      {["CIC", "CIECHI"].includes(code) && (
        <PresidentSettings
          ctx={ctx}
          dayKey={key}
          code={code}
          onOverride={onOverride}
        />
      )}
      {error && (
        <div className="issue error" role="alert">
          {error}
        </div>
      )}
      {!FIXED_PAIR.has(code) && (
        <label className="field">
          Cerca operatore
          <input
            placeholder="Cognome o nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      )}
      <div className="day-activities" style={{ marginTop: 16 }}>
        {FIXED_PAIR.has(code)
          ? Array.from({ length: Math.floor(arr.length / 2) + 1 }, (_, i) => {
              const pool = code === "VDOM" ? ctx.vdom : [ctx.pu];
              return (
                <div className="assignment-slot" key={i}>
                  <select
                    aria-label={"Coppia " + (i + 1)}
                    value={
                      arr[i * 2] ? pairKey(arr.slice(i * 2, i * 2 + 2)) : ""
                    }
                    onChange={(e) =>
                      attempt({
                        type: "pair",
                        key,
                        code,
                        index: i * 2,
                        pair: e.target.value ? e.target.value.split("|") : null,
                      })
                    }
                  >
                    <option value="">
                      {i * 2 < arr.length
                        ? "Rimuovi coppia"
                        : "Aggiungi coppia"}
                    </option>
                    {pool
                      .filter((p) => p.length === 2)
                      .map((p) => {
                        let reason = "";
                        try {
                          applyManual(ctx, month, {
                            type: "pair",
                            key,
                            code,
                            index: i * 2,
                            pair: p,
                          });
                        } catch (e) {
                          reason = e.message;
                        }
                        return (
                          <option
                            key={pairKey(p)}
                            value={pairKey(p)}
                            disabled={!!reason}
                          >
                            {p.map((id) => ctx.byId[id]?.name).join(" + ")}
                            {reason ? " — non disponibile" : ""}
                          </option>
                        );
                      })}
                  </select>
                </div>
              );
            })
          : Array.from({ length: count }, (_, index) => (
              <div key={index} className="assignment-slot">
                <span className="mini-count" style={{ minWidth: 60 }}>
                  {a.pair
                    ? "C" +
                      (Math.floor(index / 2) + 1) +
                      " · " +
                      ((index % 2) + 1)
                    : index + 1}
                </span>
                <select
                  aria-label={"Operatore posto " + (index + 1)}
                  value={arr[index] || ""}
                  onChange={(e) =>
                    attempt({
                      type: "set",
                      key,
                      code,
                      index,
                      uid: e.target.value || null,
                    })
                  }
                >
                  <option value="">Posto libero</option>
                  {options(index).map(({ u }) => (
                    <option value={u.id} key={u.id}>
                      {u.name}
                      {u.ml ? " · ML" : ""}
                      {Object.entries(day).find(
                        ([c, ids]) => c !== code && ids.includes(u.id),
                      )
                        ? " · già assegnato"
                        : ""}
                    </option>
                  ))}
                </select>
                {arr[index] && (
                  <button
                    className="icon-button"
                    aria-label={"Rimuovi " + ctx.byId[arr[index]]?.name}
                    onClick={() =>
                      attempt({ type: "set", key, code, index, uid: null })
                    }
                  >
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>
            ))}
      </div>
      <div className="dialog-actions">
        <Button onClick={onClose} primary>
          Fatto
        </Button>
      </div>
    </Dialog>
  );
}
function DayDetails({
  ctx,
  month,
  dayKey,
  onClose,
  onEdit,
  onRepair,
  onOverride,
}) {
  const day = month[dayKey] || {},
    report = validateDay(ctx, dayKey, day),
    [pres, setPres] = useState(false);
  return (
    <Dialog wide title={dateLabel(dayKey)} onClose={onClose}>
      <div className="toolbar">
        <span className="muted small">
          {report.assigned} assegnati · {report.unplaced.length} disponibili da
          assegnare
        </span>
        <Button icon="refresh" primary onClick={() => onRepair(dayKey)}>
          Ripara giornata
        </Button>
      </div>
      <div className="day-panel-grid">
        <div>
          <h3>Attività della giornata</h3>
          <div className="day-activities" style={{ marginTop: 12 }}>
            {OPD.map((a) => (
              <div className="day-activity" key={a.code}>
                <div className="day-activity-top">
                  <ActivityTag code={a.code} />
                  {a.alloc === "fix" && (
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={isEnabled(ctx, dayKey, a.code)}
                        disabled={
                          !!a.dows &&
                          !a.dows.includes(
                            new Date(dayKey + "T12:00:00").getDay(),
                          )
                        }
                        onChange={(e) =>
                          onOverride(dayKey, a.code, {
                            enabled: e.target.checked,
                          })
                        }
                      />
                      Attiva
                    </label>
                  )}
                </div>
                {isEnabled(ctx, dayKey, a.code) && (
                  <div className="form-row">
                    {a.alloc === "fix" && (
                      <label className="field">
                        {a.pair ? "Coppie" : "Operatori"}
                        <input
                          style={{ width: 70 }}
                          type="number"
                          min="0"
                          max="20"
                          value={capacity(ctx, dayKey, a.code)}
                          onChange={(e) =>
                            onOverride(dayKey, a.code, {
                              slots: bounded(e.target.value, 0, 0, 20),
                            })
                          }
                        />
                      </label>
                    )}
                    <span className="mini-count">
                      {(day[a.code] || []).filter(Boolean).length} persone
                    </span>
                    <Button onClick={() => onEdit(dayKey, a.code, 0)}>
                      Modifica
                    </Button>
                  </div>
                )}
                {["CIC", "CIECHI"].includes(a.code) && (
                  <PresidentSettings
                    ctx={ctx}
                    dayKey={dayKey}
                    code={a.code}
                    onOverride={onOverride}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3>Da verificare</h3>
          {!report.issues.length && !report.unplaced.length ? (
            <p
              className="issue"
              style={{ background: "#edf9f3", color: "#31765c" }}
            >
              Tutti i controlli della giornata sono superati.
            </p>
          ) : (
            <div className="issue-list">
              {report.issues.map((issue, i) => (
                <div className={"issue " + issue.severity} key={i}>
                  <code>{issue.code === "VALID" ? "ATTI" : issue.code}</code>{" "}
                  {issue.message}
                </div>
              ))}
            </div>
          )}
          {report.unplaced.length > 0 && (
            <>
              <h3 style={{ margin: "20px 0 12px" }}>
                Disponibili non assegnati
              </h3>
              <div className="person-list">
                {report.unplaced.map((u) => (
                  <div className="person-line" key={u.id}>
                    <strong>{u.name}</strong>
                    {u.ml ? " · ML" : ""}
                    <small>{residualReason(ctx, dayKey, u, day)}</small>
                  </div>
                ))}
              </div>
            </>
          )}
          <h3 style={{ margin: "20px 0 12px" }}>Indisponibilità</h3>
          <div className="person-list">
            {Object.entries(ctx.ind[dayKey] || {})
              .filter(([id]) => ctx.byId[id]?.active !== false)
              .map(([id, codes]) => (
                <div className="person-line" key={id}>
                  {ctx.byId[id]?.name}
                  <small>{codes.join(", ")}</small>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
function FairnessView({ ctx, month }) {
  const stats = historyStats(ctx, month),
    weeks = unique(ctx.workDays.map(weekKey));
  return (
    <>
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Distribuzione del lavoro</h2>
            <p className="muted small">
              CIC e VD sono attività più impegnative. I conteggi settimanali
              aiutano a individuare concentrazioni.
            </p>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operatore</th>
                <th>Presenze utili</th>
                {["CIC", "VD", "NIC", "NICSP", "222", "VALID"].map((c) => (
                  <th key={c}>{c === "VALID" ? "ATTI" : c}</th>
                ))}
                <th>CIC + VD</th>
                {weeks.map((w) => (
                  <th key={w}>
                    Sett. {Number(w.slice(-2))}/{Number(w.slice(5, 7))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ctx.state.users
                .filter((u) => !u.vo && u.active !== false)
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((u) => {
                  const s = stats[u.id],
                    heavy = (s.by.CIC || 0) + (s.by.VD || 0),
                    days = ctx.workDays.filter((k) => !ctx.ind[k][u.id]).length;
                  return (
                    <tr key={u.id}>
                      <td>
                        {u.name}
                        <div className="muted small">
                          {u.ml ? "Medico legale" : "Non-ML"} · {u.ct}
                        </div>
                      </td>
                      <td className="number">{days}</td>
                      {["CIC", "VD", "NIC", "NICSP", "222", "VALID"].map(
                        (c) => (
                          <td
                            className={
                              "number " + (HEAVY.has(c) ? "heavy-cell" : "")
                            }
                            key={c}
                          >
                            {s.by[c] || "—"}
                          </td>
                        ),
                      )}
                      <td className="number">
                        <strong>{heavy}</strong>
                        <div
                          className="load-bar"
                          style={{ margin: "6px auto 0" }}
                        >
                          <span
                            style={{
                              width:
                                Math.min(
                                  100,
                                  (heavy / Math.max(1, days)) * 100,
                                ) + "%",
                            }}
                          />
                        </div>
                      </td>
                      {weeks.map((w) => (
                        <td className="number" key={w}>
                          {(s.weeks[w]?.by.CIC || 0) +
                            (s.weeks[w]?.by.VD || 0) || "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <h3>Uscite programmate</h3>
        <div className="issue-list">
          {quotaIssues(ctx, month).length ? (
            quotaIssues(ctx, month).map((q, i) => (
              <div className="issue" key={i}>
                <ActivityTag code={q.code} /> {q.message}
              </div>
            ))
          ) : (
            <p className="muted">
              Domiciliari e prestazione universale rispettano le frequenze
              mensili.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
function StatsView({ ctx, month }) {
  const stats = historyStats(ctx, month);
  const people = ctx.state.users
    .filter(
      (u) => u.active !== false || Object.values(stats[u.id].by).some(Boolean),
    )
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <FairnessView ctx={ctx} month={month} />
      <details className="panel" open>
        <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 18 }}>
          Conteggi completi del mese
        </summary>
        <p className="muted small">
          Una presenza per ogni attività assegnata. Sono inclusi gli operatori
          dedicati alle domiciliari. FER ed EST possono coincidere nello stesso
          giorno: le colonne non vanno sommate tra loro.
        </p>
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operatore</th>
                {OPD.map((a) => (
                  <th key={a.code}>
                    <ActivityTag code={a.code} />
                  </th>
                ))}
                <th>Assegnazioni</th>
                {["SW", "FER", "EST", "N/D"].map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th>Da assegnare</th>
              </tr>
            </thead>
            <tbody>
              {people.map((u) => {
                const s = stats[u.id],
                  total = Object.values(s.by).reduce(
                    (n, count) => n + count,
                    0,
                  ),
                  absences = Object.fromEntries(
                    ["SW", "FER", "EST", "N/D"].map((c) => [
                      c,
                      ctx.workDays.filter((k) =>
                        ctx.ind[k]?.[u.id]?.includes(c),
                      ).length,
                    ]),
                  );
                const unassigned =
                  u.vo || u.active === false
                    ? 0
                    : ctx.workDays.filter(
                        (k) =>
                          !ctx.ind[k]?.[u.id] &&
                          !allIds(month[k]).includes(u.id),
                      ).length;
                return (
                  <tr key={u.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {u.name}
                      {u.vo && (
                        <div className="muted small">Solo domiciliari</div>
                      )}
                    </td>
                    {OPD.map((a) => (
                      <td className="number" key={a.code}>
                        {s.by[a.code] || "—"}
                      </td>
                    ))}
                    <td className="number">
                      <strong>{total || "—"}</strong>
                    </td>
                    {Object.entries(absences).map(([c, n]) => (
                      <td className="number" key={c}>
                        {n || "—"}
                      </td>
                    ))}
                    <td
                      className="number"
                      style={{ color: unassigned ? "#a66711" : undefined }}
                    >
                      {unassigned || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
function escapeHTML(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function printHTML(ctx, month) {
  const names = sN(ctx.state.users);
  const rows = ctx.days
    .map((key) => {
      const d = Number(key.slice(-2)),
        off = !ctx.workDays.includes(key),
        day = month[key] || {};
      return (
        "<tr" +
        (off ? ' class="off"' : "") +
        "><th>" +
        escapeHTML(dn(ctx.year, ctx.month, d) + " " + d) +
        "</th>" +
        OPD.map((a) => {
          if (off) return "<td></td>";
          if (!isEnabled(ctx, key, a.code)) return '<td class="off">—</td>';
          const arr = day[a.code] || [],
            c = COL[a.code];
          let result = "";
          for (let i = 0; i < arr.length; i += a.pair ? 2 : 1) {
            const ids = arr.slice(i, i + (a.pair ? 2 : 1));
            if (a.pair && ids.length < 2) ids.push(null);
            result +=
              '<div class="pair" style="background:' +
              c.bg +
              ";border-color:" +
              c.bd +
              ";color:" +
              c.tx +
              '">' +
              ids
                .map(
                  (id) =>
                    "<div" +
                    (ctx.byId[id]?.ct === "STR" ? ' class="str"' : "") +
                    ">" +
                    escapeHTML(
                      id ? names[id] || "Utente mancante" : "Posto libero",
                    ) +
                    (ctx.byId[id]?.ml ? " <small>ML</small>" : "") +
                    "</div>",
                )
                .join("") +
              "</div>";
          }
          return "<td>" + result + "</td>";
        }).join("") +
        "<td>" +
        Object.entries(ctx.ind[key] || {})
          .filter(([id]) => !off && ctx.byId[id]?.active !== false)
          .map(([id, c]) => escapeHTML(names[id] + " · " + c.join(",")))
          .join("<br>") +
        "</td></tr>"
      );
    })
    .join("");
  const issues = ctx.workDays.flatMap((k) => {
    const r = validateDay(ctx, k, month[k]);
    return [
      ...r.issues.map((i) => ({ key: k, message: i.code + ": " + i.message })),
      ...r.unplaced.map((u) => ({
        key: k,
        message:
          u.name +
          ": non assegnato — " +
          residualReason(ctx, k, u, month[k] || {}),
      })),
    ];
  });
  return (
    '<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Planning ' +
    MN[ctx.month] +
    " " +
    ctx.year +
    "</title><style>@page{size:A4 landscape;margin:7mm}body{font-family:Arial,sans-serif;color:#193547;margin:14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}h1{font-size:17px;margin:0 0 6px}p{font-size:10px}table{border-collapse:collapse;width:100%;table-layout:auto}thead{display:table-header-group}tr{break-inside:avoid}td,th{border:1px solid #d1dce3;padding:3px;vertical-align:top;font-size:7px;text-align:left}th{background:#edf2f5}.pair{border:1px solid;border-radius:3px;padding:2px;margin-bottom:2px;white-space:nowrap;line-height:1.4}.str{font-weight:bold}small{font-size:6px}.off{background:#f1f4f6;color:#a0afb8}.controls{margin:10px 0}button{padding:8px 12px}section{break-before:page;font-size:10px}section li{margin:5px 0}@media print{.controls{display:none}body{margin:0}}</style></head><body><h1>CML Catania · " +
    MN[ctx.month] +
    " " +
    ctx.year +
    "</h1><p>Grassetto: strutturato · ML: medico legale · Generato il " +
    new Date().toLocaleDateString("it-IT") +
    '</p><div class="controls"><button onclick="window.print()">Stampa / Salva PDF</button></div><table><thead><tr><th>Giorno</th>' +
    OPD.map(
      (a) =>
        "<th>" + escapeHTML(a.code === "VALID" ? "ATTI" : a.label) + "</th>",
    ).join("") +
    "<th>Indisponibilità</th></tr></thead><tbody>" +
    rows +
    "</tbody></table>" +
    (issues.length
      ? "<section><h2>Controlli del planning</h2><ul>" +
        issues
          .map((i) => "<li>" + escapeHTML(i.key + " · " + i.message) + "</li>")
          .join("") +
        "</ul></section>"
      : "") +
    (ctx.state.ntA[ctx.mk]
      ? "<section><h2>Note</h2><p>" +
        escapeHTML(ctx.state.ntA[ctx.mk]).replace(/\n/g, "<br>") +
        "</p></section>"
      : "") +
    "</body></html>"
  );
}
function PresidentSettings({ ctx, dayKey, code, onOverride }) {
  const cic = code === "CIC",
    selected = cic ? cicExceptions(ctx, dayKey) : presidents(ctx, dayKey);
  const candidates = ctx.state.users
    .filter((u) => u.active !== false && !u.vo && (!cic || !u.ml))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <details style={{ marginTop: 12 }}>
      <summary className="button-link small" style={{ cursor: "pointer" }}>
        {cic
          ? "Deroga presidente CIC non-ML"
          : "Presidenti Ciechi per questa giornata"}
        {selected.length
          ? " · " +
            selected.length +
            (selected.length === 1 ? " nome" : " nomi")
          : ""}
      </summary>
      <p className="settings-note">
        {cic
          ? "Il primo posto della coppia è il presidente: di base un ML. I non-ML selezionati possono presiedere solo oggi, anche con un altro non-ML come membro. La scelta del requisito di esperienza resta a chi prepara i turni."
          : "Questo elenco sostituisce le abilitazioni abituali solo per oggi. Il primo posto della coppia è il presidente."}
      </p>
      {!cic && (
        <label className="check-label" style={{ marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={!!ctx.overrides[dayKey]?.CIECHI?.allowMlPair}
            onChange={(e) =>
              onOverride(dayKey, code, { allowMlPair: e.target.checked })
            }
          />
          Consenti anche coppie ML + ML solo per questa giornata
        </label>
      )}
      <div
        className="person-list"
        style={{ maxHeight: 180, overflow: "auto", padding: 4 }}
      >
        {candidates.map((u) => (
          <label className="check-label" key={u.id}>
            <input
              type="checkbox"
              checked={selected.includes(u.id)}
              onChange={(e) =>
                onOverride(dayKey, code, {
                  presidents: e.target.checked
                    ? unique([...selected, u.id])
                    : selected.filter((id) => id !== u.id),
                })
              }
            />
            {u.name}
            {ctx.ind[dayKey]?.[u.id]
              ? " · " + ctx.ind[dayKey][u.id].join(", ")
              : ""}
          </label>
        ))}
      </div>
      <button
        className="button-link small"
        style={{ marginTop: 10 }}
        onClick={() => onOverride(dayKey, code, { presidents: undefined })}
      >
        {cic
          ? "Rimuovi tutte le deroghe del giorno"
          : "Ripristina presidenti abituali"}
      </button>
    </details>
  );
}
function AvailabilityView({ ctx, onChange }) {
  const people = ctx.state.users
    .filter((u) => u.active !== false)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const [selected, setSelected] = useState(people[0]?.id || ""),
    [from, setFrom] = useState(ctx.workDays[0] || ""),
    [to, setTo] = useState(ctx.workDays[0] || ""),
    [bulk, setBulk] = useState("FER");
  const user = ctx.byId[selected] || people[0];
  if (!user)
    return (
      <div className="panel">
        Aggiungi un operatore per configurare la disponibilità.
      </div>
    );
  const update = (field, key, value) => {
    const state = ctx.state,
      month = state[field][ctx.mk] || {},
      day = { ...month[key] };
    if (value === undefined || (Array.isArray(value) && !value.length))
      delete day[user.id];
    else day[user.id] = value;
    onChange(
      {
        ...state,
        [field]: { ...state[field], [ctx.mk]: { ...month, [key]: day } },
      },
      true,
    );
  };
  const applyBulk = () => {
    const state = ctx.state,
      month = clone(state.exA[ctx.mk] || {});
    for (const key of ctx.workDays)
      if (key >= from && key <= to) {
        month[key] ||= {};
        if (bulk === "CLEAR") delete month[key][user.id];
        else month[key][user.id] = [bulk];
      }
    onChange({ ...state, exA: { ...state.exA, [ctx.mk]: month } }, true);
  };
  return (
    <>
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Disponibilità · {MN[ctx.month]}</h2>
            <p className="muted small">
              Le assenze liberano i posti nel planning. Le coppie VDOM e PU
              vengono rimosse per intero.
            </p>
          </div>
        </div>
        <div className="form-grid">
          <label className="field">
            Operatore
            <select
              value={user.id}
              onChange={(e) => setSelected(e.target.value)}
            >
              {people.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                  {u.vo ? " · solo domiciliari" : ""}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span>Profilo abituale</span>
            <span className="muted" style={{ paddingTop: 10 }}>
              {user.ct} ·{" "}
              {user.wd.map((n) => WDS.find((w) => w.n === n)?.l).join(", ")}
              {user.swDay
                ? " · SW " + WDS.find((w) => w.n === user.swDay)?.l
                : ""}
            </span>
          </div>
        </div>
        <div className="date-range" style={{ marginTop: 22 }}>
          <label className="field">
            Dal
            <input
              type="date"
              value={from}
              min={ctx.days[0]}
              max={ctx.days.at(-1)}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="field">
            Al
            <input
              type="date"
              value={to}
              min={from || ctx.days[0]}
              max={ctx.days.at(-1)}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <label className="field">
            Operazione
            <select value={bulk} onChange={(e) => setBulk(e.target.value)}>
              <option value="FER">Ferie</option>
              <option value="EST">Attività esterna</option>
              <option value="CLEAR">Rimuovi FER / EST</option>
            </select>
          </label>
          <Button
            onClick={applyBulk}
            disabled={!from || !to || from > to}
            primary
          >
            Applica all’intervallo
          </Button>
        </div>
        <div className="data-scroll" style={{ marginTop: 20, maxHeight: 440 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Giorno</th>
                <th>Stato effettivo</th>
                <th>Lavoro</th>
                <th>Smart working</th>
                <th>Ferie</th>
                <th>Att. esterna</th>
              </tr>
            </thead>
            <tbody>
              {ctx.workDays.map((key) => {
                const ex = ctx.state.exA[ctx.mk]?.[key]?.[user.id] || [],
                  wd = ctx.state.wdE[ctx.mk]?.[key]?.[user.id] || "",
                  sw = ctx.state.swE[ctx.mk]?.[key]?.[user.id] || "",
                  d = Number(key.slice(-2));
                return (
                  <tr key={key}>
                    <td>
                      {dn(ctx.year, ctx.month, d)} {d}
                    </td>
                    <td>
                      <span
                        className={
                          ctx.ind[key][user.id] ? "conflict-tag" : "muted"
                        }
                      >
                        {ctx.ind[key][user.id]?.join(", ") || "Disponibile"}
                      </span>
                    </td>
                    <td>
                      <select
                        aria-label={"Lavoro del " + d}
                        value={wd}
                        onChange={(e) =>
                          update("wdE", key, e.target.value || undefined)
                        }
                      >
                        <option value="">Da profilo</option>
                        <option value="ON">Lavora (extra)</option>
                        <option value="OFF">Non lavora</option>
                      </select>
                    </td>
                    <td>
                      <select
                        aria-label={"Smart working del " + d}
                        value={sw}
                        onChange={(e) =>
                          update("swE", key, e.target.value || undefined)
                        }
                      >
                        <option value="">Da profilo</option>
                        <option value="SW">In SW</option>
                        <option value="NO">In presenza</option>
                      </select>
                    </td>
                    {["FER", "EST"].map((code) => (
                      <td key={code}>
                        <input
                          type="checkbox"
                          aria-label={
                            (code === "FER" ? "Ferie" : "Attività esterna") +
                            " del " +
                            d
                          }
                          checked={ex.includes(code)}
                          onChange={(e) =>
                            update(
                              "exA",
                              key,
                              e.target.checked
                                ? unique([...ex, code])
                                : ex.filter((c) => c !== code),
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <h3>Panoramica del mese</h3>
        <p className="muted small">
          Clicca sul nome per aprire la disponibilità dell’operatore.
        </p>
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operatore</th>
                {ctx.workDays.map((k) => (
                  <th key={k}>{Number(k.slice(-2))}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((u) => (
                <tr key={u.id}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button
                      className="button-link"
                      onClick={() => setSelected(u.id)}
                    >
                      {u.name}
                    </button>
                  </td>
                  {ctx.workDays.map((k) => {
                    const codes = ctx.ind[k][u.id] || [];
                    return (
                      <td
                        key={k}
                        className="number"
                        style={{
                          fontSize: 10,
                          padding: "7px 5px",
                          background: codes.includes("SW")
                            ? "#edf4fd"
                            : codes.includes("FER")
                              ? "#fff5de"
                              : codes.includes("EST")
                                ? "#e8f5ec"
                                : codes.length
                                  ? "#f0f3f5"
                                  : "",
                        }}
                      >
                        {codes.join("/") || "·"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
function UsersView({ ctx, onChange }) {
  const [search, setSearch] = useState(""),
    [editing, setEditing] = useState(null),
    [draft, setDraft] = useState(null),
    [error, setError] = useState("");
  const open = (u) => {
    setDraft(clone(u));
    setEditing(u.id);
    setError("");
  };
  const save = () => {
    if (!draft.name.trim()) {
      setError("Inserisci il nome dell’operatore.");
      return;
    }
    if (
      ctx.state.users.some(
        (u) =>
          u.id !== draft.id &&
          u.name.trim().toLowerCase() === draft.name.trim().toLowerCase(),
      )
    ) {
      setError("Questo nome è già presente.");
      return;
    }
    const next = { ...draft, name: draft.name.trim() };
    const users =
      editing === "new"
        ? [...ctx.state.users, next]
        : ctx.state.users.map((u) => (u.id === next.id ? next : u));
    onChange({ ...ctx.state, users }, true);
    setEditing(null);
  };
  const people = ctx.state.users
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Operatori</h2>
            <p className="muted small">
              Profili, giorni abituali e abilitazioni alla presidenza Ciechi.
            </p>
          </div>
          <Button
            icon="plus"
            primary
            onClick={() => {
              setEditing("new");
              setDraft({
                ...mU(
                  "",
                  false,
                  "STR",
                  false,
                  false,
                  [1, 2, 3, 4, 5],
                  null,
                  false,
                ),
                active: true,
              });
              setError("");
            }}
          >
            Nuovo operatore
          </Button>
        </div>
        <label className="field" style={{ maxWidth: 350 }}>
          Cerca
          <input
            placeholder="Cognome o nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="data-scroll" style={{ marginTop: 18 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Operatore</th>
                <th>Qualifica</th>
                <th>Contratto</th>
                <th>Giorni</th>
                <th>SW</th>
                <th>Abilitazioni</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {people.map((u) => (
                <tr
                  key={u.id}
                  style={{ opacity: u.active === false ? 0.55 : 1 }}
                >
                  <td>
                    {u.name}
                    {u.active === false && (
                      <div className="small muted">Disattivato</div>
                    )}
                  </td>
                  <td>
                    {u.ml
                      ? "Medico legale"
                      : NPI_NAMES.includes(u.name)
                        ? "Neuropsichiatra infantile"
                        : "Non-ML"}
                  </td>
                  <td>{u.ct}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {u.wd.map((d) => WDS.find((w) => w.n === d)?.l).join(" · ")}
                  </td>
                  <td>{WDS.find((w) => w.n === u.swDay)?.l || "—"}</td>
                  <td>
                    {u.vo ? (
                      <ActivityTag code="VDOM" />
                    ) : (
                      <div className="members-chips">
                        {u.e222 && <ActivityTag code="222" />}
                        {u.eCi && (
                          <span
                            className="activity-tag"
                            style={{
                              background: COL.CIECHI.bg,
                              color: COL.CIECHI.tx,
                            }}
                          >
                            Pres. Ciechi
                          </span>
                        )}
                        {NPI_NAMES.includes(u.name) && (
                          <ActivityTag code="NICMIN" />
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <Button onClick={() => open(u)}>Modifica</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editing && draft && (
        <Dialog
          title={editing === "new" ? "Nuovo operatore" : draft.name}
          onClose={() => setEditing(null)}
        >
          {error && (
            <div className="issue error" role="alert">
              {error}
            </div>
          )}
          <div className="form-grid">
            <label className="field">
              Cognome e nome
              <input
                value={draft.name}
                disabled={
                  editing !== "new" &&
                  (VDOM_PAIRS.flat().includes(draft.name) ||
                    PU_NAMES.includes(draft.name) ||
                    NPI_NAMES.includes(draft.name))
                }
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="field">
              Contratto
              <select
                value={draft.ct}
                onChange={(e) => setDraft({ ...draft, ct: e.target.value })}
              >
                <option>STR</option>
                <option>ACN</option>
              </select>
            </label>
          </div>
          <div className="form-row" style={{ margin: "20px 0" }}>
            <label className="check-label">
              <input
                type="checkbox"
                checked={draft.ml}
                onChange={(e) => setDraft({ ...draft, ml: e.target.checked })}
              />
              Medico legale
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={draft.active !== false}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.checked })
                }
              />
              Attivo
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={draft.vo}
                onChange={(e) => setDraft({ ...draft, vo: e.target.checked })}
              />
              Solo domiciliari
            </label>
          </div>
          <label className="field">Giorni lavorativi abituali</label>
          <div className="form-row" style={{ marginTop: 8 }}>
            {WDS.map((w) => (
              <label className="check-label" key={w.n}>
                <input
                  type="checkbox"
                  checked={draft.wd.includes(w.n)}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      wd: e.target.checked
                        ? unique([...draft.wd, w.n]).sort()
                        : draft.wd.filter((d) => d !== w.n),
                    })
                  }
                />
                {w.l}
              </label>
            ))}
          </div>
          <div className="form-grid" style={{ marginTop: 20 }}>
            <label className="field">
              SW abituale
              <select
                value={draft.swDay || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    swDay: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">Nessuno</option>
                {WDS.map((w) => (
                  <option key={w.n} value={w.n}>
                    {w.l}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row" style={{ marginTop: 20 }}>
            <label className="check-label">
              <input
                type="checkbox"
                disabled={draft.vo}
                checked={draft.e222}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    e222: e.target.checked,
                    as: {
                      ...draft.as,
                      222: {
                        ...draft.as["222"],
                        al: e.target.checked,
                        w: draft.as["222"]?.w || 1,
                      },
                    },
                  })
                }
              />
              Abilitato 222
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                disabled={draft.vo}
                checked={draft.eCi}
                onChange={(e) => setDraft({ ...draft, eCi: e.target.checked })}
              />
              Presidente Ciechi abituale
            </label>
          </div>
          <p className="settings-note">
            Disattivare un operatore conserva il suo nome nei mesi già salvati.
            Le deroghe CIC si impostano nella singola giornata.
          </p>
          <div className="dialog-actions">
            <Button onClick={() => setEditing(null)}>Annulla</Button>
            <Button primary onClick={save}>
              Salva profilo
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
function SlotsView({ ctx, onChange, onOverride, onDay }) {
  const [bulkCode, setBulkCode] = useState("CIECHI"),
    [bulkDow, setBulkDow] = useState("all"),
    [bulkAction, setBulkAction] = useState("on");
  const apply = () => {
    const month = clone(ctx.state.ovA[ctx.mk] || {});
    for (const key of ctx.workDays) {
      const dow = new Date(key + "T12:00:00").getDay();
      if (bulkDow !== "all" && Number(bulkDow) !== dow) continue;
      if (AC[bulkCode].dows && !AC[bulkCode].dows.includes(dow)) continue;
      month[key] ||= {};
      month[key][bulkCode] = {
        ...month[key][bulkCode],
        enabled: bulkAction === "on",
      };
    }
    onChange({ ...ctx.state, ovA: { ...ctx.state.ovA, [ctx.mk]: month } });
  };
  return (
    <>
      <div className="panel">
        <h2>Slot abituali</h2>
        <p className="muted small">
          Numero di coppie per commissione; numero di operatori per 222. Il
          valore 0 viene conservato anche nei backup.
        </p>
        <div className="form-grid">
          {FIX.map((a) => (
            <label className="field" key={a.code}>
              <span>
                <ActivityTag code={a.code} /> {a.label}
              </span>
              <input
                type="number"
                min="0"
                max="20"
                value={ctx.state.gS[a.code]}
                onChange={(e) =>
                  onChange({
                    ...ctx.state,
                    gS: {
                      ...ctx.state.gS,
                      [a.code]: bounded(e.target.value, 0, 0, 20),
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>Attivazione per più giornate</h3>
        <div className="date-range" style={{ marginTop: 14 }}>
          <label className="field">
            Attività
            <select
              value={bulkCode}
              onChange={(e) => setBulkCode(e.target.value)}
            >
              {FIX.map((a) => (
                <option value={a.code} key={a.code}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Giornate
            <select
              value={bulkDow}
              onChange={(e) => setBulkDow(e.target.value)}
            >
              <option value="all">Tutto il mese</option>
              {WDS.map((w) => (
                <option key={w.n} value={w.n}>
                  {w.l}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Operazione
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="on">Attiva</option>
              <option value="off">Disattiva</option>
            </select>
          </label>
          <Button primary onClick={apply}>
            Applica
          </Button>
        </div>
        <p className="settings-note">
          Ciechi, CIC Noto e CIC/VD SR restano spente finché non vengono
          attivate. Le trasferte rispettano il vincolo lunedì–giovedì.
        </p>
      </div>
      <div className="panel">
        <h3>Eccezioni di {MN[ctx.month]}</h3>
        <p className="muted small">
          Spunta: attività attiva. Numero: slot specifici del giorno. Campo
          vuoto: usa il valore abituale.
        </p>
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Giorno</th>
                {FIX.map((a) => (
                  <th key={a.code}>
                    <ActivityTag code={a.code} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ctx.workDays.map((key) => (
                <tr key={key}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button className="button-link" onClick={() => onDay(key)}>
                      {dn(ctx.year, ctx.month, Number(key.slice(-2)))}{" "}
                      {Number(key.slice(-2))}
                    </button>
                  </td>
                  {FIX.map((a) => {
                    const block =
                      a.dows &&
                      !a.dows.includes(new Date(key + "T12:00:00").getDay());
                    return (
                      <td key={a.code}>
                        {block ? (
                          <span className="muted">—</span>
                        ) : (
                          <div
                            className="form-row"
                            style={{ gap: 6, flexWrap: "nowrap" }}
                          >
                            <input
                              type="checkbox"
                              aria-label={
                                "Attiva " +
                                a.label +
                                " del " +
                                Number(key.slice(-2))
                              }
                              checked={isEnabled(ctx, key, a.code)}
                              onChange={(e) =>
                                onOverride(key, a.code, {
                                  enabled: e.target.checked,
                                })
                              }
                            />
                            <input
                              type="number"
                              min="0"
                              max="20"
                              style={{ width: 53, fontSize: 12 }}
                              aria-label={
                                "Slot " +
                                a.label +
                                " del " +
                                Number(key.slice(-2))
                              }
                              placeholder={String(ctx.state.gS[a.code])}
                              value={ctx.overrides[key]?.[a.code]?.slots ?? ""}
                              onChange={(e) =>
                                onOverride(key, a.code, {
                                  slots:
                                    e.target.value === ""
                                      ? undefined
                                      : bounded(e.target.value, 0, 0, 20),
                                })
                              }
                            />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
function RulesView({ ctx, onChange }) {
  const people = ctx.state.users
      .filter((u) => !u.vo && u.active !== false)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name)),
    [selected, setSelected] = useState(people[0]?.id || "");
  const user = ctx.byId[selected] || people[0];
  if (!user) return null;
  const update = (code, patch) =>
    onChange({
      ...ctx.state,
      users: ctx.state.users.map((u) =>
        u.id === user.id
          ? { ...u, as: { ...u.as, [code]: { ...u.as[code], ...patch } } }
          : u,
      ),
    });
  return (
    <div className="panel">
      <h2>Abilitazioni e preferenze</h2>
      <p className="muted small">
        Le abilitazioni sono vincoli. Le preferenze 1–3 orientano la scelta dopo
        il bilanciamento. Peso 0 significa “non assegnare”.
      </p>
      <label className="field" style={{ maxWidth: 350 }}>
        Operatore
        <select value={user.id} onChange={(e) => setSelected(e.target.value)}>
          {people.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>
      <div className="data-scroll" style={{ marginTop: 22 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Attività</th>
              <th>Abilitato</th>
              <th>Preferenza</th>
              <th>Criterio</th>
            </tr>
          </thead>
          <tbody>
            {OPD.map((a) => (
              <tr key={a.code}>
                <td>
                  <ActivityTag code={a.code} />{" "}
                  <span className="small muted">{a.label}</span>
                </td>
                <td>
                  {FIXED_PAIR.has(a.code) ? (
                    <span className="small muted">Da coppia fissa</span>
                  ) : (
                    <input
                      type="checkbox"
                      aria-label={"Abilita " + a.label}
                      disabled={a.code === "222" && !user.e222}
                      checked={user.as[a.code]?.al || false}
                      onChange={(e) => update(a.code, { al: e.target.checked })}
                    />
                  )}
                </td>
                <td>
                  {FIXED_PAIR.has(a.code) ? (
                    "—"
                  ) : (
                    <select
                      className="rule-weight"
                      aria-label={"Preferenza " + a.label}
                      value={user.as[a.code]?.w ?? 1}
                      onChange={(e) =>
                        update(a.code, { w: Number(e.target.value) })
                      }
                    >
                      <option value="0">0 · Non assegnare</option>
                      <option value="1">1 · Neutra</option>
                      <option value="2">2 · Preferita</option>
                      <option value="3">3 · Alta</option>
                    </select>
                  )}
                </td>
                <td className="small muted">
                  {HEAVY.has(a.code)
                    ? "Carico visite più elevato"
                    : a.code === "NIC" || a.code === "NICSP"
                      ? "Carico visite più leggero"
                      : a.code === "NICMIN"
                        ? "Presidente ML + NPI"
                        : a.code === "VALID"
                          ? "Residui, solo se abilitati"
                          : a.code === "CIECHI"
                            ? "Presidente abilitato abituale o del giorno"
                            : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function ConstraintsView({ ctx, onChange }) {
  const people = ctx.state.users
      .filter((u) => u.active !== false)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name)),
    [a, setA] = useState(""),
    [b, setB] = useState(""),
    [uid, setUid] = useState(people[0]?.id || ""),
    [dow, setDow] = useState("1");
  const add = () => {
    if (
      !a ||
      !b ||
      a === b ||
      ctx.state.inc.some((p) => pairKey(p) === pairKey([a, b]))
    )
      return;
    onChange({ ...ctx.state, inc: [...ctx.state.inc, [a, b]] });
    setA("");
    setB("");
  };
  const list = ctx.state.dR[uid]?.[dow] || [];
  const setAllowed = (codes) => {
    const dr = clone(ctx.state.dR);
    dr[uid] ||= {};
    if (codes.length) dr[uid][dow] = codes;
    else delete dr[uid][dow];
    onChange({ ...ctx.state, dR: dr });
  };
  return (
    <>
      <div className="panel">
        <h2>Incompatibilità nella giornata</h2>
        <p className="muted small">
          Le due persone non possono essere assegnate nello stesso giorno, anche
          ad attività differenti. Se sono entrambe presenti, una potrà restare
          non assegnata con una segnalazione.
        </p>
        <div className="date-range">
          <label className="field">
            Primo operatore
            <select value={a} onChange={(e) => setA(e.target.value)}>
              <option value="">Seleziona…</option>
              {people.map((u) => (
                <option value={u.id} key={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Secondo operatore
            <select value={b} onChange={(e) => setB(e.target.value)}>
              <option value="">Seleziona…</option>
              {people
                .filter((u) => u.id !== a)
                .map((u) => (
                  <option value={u.id} key={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </label>
          <Button primary onClick={add} disabled={!a || !b || a === b}>
            Aggiungi vincolo
          </Button>
        </div>
        <div className="person-list" style={{ marginTop: 20 }}>
          {ctx.state.inc.map((pair, i) => (
            <div
              className="person-line form-row"
              key={pairKey(pair)}
              style={{ justifyContent: "space-between" }}
            >
              <span>
                {pair.map((id) => ctx.byId[id]?.name || id).join(" ↔ ")}
              </span>
              <Button
                onClick={() =>
                  onChange({
                    ...ctx.state,
                    inc: ctx.state.inc.filter((_, j) => i !== j),
                  })
                }
              >
                Rimuovi vincolo
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>Attività consentite per giorno della settimana</h3>
        <p className="muted small">
          Quando selezioni almeno un’attività, solo quelle selezionate sono
          consentite. Nessuna selezione significa nessuna restrizione
          aggiuntiva.
        </p>
        <div className="form-row">
          <label className="field">
            Operatore
            <select value={uid} onChange={(e) => setUid(e.target.value)}>
              {people.map((u) => (
                <option value={u.id} key={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Giorno
            <select value={dow} onChange={(e) => setDow(e.target.value)}>
              {WDS.map((w) => (
                <option key={w.n} value={w.n}>
                  {w.l}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="members-chips" style={{ marginTop: 20 }}>
          {OPD.map((act) => (
            <label
              className="check-label"
              style={{
                padding: 8,
                border: "1px solid #e0e8ed",
                borderRadius: 7,
              }}
              key={act.code}
            >
              <input
                type="checkbox"
                checked={list.includes(act.code)}
                onChange={(e) =>
                  setAllowed(
                    e.target.checked
                      ? [...list, act.code]
                      : list.filter((c) => c !== act.code),
                  )
                }
              />
              <ActivityTag code={act.code} />
            </label>
          ))}
        </div>
        <div className="person-list" style={{ marginTop: 22 }}>
          {Object.entries(ctx.state.dR).flatMap(([id, days]) =>
            Object.entries(days)
              .filter(([, codes]) => codes.length)
              .map(([w, codes]) => (
                <div className="person-line" key={id + w}>
                  {ctx.byId[id]?.name} · {WDS.find((d) => String(d.n) === w)?.l}
                  <small>
                    {codes.map((c) => (c === "VALID" ? "ATTI" : c)).join(", ")}
                  </small>
                </div>
              )),
          )}
        </div>
      </div>
      <div className="panel">
        <h3>Coppie fisse</h3>
        <p className="muted small">
          Domiciliari: un’uscita al mese per coppia, mai venerdì. PU: due uscite
          al mese. Sono ammesse coppie ML + ML.
        </p>
        <div className="person-list">
          {ctx.vdom.map((p) => (
            <div className="person-line" key={pairKey(p)}>
              <ActivityTag code="VDOM" />{" "}
              {p.map((id) => ctx.byId[id]?.name).join(" + ")}
            </div>
          ))}
          {ctx.pu.length === 2 && (
            <div className="person-line">
              <ActivityTag code="PU" />{" "}
              {ctx.pu.map((id) => ctx.byId[id]?.name).join(" + ")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
const INITIAL_NAV = [
  { id: "planning", name: "Planning", icon: "calendar" },
  { id: "availability", name: "Disponibilità", icon: "users" },
  { id: "slots", name: "Attività e slot", icon: "sliders" },
  { id: "users", name: "Utenti", icon: "users" },
  { id: "rules", name: "Regole", icon: "sliders" },
  { id: "constraints", name: "Vincoli", icon: "shield" },
  { id: "stats", name: "Riepilogo", icon: "chart" },
  { id: "archive", name: "Archivio", icon: "folder" },
];
export default function App({ archiveStore }) {
  const store = useMemo(() => archiveStore || localArchive(), [archiveStore]),
    archive = useArchive(store),
    data = archive.data;
  const [date, setDate] = useState(() => ({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    })),
    [tab, setTab] = useState("planning"),
    [mode, setMode] = useState("month"),
    [week, setWeek] = useState(""),
    [compact, setCompact] = useState(false),
    [selected, setSelected] = useState(null),
    [edit, setEdit] = useState(null),
    [dialog, setDialog] = useState(null),
    [toast, setToast] = useState(null),
    [busy, setBusy] = useState(false),
    [seed, setSeed] = useState(""),
    [history, setHistory] = useState({});
  const ctx = useMemo(
      () => (data ? createContext(data, date.year, date.month) : null),
      [data, date],
    ),
    month = ctx ? data.asA[ctx.mk] || {} : {},
    fileRef = useRef(null),
    dataRef = useRef(data);
  dataRef.current = data;
  const notify = (message, error = false) => setToast({ message, error });
  useEffect(() => {
    setHistory({});
    setEdit(null);
    setSelected(null);
  }, [archive.epoch]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (ctx) {
      setSeed(data.seeds[ctx.mk] || ctx.mk);
      setWeek(unique(ctx.workDays.map(weekKey))[0] || "");
      setSelected(null);
      setEdit(null);
    }
  }, [date.year, date.month, !!data]);
  const commit = (next, clean = false) => {
    if (clean && ctx) {
      const nc = createContext(next, date.year, date.month);
      next = {
        ...next,
        asA: {
          ...next.asA,
          [ctx.mk]: cleanAvailability(nc, next.asA[ctx.mk] || {}),
        },
      };
    }
    archive.setData(next);
  };
  const saveMonth = (next, label) => {
    const current = dataRef.current,
      old = current.asA[ctx.mk] || {};
    if (JSON.stringify(old) === JSON.stringify(next)) return;
    setHistory((h) => {
      const s = h[ctx.mk] || { past: [], future: [] };
      return {
        ...h,
        [ctx.mk]: {
          past: [...s.past, { month: clone(old), label }].slice(-10),
          future: [],
        },
      };
    });
    archive.setData({ ...current, asA: { ...current.asA, [ctx.mk]: next } });
  };
  const undo = (direction) => {
    const h = history[ctx.mk] || { past: [], future: [] },
      from = direction === "undo" ? h.past : h.future;
    if (!from.length) return;
    const item = from[from.length - 1],
      cleaned = cleanAvailability(ctx, item.month),
      restored = {};
    for (const k of Object.keys(cleaned))
      restored[k] = ctx.workDays.includes(k)
        ? cleanExisting(ctx, k, cleaned[k])
        : cleaned[k];
    setHistory((all) => ({
      ...all,
      [ctx.mk]:
        direction === "undo"
          ? {
              past: h.past.slice(0, -1),
              future: [...h.future, { month: clone(month), label: item.label }],
            }
          : {
              past: [
                ...h.past,
                { month: clone(month), label: item.label },
              ].slice(-10),
              future: h.future.slice(0, -1),
            },
    }));
    archive.setData({ ...data, asA: { ...data.asA, [ctx.mk]: restored } });
    notify(
      (direction === "undo" ? "Annullato: " : "Ripristinato: ") + item.label,
    );
  };
  useEffect(() => {
    const fn = (e) => {
      if (
        !ctx ||
        !((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") ||
        /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)
      )
        return;
      e.preventDefault();
      undo(e.shiftKey ? "redo" : "undo");
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [history, ctx, month]);
  const manual = (op) => {
    const next = applyManual(ctx, month, op);
    saveMonth(next, "modifica assegnazione");
  };
  const override = (key, code, patch) => {
    const previous = data.ovA[ctx.mk] || {},
      day = previous[key] || {},
      v = { ...day[code], ...patch };
    Object.keys(v).forEach((k) => {
      if (v[k] === undefined) delete v[k];
    });
    commit({
      ...data,
      ovA: {
        ...data.ovA,
        [ctx.mk]: { ...previous, [key]: { ...day, [code]: v } },
      },
    });
  };
  const runGeneration = () => {
    setDialog(null);
    setBusy(true);
    setTimeout(() => {
      try {
        const result = generateMonth(ctx, {
          seed,
          attempts: 20,
          current: month,
        });
        saveMonth(result.asg, "generazione del mese");
        const current = dataRef.current;
        archive.setData({
          ...current,
          asA: { ...current.asA, [ctx.mk]: result.asg },
          seeds: { ...current.seeds, [ctx.mk]: seed },
        });
        notify("Planning generato: confrontate 20 distribuzioni possibili.");
      } catch (e) {
        notify(e.message, true);
      } finally {
        setBusy(false);
      }
    }, 40);
  };
  const repair = (key) => {
    const next = repairDay(ctx, key, month);
    saveMonth(next, "riparazione del " + Number(key.slice(-2)));
    notify("Giornata aggiornata conservando le assegnazioni compatibili.");
  };
  const importFile = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      if (f.size > 10 * 1024 * 1024) throw new Error("Il file supera 10 MB.");
      const parsed = sanitizeState(JSON.parse(await f.text()));
      setDialog({ type: "import", data: parsed });
    } catch (err) {
      notify(err.message, true);
    }
  };
  const goMonth = (delta) => {
    const d = new Date(date.year, date.month + delta, 1);
    setDate({ year: d.getFullYear(), month: d.getMonth() });
  };
  if (!data)
    return (
      <div className="cml-app" style={{ display: "block", padding: 40 }}>
        <style>{CSS}</style>
        {archive.status === "load-error" ? (
          <div className="panel">
            <h2>Recupera il tuo archivio</h2>
            <p>{archive.error}</p>
            <input
              type="file"
              accept=".json"
              aria-label="Importa backup di recupero"
              onChange={async (e) => {
                try {
                  const f = e.target.files?.[0];
                  if (f) {
                    const next = sanitizeState(JSON.parse(await f.text()));
                    const original = localStorage.getItem(STORAGE_KEY);
                    if (original)
                      downloadFile("CML_memoria_da_recuperare.json", original);
                    localStorage.removeItem(STORAGE_KEY);
                    archive.setData(next);
                  }
                } catch (err) {
                  notify(err.message, true);
                }
              }}
            />
          </div>
        ) : (
          <div className="busy">
            <span className="spinner" />
            Apertura dell’archivio…
          </div>
        )}
        {toast && (
          <div className="cml-toast error" role="alert">
            {toast.message}
          </div>
        )}
      </div>
    );
  const generated = Object.keys(month).length > 0,
    reports = generated
      ? ctx.workDays.map((k) => validateDay(ctx, k, month[k]))
      : [],
    problems = reports.filter(
      (r) => r.issues.length || r.unplaced.length,
    ).length,
    unplaced = reports.reduce((n, r) => n + r.unplaced.length, 0),
    hist = history[ctx.mk] || { past: [], future: [] },
    weeks = unique(ctx.workDays.map(weekKey));
  return (
    <div className="cml-app">
      <style>{CSS}</style>
      <aside className="cml-sidebar">
        <div className="cml-brand">
          <div className="cml-brand-mark">+</div>
          <div>
            <strong>CML Catania</strong>
            <small>PLANNING</small>
          </div>
        </div>
        <div>
          <div className="nav-label">SPAZIO DI LAVORO</div>
          <nav className="cml-nav" aria-label="Navigazione principale">
            {INITIAL_NAV.map((n) => (
              <button
                key={n.id}
                className={tab === n.id ? "active" : ""}
                aria-current={tab === n.id ? "page" : undefined}
                title={n.name}
                onClick={() => setTab(n.id)}
              >
                <Icon name={n.icon} />
                <span>{n.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="nav-foot">
          <strong>Centro Medico Legale</strong>INPS · Catania
          <br />
          <span className="small">
            Versione 14 ·{" "}
            {store.shared ? "Archivio condiviso" : "Archivio locale"}
          </span>
        </div>
      </aside>
      <main className="cml-main">
        <div className="topline">
          <span className="eyebrow">Pianificazione del personale</span>
          <span
            className={
              "save-state " +
              (["save-error", "conflict"].includes(archive.status)
                ? "error"
                : "")
            }
          >
            <Icon
              name={
                archive.status === "saved"
                  ? "check"
                  : archive.status === "pending"
                    ? "refresh"
                    : "folder"
              }
              size={14}
            />
            {archive.status === "saved"
              ? store.shared
                ? "Salvato nell’archivio condiviso"
                : "Salvato su questo dispositivo"
              : archive.status === "pending"
                ? "Salvataggio…"
                : archive.status === "new"
                  ? "Nuovo archivio"
                  : archive.status === "conflict"
                    ? "Versione da confrontare"
                    : "Salvataggio non riuscito"}
          </span>
        </div>
        <header className="page-heading">
          <div className="month-heading">
            <h1>
              {tab === "planning"
                ? MN[date.month] + " " + date.year
                : INITIAL_NAV.find((n) => n.id === tab)?.name}
            </h1>
            <div className="month-nav">
              <button
                className="icon-button"
                aria-label="Mese precedente"
                onClick={() => goMonth(-1)}
              >
                <Icon name="left" size={15} />
              </button>
              <button
                className="icon-button"
                aria-label="Mese successivo"
                onClick={() => goMonth(1)}
              >
                <Icon name="right" size={15} />
              </button>
            </div>
          </div>
          <div className="toolbar-group">
            <Button icon="upload" onClick={() => fileRef.current.click()}>
              Importa
            </Button>
            <Button icon="download" onClick={() => exportArchive(data)}>
              Backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={importFile}
            />
          </div>
        </header>
        {archive.error && (
          <div className="banner error" role="alert">
            <span>{archive.error}</span>
            {archive.status === "conflict" ? (
              <Button
                onClick={() =>
                  archive.reload().catch((e) => notify(e.message, true))
                }
              >
                Scarica copia e ricarica
              </Button>
            ) : (
              <Button onClick={archive.retry}>Riprova salvataggio</Button>
            )}
          </div>
        )}
        {tab === "planning" && (
          <>
            <div className="toolbar">
              <div className="toolbar-group">
                <Button
                  icon="spark"
                  primary
                  disabled={busy}
                  onClick={() => setDialog({ type: "generate" })}
                >
                  {generated ? "Rigenera planning" : "Genera planning"}
                </Button>
                <button
                  className="icon-button"
                  aria-label="Annulla ultima modifica"
                  title={
                    hist.past.length
                      ? "Annulla · " + hist.past.at(-1).label
                      : "Nessuna modifica da annullare"
                  }
                  disabled={!hist.past.length || busy}
                  onClick={() => undo("undo")}
                >
                  <Icon name="undo" size={17} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Ripeti modifica"
                  disabled={!hist.future.length || busy}
                  onClick={() => undo("redo")}
                >
                  <Icon name="redo" size={17} />
                </button>
                <span className="muted small" style={{ marginLeft: 5 }}>
                  {hist.past.length
                    ? hist.past.length +
                      (hist.past.length === 1
                        ? " modifica annullabile"
                        : " modifiche annullabili")
                    : ""}
                </span>
              </div>
              <div className="toolbar-group">
                <div className="segmented" aria-label="Vista planning">
                  <button
                    className={mode === "month" ? "active" : ""}
                    onClick={() => setMode("month")}
                  >
                    Mese
                  </button>
                  <button
                    className={mode === "week" ? "active" : ""}
                    onClick={() => setMode("week")}
                  >
                    Settimana
                  </button>
                </div>
                {mode === "week" && (
                  <select
                    className="week-select"
                    aria-label="Settimana visualizzata"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                  >
                    {weeks.map((w) => (
                      <option key={w} value={w}>
                        Dal {Number(w.slice(-2))}/{Number(w.slice(5, 7))}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  className="icon-button"
                  title="Scarica planning stampabile"
                  aria-label="Stampa o salva PDF"
                  onClick={() =>
                    downloadFile(
                      "Planning_" + MN[date.month] + "_" + date.year + ".html",
                      printHTML(ctx, month),
                      "text/html;charset=utf-8",
                    )
                  }
                >
                  <Icon name="print" size={17} />
                </button>
              </div>
            </div>
            <div className="summary-strip">
              <span className="summary-stat">
                <b>{ctx.workDays.length}</b> giornate lavorative
              </span>
              <span className="summary-stat">
                <b>
                  {data.users.filter((u) => !u.vo && u.active !== false).length}
                </b>{" "}
                operatori in rotazione
              </span>
              <span className={"summary-stat " + (problems ? "warn" : "")}>
                <b>{generated ? problems : "—"}</b> giornate da verificare
              </span>
              <span className="summary-stat">
                <b>{generated ? unplaced : "—"}</b> presenze non assegnate
              </span>
            </div>
            {busy && (
              <div className="busy" style={{ marginBottom: 14 }}>
                <span className="spinner" />
                Confronto le distribuzioni di CIC, VD e delle altre attività…
              </div>
            )}
            <div className="grid-card">
              <div className="grid-intro">
                <strong>
                  Planning {mode === "month" ? "mensile" : "settimanale"}
                </strong>
                <span>
                  Clicca una data per verificare e riparare la giornata
                </span>
              </div>
              {!generated && (
                <div className="empty-planning">
                  <div>
                    <h3>Il mese è pronto da pianificare</h3>
                    <p>
                      Controlla disponibilità e slot, poi genera le
                      assegnazioni.
                    </p>
                  </div>
                  <Icon name="calendar" size={30} />
                </div>
              )}
              <MonthGrid
                ctx={ctx}
                month={month}
                mode={mode}
                week={week}
                selected={selected}
                onSelect={setSelected}
                onEdit={(key, code, index) => setEdit({ key, code, index })}
                onMove={(op) => {
                  try {
                    manual(op);
                  } catch (e) {
                    notify(e.message, true);
                  }
                }}
                onLock={(key, code) => {
                  const flags = data.locks[ctx.mk] || {};
                  commit({
                    ...data,
                    locks: {
                      ...data.locks,
                      [ctx.mk]: {
                        ...flags,
                        [key]: { ...flags[key], [code]: !flags[key]?.[code] },
                      },
                    },
                  });
                }}
                compact={compact}
              />
              <div className="grid-footer">
                <div className="legend">
                  <span>Grassetto: strutturato</span>
                  <span>ML: medico legale</span>
                  <span>Trascina per spostare o scambiare</span>
                </div>
                <label className="check-label small">
                  <input
                    type="checkbox"
                    checked={compact}
                    onChange={(e) => setCompact(e.target.checked)}
                  />
                  Vista compatta
                </label>
              </div>
            </div>
          </>
        )}
        {tab === "availability" && (
          <AvailabilityView key={ctx.mk} ctx={ctx} onChange={commit} />
        )}
        {tab === "users" && <UsersView ctx={ctx} onChange={commit} />}
        {tab === "slots" && (
          <SlotsView
            ctx={ctx}
            onChange={commit}
            onOverride={override}
            onDay={setSelected}
          />
        )}
        {tab === "rules" && <RulesView ctx={ctx} onChange={commit} />}
        {tab === "constraints" && (
          <ConstraintsView ctx={ctx} onChange={commit} />
        )}
        {tab === "stats" && <StatsView ctx={ctx} month={month} />}
        {tab === "archive" && (
          <div className="panel">
            <h2>Il tuo archivio</h2>
            <p className="muted">
              {store.shared
                ? "Le modifiche vengono salvate nell’archivio condiviso con controllo della versione."
                : "Le modifiche vengono salvate automaticamente in questo browser. Il backup JSON trasferisce l’archivio su un altro computer."}
            </p>
            <div className="form-row">
              <Button
                icon="download"
                primary
                onClick={() => exportArchive(data)}
              >
                Scarica backup JSON
              </Button>
              <Button icon="upload" onClick={() => fileRef.current.click()}>
                Importa archivio
              </Button>
              {!store.shared && (
                <Button
                  onClick={() => {
                    const b = localStorage.getItem(BACKUP_KEY);
                    if (b) downloadFile("CML_copia_recupero.json", b);
                    else notify("Non è ancora presente una copia di recupero.");
                  }}
                >
                  Copia di recupero
                </Button>
              )}
            </div>
            <p className="settings-note">
              Ultimo salvataggio:{" "}
              {archive.updatedAt
                ? new Date(archive.updatedAt).toLocaleString("it-IT")
                : "non ancora effettuato"}{" "}
              · {data.users.length} operatori · {Object.keys(data.asA).length}{" "}
              mesi
            </p>
            <hr
              style={{
                border: 0,
                borderTop: "1px solid #e3ebef",
                margin: "24px 0",
              }}
            />
            <h3>Lo stesso planning da casa e dalla sede</h3>
            <p className="muted">
              Vercel mantiene l’app online. Per sincronizzare i dati tra
              computer serve collegare un archivio condiviso con accessi
              personali. L’archivio condiviso non è ancora collegato: per
              passare il lavoro tra computer, usa il backup JSON e importa la
              copia più recente.
            </p>
            <h3 style={{ marginTop: 24 }}>Note del mese</h3>
            <textarea
              aria-label="Note del mese"
              style={{ marginTop: 12 }}
              value={data.ntA[ctx.mk] || ""}
              onChange={(e) =>
                commit({
                  ...data,
                  ntA: { ...data.ntA, [ctx.mk]: e.target.value },
                })
              }
            />
          </div>
        )}
        {selected && !edit && (
          <DayDetails
            ctx={ctx}
            month={month}
            dayKey={selected}
            onClose={() => setSelected(null)}
            onEdit={(key, code, index) => setEdit({ key, code, index })}
            onRepair={repair}
            onOverride={override}
          />
        )}
        {edit && (
          <AssignmentEditor
            key={edit.key + edit.code}
            ctx={ctx}
            month={month}
            edit={edit}
            onApply={manual}
            onOverride={override}
            onClose={() => setEdit(null)}
          />
        )}
        {dialog?.type === "generate" && (
          <Dialog
            title={generated ? "Rigenera il mese" : "Genera il planning"}
            onClose={() => setDialog(null)}
          >
            <p className="dialog-copy">
              Confronto 20 distribuzioni rispettando i vincoli e le celle
              bloccate. CIC e VD vengono bilanciate nella settimana e nel mese.
              La generazione può essere annullata.
            </p>
            <label className="field">
              Codice della variante
              <input
                value={seed}
                maxLength={100}
                onChange={(e) => setSeed(e.target.value)}
              />
            </label>
            <p className="settings-note">
              Con gli stessi dati e lo stesso codice ottieni lo stesso
              risultato.
            </p>
            <Button
              icon="refresh"
              onClick={() => setSeed(ctx.mk + "-" + Date.now().toString(36))}
            >
              Scegli nuova variante
            </Button>
            <div className="dialog-actions">
              <Button onClick={() => setDialog(null)}>Annulla</Button>
              <Button primary disabled={!seed.trim()} onClick={runGeneration}>
                Genera
              </Button>
            </div>
          </Dialog>
        )}
        {dialog?.type === "import" && (
          <Dialog title="Importa archivio CML" onClose={() => setDialog(null)}>
            <p className="dialog-copy">
              L’archivio contiene {dialog.data.users.length} operatori e{" "}
              {Object.keys(dialog.data.asA).length} mesi. Prima della
              sostituzione viene scaricato un backup dei dati attuali.
            </p>
            <div className="dialog-actions">
              <Button onClick={() => setDialog(null)}>Annulla</Button>
              <Button
                primary
                onClick={() => {
                  exportArchive(data);
                  archive.setData(dialog.data);
                  setHistory({});
                  setSelected(null);
                  setEdit(null);
                  setDialog(null);
                  notify("Archivio importato e verificato.");
                }}
              >
                Scarica copia e importa
              </Button>
            </div>
          </Dialog>
        )}
        {toast && (
          <div
            className={"cml-toast " + (toast.error ? "error" : "")}
            role={toast.error ? "alert" : "status"}
          >
            {toast.message}
          </div>
        )}
      </main>
    </div>
  );
}

export {
  defaultState,
  sanitizeState,
  createContext,
  availability,
  eligibilityReason,
  compositionReason,
  validateDay,
  cleanAvailability,
  cleanExisting,
  applyManual,
  generateMonth,
  repairDay,
  historyStats,
  quotaIssues,
  printHTML,
  seedRandom,
  ACT,
  VDOM_PAIRS,
};
