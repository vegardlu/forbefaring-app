"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  FileDown,
  Filter,
  Printer,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";

/**
 * NEXT.JS + TAILWIND CHECKLIST APP (single file)
 * --------------------------------------------------
 * Drop this file into `app/page.tsx` (App Router) or `pages/index.tsx` (Pages Router).
 * Tailwind required. Uses framer-motion + lucide-react (available in this environment).
 * All data stays in localStorage. Print-friendly via the Print button (or Ctrl/Cmd+P).
 */

// ---------- Types ----------

type Item = {
  id: string;
  title: string;
  details?: string;
  lawRef?: string; // e.g., "buofl. § 12"
  source?: string; // e.g., "Salgsoppgave / Kontrakt / Tilvalg"
  area: AreaKey;
  checked?: boolean;
  note?: string;
};

type AreaKey =
  | "UTE"
  | "ETG1"
  | "ETG2"
  | "ETG3"
  | "TEKNISK"
  | "DOK";

const AREA_LABELS: Record<AreaKey, string> = {
  UTE: "Uteområde / Plen",
  ETG1: "1. etasje",
  ETG2: "2. etasje (stue/kjøkken/balkong)",
  ETG3: "3. etasje (soverom/stue/bad/rømningsbalkong)",
  TEKNISK: "Tekniske anlegg",
  DOK: "Dokumentasjon & overlevering",
};

// ---------- Seed data (tilpasset Vidjeveien 4 – Hus 4) ----------
// Kildene er salgsoppgave/kontrakt/tilvalg dere har delt.

const SEED: Item[] = [
  // UTE
  {
    id: "ute-1",
    area: "UTE",
    title: "Ferdigplen lagt der egnet, jevnt underlag og fall fra grunnmur",
    source: "Salgsoppgave",
  },
  {
    id: "ute-2",
    area: "UTE",
    title: "Innkjøring/parkering singlet. 1 garasjeplass inne + 1 plass på terreng",
    details:
      "Hus 4: integrert garasje for 1 bil, samt vedtektsfestet bruksrett til 1 p-plass ute.",
    source: "Kontrakt/Salgsoppgave",
  },
  {
    id: "ute-3",
    area: "UTE",
    title: "Utvendig kaldtvannskran montert og tett",
    source: "Salgsoppgave",
  },
  {
    id: "ute-4",
    area: "UTE",
    title: "Rekkverk på evt. støttemurer og balkonger iht. forskrift",
    source: "Salgsoppgave",
  },
  {
    id: "ute-5",
    area: "UTE",
    title: "Avfallsløsning (plassering) og postkassestativ etablert",
    source: "Salgsoppgave",
  },
  // 1. etasje
  {
    id: "etg1-1",
    area: "ETG1",
    title: "Entré: Fliser La Fenice Circus med sokkelflis, varmekabler fungerer",
    source: "Salgsoppgave",
  },
  {
    id: "etg1-2",
    area: "ETG1",
    title: "Yale Doorman elektronisk lås fungerer, alle nøkler/tagger levert",
    source: "Salgsoppgave",
  },
  {
    id: "etg1-3",
    area: "ETG1",
    title:
      "Bad/vaskerom: 60x60-fliser, mosaikk i dusjsone, riktig fall til sluk, membran uten synlige avvik",
    source: "Salgsoppgave",
  },
  {
    id: "etg1-4",
    area: "ETG1",
    title: "Opplegg til vaskemaskin (vann, avløp) + sluk bekreftet",
    source: "Salgsoppgave",
  },
  {
    id: "etg1-5",
    area: "ETG1",
    title: "Garasje: port og lys fungerer, brannsperre og tetting ok",
    source: "Salgsoppgave",
  },
  // 2. etasje
  {
    id: "etg2-1",
    area: "ETG2",
    title: "Sigdal kjøkken (Standard) levert iht. tegning, fronter/benk mont.",
    source: "Tilvalg/Salgsoppgave",
  },
  {
    id: "etg2-2",
    area: "ETG2",
    title: "Kjøkkenarmatur: Vikingbad Miri (uttrekk) montert",
    source: "Tilvalg",
  },
  {
    id: "etg2-3",
    area: "ETG2",
    title: "Opplegg oppvaskmaskin, komfyr, hvitevarer og ventilasjon",
    source: "Salgsoppgave",
  },
  {
    id: "etg2-4",
    area: "ETG2",
    title: "Peisinnsats fra Peisselskabet montert og godkjent for bruk",
    details:
      "Bekreft modell, avstand til brennbart og skorstein/trekk. Krev brukerveiledning.",
    source: "Salgsoppgave/Kommunikasjon",
  },
  {
    id: "etg2-5",
    area: "ETG2",
    title: "Balkong: trykkimpregnert gulv, rekkverk i tre, fall og avrenning ok",
    source: "Salgsoppgave",
  },
  // 3. etasje
  {
    id: "etg3-1",
    area: "ETG3",
    title: "3 soverom: 1-stavs parkett (Kährs Eik Newington) uten skader",
    source: "Salgsoppgave",
  },
  {
    id: "etg3-2",
    area: "ETG3",
    title:
      "Bad 3. etg.: Fliser La Fenice Circus, Vikingbad utstyr, rainshower fungerer",
    source: "Salgsoppgave",
  },
  {
    id: "etg3-3",
    area: "ETG3",
    title: "Badekar (tilvalg) korrekt montert og inkl. nødvendige tilpasninger",
    details:
      "Kontroller fliser/membran rundt, tetting og overløp. Pris/ordre bekreftet signert.",
    source: "Kommunikasjon/Tilvalg",
  },
  {
    id: "etg3-4",
    area: "ETG3",
    title: "Rømningsbalkong/alternativ rømningsvei iht. krav",
    source: "Salgsoppgave",
  },
  // Tekniske
  {
    id: "tek-1",
    area: "TEKNISK",
    title:
      "Sikringsskap (NEK 400): kurser merket, jordfeilbryter, kursfortegnelse",
    source: "Salgsoppgave",
  },
  {
    id: "tek-2",
    area: "TEKNISK",
    title: "15 downlights fordelt i 3 soner – test alle",
    source: "Salgsoppgave",
  },
  {
    id: "tek-3",
    area: "TEKNISK",
    title: "Balansert ventilasjon med varmegjenvinner i drift",
    details: "Be om innreguleringsrapport og filteroversikt.",
    source: "Salgsoppgave",
  },
  {
    id: "tek-4",
    area: "TEKNISK",
    title: "Varmekabler: entré og bad fungerer (termostater testet)",
    source: "Salgsoppgave",
  },
  {
    id: "tek-5",
    area: "TEKNISK",
    title: "Varmtvannsbereder 200 L montert og uten lekkasje",
    source: "Salgsoppgave",
  },
  {
    id: "tek-6",
    area: "TEKNISK",
    title:
      "Seriekoblede røykvarslere i alle etasjer + brannslukningsapparat",
    source: "Salgsoppgave",
  },
  {
    id: "tek-7",
    area: "TEKNISK",
    title: "Elbil – tomrør til sikringsskap (posisjon bekreftet)",
    source: "Salgsoppgave",
  },
  // Dokumentasjon
  {
    id: "dok-1",
    area: "DOK",
    title: "Ferdigattest eller midlertidig brukstillatelse (MBT)",
    details:
      "MBT skal angi gjenstående arbeid og frist. Ferdigattest kommer evt. senere.",
    source: "Salgsoppgave",
    lawRef: "pbl./kommunalt vedtak",
  },
  {
    id: "dok-2",
    area: "DOK",
    title: "Bustadoppføringslova § 12–garanti (5 % i 5 år) er stilt",
    source: "Kontrakt",
    lawRef: "buofl. § 12",
  },
  {
    id: "dok-3",
    area: "DOK",
    title:
      "Rett til å holde tilbake vederlag ved mangler avdekket på befaring",
    details:
      "Bruk overtakelsesprotokoll. Dere kan be megler sperre beløp for mangler.",
    source: "Kontrakt",
    lawRef: "buofl. § 49",
  },
  {
    id: "dok-4",
    area: "DOK",
    title:
      "FDV-dokumentasjon: manualer, samsvarserklæring elektro, våtroms-/membranrapport, innregulering ventilasjon",
    source: "Bransjekrav",
  },
  {
    id: "dok-5",
    area: "DOK",
    title: "Tilvalgsliste signert (dusjhjørne, toalett, betjeningsplate, armatur, m.m.)",
    source: "Tilvalg",
  },
  {
    id: "dok-6",
    area: "DOK",
    title:
      "Reklamasjonsrett: 5 år fra overtakelse. Reklamér ‘innan rimeleg tid’.",
    source: "Kontrakt",
    lawRef: "buofl. §§ 30–32",
  },
];

// ---------- Helpers ----------

const STORAGE_KEY = "vidjeveien4-checklist-v1";

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch { }
  }, [key, state]);
  return [state, setState] as const;
}

function classNames(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

// ---------- UI Components ----------

function SectionCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 print:shadow-none print:ring-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 sm:p-5"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown /> : <ChevronRight />}
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        </div>
        <span className="text-sm text-gray-500 hidden sm:block">
          {open ? "Skjul" : "Vis"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 sm:p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Progress({ total, done }: { total: number; done: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-2">
        <div className="text-sm text-gray-600">Fremdrift</div>
        <div className="text-sm font-medium">{done}/{total} ({pct}%)</div>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-black/80"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Toolbar({
  query,
  setQuery,
  onlyOpen,
  setOnlyOpen,
  onPrint,
}: {
  query: string;
  setQuery: (v: string) => void;
  onlyOpen: boolean;
  setOnlyOpen: (v: boolean) => void;
  onPrint: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          className="w-full rounded-xl border border-gray-200 bg-white px-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Søk i punkter (f.eks. ‘peis’, ‘parkett’, ‘tilvalg’)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={onlyOpen}
          onChange={(e) => setOnlyOpen(e.target.checked)}
        />
        <Filter className="h-4 w-4" /> Vis bare uavkryssede
      </label>
      <button
        onClick={onPrint}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 print:hidden"
      >
        <Printer className="h-4 w-4" /> Skriv ut
      </button>
    </div>
  );
}

function ItemRow({ item, onToggle, onNote }: {
  item: Item;
  onToggle: (id: string) => void;
  onNote: (id: string, note: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <button
          aria-label={item.checked ? "Fjern avhuking" : "Huk av"}
          onClick={() => onToggle(item.id)}
          className="mt-0.5"
        >
          {item.checked ? (
            <CheckCircle2 className="text-black" />
          ) : (
            <Circle className="text-gray-400" />
          )}
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className={classNames("font-medium", item.checked && "line-through text-gray-500")}>{item.title}</div>
            {item.lawRef && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{item.lawRef}</span>
            )}
            {item.source && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{item.source}</span>
            )}
          </div>
          {item.details && (
            <p className="mt-1 text-sm text-gray-600">{item.details}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs hover:bg-gray-100"
            >
              {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />} Notat
            </button>
          </div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3"
              >
                <textarea
                  value={item.note || ""}
                  onChange={(e) => onNote(item.id, e.target.value)}
                  placeholder="Skriv notat / avvik / frist / kontaktperson…"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  rows={3}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NewItemForm({ onAdd, area }: { onAdd: (i: Item) => void; area: AreaKey }) {
  const [title, setTitle] = useState("");
  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Legg til eget punkt i denne seksjonen"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
        />
        <button
          onClick={() => {
            if (!title.trim()) return;
            onAdd({ id: crypto.randomUUID(), area, title: title.trim() });
            setTitle("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          <Plus className="h-4 w-4" /> Legg til
        </button>
      </div>
    </div>
  );
}

// ---------- Mangel-logg ----------

type Issue = {
  id: string;
  title: string;
  severity: "Lav" | "Middels" | "Høy";
  deadline?: string;
};

function Issues({ issues, setIssues }: { issues: Issue[]; setIssues: (x: Issue[]) => void }) {
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<Issue["severity"]>("Middels");
  const [deadline, setDeadline] = useState<string>("");

  const remove = (id: string) => setIssues(issues.filter((i) => i.id !== id));

  return (
    <SectionCard title="Mangel-logg (for overtakelsesprotokollen)">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Beskriv mangel (f.eks. riss i gips i stue)"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 md:col-span-2"
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Issue["severity"])}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          >
            <option>Lav</option>
            <option>Middels</option>
            <option>Høy</option>
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!title.trim()) return;
              setIssues([
                ...issues,
                { id: crypto.randomUUID(), title: title.trim(), severity, deadline },
              ]);
              setTitle("");
              setSeverity("Middels");
              setDeadline("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            <Plus className="h-4 w-4" /> Legg til mangel
          </button>
        </div>
        {issues.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Mangel</th>
                  <th className="px-3 py-2 text-left">Alvorlighet</th>
                  <th className="px-3 py-2 text-left">Frist</th>
                  <th className="px-3 py-2 text-right print:hidden">Handling</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((m) => (
                  <tr key={m.id} className="border-t border-gray-100">
                    <td className="px-3 py-2">{m.title}</td>
                    <td className="px-3 py-2">{m.severity}</td>
                    <td className="px-3 py-2">{m.deadline || "–"}</td>
                    <td className="px-3 py-2 text-right print:hidden">
                      <button
                        onClick={() => remove(m.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs hover:bg-gray-100"
                      >
                        <Trash2 className="h-3 w-3" /> Fjern
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertTriangle className="h-4 w-4" /> Ingen registrerte mangler enda.
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ---------- Main Page ----------

export default function Page() {
  const [items, setItems] = useLocalStorage<Item[]>(STORAGE_KEY, SEED);
  const [query, setQuery] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [issues, setIssues] = useLocalStorage<Issue[]>(
    STORAGE_KEY + "-issues",
    []
  );

  const byArea = useMemo(() => {
    const groups: Record<AreaKey, Item[]> = {
      UTE: [],
      ETG1: [],
      ETG2: [],
      ETG3: [],
      TEKNISK: [],
      DOK: [],
    };
    const q = query.trim().toLowerCase();
    for (const it of items) {
      if (onlyOpen && it.checked) continue;
      if (q) {
        const hay = `${it.title} ${it.details || ""} ${it.source || ""} ${it.lawRef || ""}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      groups[it.area].push(it);
    }
    return groups;
  }, [items, query, onlyOpen]);

  const totals = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.checked).length;
    return { total, done };
  }, [items]);

  const toggle = (id: string) =>
    setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  const setNote = (id: string, note: string) =>
    setItems(items.map((i) => (i.id === id ? { ...i, note } : i)));
  const addItem = (area: AreaKey, i: Item) => setItems([...items, i]);

  const markArea = (area: AreaKey, value: boolean) =>
    setItems(items.map((i) => (i.area === area ? { ...i, checked: value } : i)));

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ items, issues }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forbefaring-vidjeveien4.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPage = () => window.print();

  // after hooks and before return()
  const saveToCloud = async () => {
    try {
      const res = await fetch("/api/checklist/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, issues }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error("Save failed");
      alert("Lagret i skyen ✅\n" + json.pathname);
    } catch (e) {
      alert("Kunne ikke lagre i skyen ❌");
    }
  };

  const loadLatestFromCloud = async () => {
    try {
      const res = await fetch("/api/checklist/latest");
      const json = await res.json();
      if (!json.ok || !json.data) {
        alert("Ingen skylagring funnet ennå!");
        return;
      }
      setItems(json.data.items || []);
      setIssues(json.data.issues || []);
      alert("Hentet siste versjon fra skyen ✅");
    } catch (e) {
      alert("Kunne ikke hente fra skyen ❌");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 border-b border-gray-200 print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Forbefaring – Vidjeveien 4a</h1>
              <p className="text-sm text-gray-600">Ny enebolig – Simensbråten, Oslo.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportJSON}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
              >
                <FileDown className="h-4 w-4" /> Last ned notater
              </button>
              <button onClick={saveToCloud} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
                ☁️ Lagre til sky
              </button>
              <button onClick={loadLatestFromCloud} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
                ⬇️ Hent siste versjon
              </button>

            </div>
          </div>
          <div className="mt-3">
            <Toolbar
              query={query}
              setQuery={setQuery}
              onlyOpen={onlyOpen}
              setOnlyOpen={setOnlyOpen}
              onPrint={printPage}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 print:py-4">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <SectionCard title="Rettigheter og nyttige grep" defaultOpen={false}>
            <ul className="list-disc pl-5 text-sm leading-6 text-gray-700 space-y-2">
              <li><strong>Garanti:</strong> Selger skal stille garanti – normalt 5% i 5 år (buofl. § 12).</li>
              <li><strong>Tilbakehold:</strong> Funn på befaring kan holdes igjen på oppgjør/sperres hos megler (buofl. § 49).</li>
              <li><strong>Reklamasjon:</strong> 5 års reklamasjonsrett. Meld fra innen «rimelig tid» etter at du oppdaget forholdet.</li>
              <li><strong>MBT/Ferdigattest:</strong> Krev midlertidig brukstillatelse (med oversikt over gjenstående arbeid) eller ferdigattest.</li>
              <li><strong>Dokumenter:</strong> FDV, samsvarserklæring elektro (NEK 400), våtroms-/membranrapport, ventilasjonsinnregulering.</li>
              <li><strong>Foto/video:</strong> Dokumentér avvik med mobil. Skriv tydelige beskrivelser og frister i mangel-loggen.</li>
            </ul>
          </SectionCard>
          <SectionCard title="Oppsummering">
            <div className="space-y-4">
              <Progress total={totals.total} done={totals.done} />
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="rounded-xl bg-gray-50 p-3"><span className="block text-xs text-gray-500">Totalt antall punkter</span><span className="text-lg font-semibold">{totals.total}</span></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="block text-xs text-gray-500">Avkrysset</span><span className="text-lg font-semibold">{totals.done}</span></div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sections */}
        {(
          [
            ["UTE", byArea.UTE],
            ["ETG1", byArea.ETG1],
            ["ETG2", byArea.ETG2],
            ["ETG3", byArea.ETG3],
            ["TEKNISK", byArea.TEKNISK],
            ["DOK", byArea.DOK],
          ] as [AreaKey, Item[]][]
        ).map(([area, list]) => (
          <div key={area} className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{AREA_LABELS[area]}</h2>
              <div className="print:hidden flex gap-2">
                <button
                  onClick={() => markArea(area, true)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs hover:bg-gray-50"
                >
                  Kryss av alle
                </button>
                <button
                  onClick={() => markArea(area, false)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs hover:bg-gray-50"
                >
                  Fjern avkrysninger
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {list.length === 0 ? (
                <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">Ingen punkter i filteret.</div>
              ) : (
                list.map((item) => (
                  <ItemRow key={item.id} item={item} onToggle={toggle} onNote={setNote} />
                ))
              )}
              <NewItemForm area={area} onAdd={(i) => addItem(area, i)} />
            </div>
          </div>
        ))}

        {/* Issues */}
        <Issues issues={issues} setIssues={setIssues} />

        {/* Footer note */}
        <div className="mt-8 text-xs text-gray-500 print:mt-4">
          * Sjekklisten er tilpasset deres bolig basert på salgsoppgave, kontrakt og signerte tilvalg. Bruk den fritt og kryss av under forbefaring og overtakelse. Denne siden lagrer til lokal nettleser (localStorage) – ta utskrift som PDF for deling.
        </div>
      </div>
    </main>
  );
}
