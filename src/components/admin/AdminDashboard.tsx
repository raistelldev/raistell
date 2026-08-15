"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ImpressumData, Lead, LeadRole } from "@/lib/db";

type Filter = "all" | LeadRole;
type Tab = "leads" | "impressum";

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "E-Mail",
  phone: "Telefon",
  company: "Unternehmen",
  contact: "Ansprechpartner",
  state: "Bundesland",
  region: "Region",
  industry: "Branche",
  seeking: "Zusammenarbeit",
  budget: "Budget",
  message: "Nachricht",
  platforms: "Plattformen",
  reach: "Followerzahl",
  topic: "Themengebiet",
  about: "Content",
  price: "Preisvorstellung",
  role: "Rolle",
};

const DETAIL_ORDER = [
  "company",
  "contact",
  "phone",
  "region",
  "state",
  "industry",
  "seeking",
  "budget",
  "message",
  "platforms",
  "reach",
  "topic",
  "about",
  "price",
];

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatShortDate(value: string) {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

function labelFor(key: string) {
  return FIELD_LABELS[key] ?? key;
}

function leadEntries(lead: Lead) {
  const base: [string, unknown][] = [
    ["role", lead.role === "firma" ? "Unternehmen" : "Creator"],
    ["name", lead.name],
    ["email", lead.email],
    ["created_at", formatDate(lead.created_at)],
  ];
  const payload = lead.payload ?? {};
  const keys = [
    ...DETAIL_ORDER.filter((k) => k in payload),
    ...Object.keys(payload).filter(
      (k) => !DETAIL_ORDER.includes(k) && k !== "email" && k !== "name",
    ),
  ];
  return [...base, ...keys.map((key) => [key, payload[key]] as [string, unknown])];
}

function previewLine(lead: Lead) {
  const p = lead.payload ?? {};
  if (lead.role === "firma") {
    return [p.company, p.industry, p.seeking].filter(Boolean).map(formatValue).join(" · ");
  }
  return [p.region, p.platforms, p.reach].filter(Boolean).map(formatValue).join(" · ");
}

function phoneOf(lead: Lead) {
  return formatValue(lead.payload?.phone);
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("leads");
  const [filter, setFilter] = useState<Filter>("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [impressum, setImpressum] = useState<ImpressumData | null>(null);
  const [impressumSaving, setImpressumSaving] = useState(false);
  const [impressumMessage, setImpressumMessage] = useState<string | null>(null);

  const loadLeads = useCallback(
    async (role: Filter) => {
      setLoading(true);
      setError(null);
      try {
        const qs = role === "all" ? "" : `?role=${role}`;
        const res = await fetch(`/api/admin/leads${qs}`);
        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }
        const data = (await res.json()) as { leads?: Lead[]; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Laden fehlgeschlagen.");
          return;
        }
        setLeads(data.leads ?? []);
        setSelected(new Set());
      } catch {
        setError("Netzwerkfehler beim Laden der Leads.");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const loadImpressum = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/impressum");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = (await res.json()) as {
        impressum?: ImpressumData;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Impressum laden fehlgeschlagen.");
        return;
      }
      setImpressum(data.impressum ?? null);
    } catch {
      setError("Netzwerkfehler beim Laden des Impressums.");
    }
  }, [router]);

  useEffect(() => {
    if (tab === "leads") void loadLeads(filter);
    else void loadImpressum();
  }, [tab, filter, loadLeads, loadImpressum]);

  useEffect(() => {
    if (!detailLead) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDetailLead(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [detailLead]);

  const allVisibleSelected = useMemo(
    () => leads.length > 0 && leads.every((l) => selected.has(l.id)),
    [leads, selected],
  );

  function toggleAll() {
    if (allVisibleSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(leads.map((l) => l.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function exportLeads(mode: "all" | "firma" | "creator" | "selected") {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/leads/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          ids: mode === "selected" ? Array.from(selected) : undefined,
        }),
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Export fehlgeschlagen.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] ?? `leads-${mode}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Netzwerkfehler beim Export.");
    } finally {
      setExporting(false);
    }
  }

  async function deleteLeads(ids: string[]) {
    if (ids.length === 0) return;
    const label =
      ids.length === 1
        ? "Diesen Eintrag wirklich löschen?"
        : `${ids.length} Einträge wirklich löschen?`;
    if (!window.confirm(label)) return;

    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = (await res.json()) as { deleted?: number; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Löschen fehlgeschlagen.");
        return;
      }
      const idSet = new Set(ids);
      setLeads((prev) => prev.filter((l) => !idSet.has(l.id)));
      setSelected((prev) => {
        const next = new Set(prev);
        for (const id of ids) next.delete(id);
        return next;
      });
      if (detailLead && idSet.has(detailLead.id)) setDetailLead(null);
    } catch {
      setError("Netzwerkfehler beim Löschen.");
    } finally {
      setDeleting(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function saveImpressum(e: React.FormEvent) {
    e.preventDefault();
    if (!impressum) return;
    setImpressumSaving(true);
    setImpressumMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/impressum", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(impressum),
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = (await res.json()) as {
        impressum?: ImpressumData;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      if (data.impressum) setImpressum(data.impressum);
      setImpressumMessage("Impressum gespeichert.");
    } catch {
      setError("Netzwerkfehler beim Speichern.");
    } finally {
      setImpressumSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Admin
          </p>
          <h1 className="mt-1 font-brand text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Übersicht
          </h1>
          {tab === "leads" && !loading && (
            <p className="mt-1 text-sm text-ink-soft">
              {leads.length} Einträg{leads.length === 1 ? "" : "e"}
              {selected.size > 0 ? ` · ${selected.size} ausgewählt` : ""}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-theme border border-line px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink/20 hover:text-ink"
        >
          Abmelden
        </button>
      </header>

      <div className="mt-6 inline-flex w-full rounded-theme border border-line bg-surface p-1 sm:w-auto">
        <TabButton active={tab === "leads"} onClick={() => setTab("leads")}>
          Einträge
        </TabButton>
        <TabButton
          active={tab === "impressum"}
          onClick={() => setTab("impressum")}
        >
          Impressum
        </TabButton>
      </div>

      {error && (
        <p
          className="mt-4 rounded-theme border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      {tab === "leads" ? (
        <section className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex rounded-theme border border-line bg-surface p-0.5">
              {(
                [
                  ["all", "Alle"],
                  ["firma", "Unternehmen"],
                  ["creator", "Creator"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`flex-1 rounded-theme px-3 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                    filter === value
                      ? "bg-brand text-on-brand"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <ExportButton
                disabled={exporting || deleting}
                onClick={() => void exportLeads("all")}
              >
                Alle CSV
              </ExportButton>
              <ExportButton
                disabled={exporting || deleting}
                onClick={() => void exportLeads("firma")}
              >
                Unternehmen
              </ExportButton>
              <ExportButton
                disabled={exporting || deleting}
                onClick={() => void exportLeads("creator")}
              >
                Creator
              </ExportButton>
              <ExportButton
                disabled={exporting || deleting || selected.size === 0}
                onClick={() => void exportLeads("selected")}
              >
                Auswahl ({selected.size})
              </ExportButton>
              <button
                type="button"
                disabled={deleting || selected.size === 0}
                onClick={() => void deleteLeads(Array.from(selected))}
                className="rounded-theme border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Löscht …" : `Löschen (${selected.size})`}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-theme border border-line bg-surface px-4 py-12 text-center text-sm text-ink-soft">
              Lädt …
            </div>
          ) : leads.length === 0 ? (
            <div className="rounded-theme border border-dashed border-line bg-surface px-4 py-12 text-center text-sm text-ink-soft">
              Keine Einträge in diesem Filter.
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                <li className="flex items-center gap-3 px-1 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Alle auswählen"
                  />
                  <span>Alle auswählen</span>
                </li>
                {leads.map((lead) => (
                  <li
                    key={lead.id}
                    className="rounded-theme border border-line bg-surface p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selected.has(lead.id)}
                        onChange={() => toggleOne(lead.id)}
                        aria-label={`${lead.name} auswählen`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <RoleBadge role={lead.role} />
                          <span className="text-xs text-ink-soft">
                            {formatShortDate(lead.created_at)}
                          </span>
                        </div>
                        <p className="mt-2 truncate font-semibold text-ink">
                          {lead.name}
                        </p>
                        <a
                          href={`mailto:${lead.email}`}
                          className="mt-0.5 block truncate text-sm text-brand"
                        >
                          {lead.email}
                        </a>
                        <p className="mt-1 text-sm text-ink-soft">
                          {phoneOf(lead)}
                        </p>
                        {previewLine(lead) && (
                          <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
                            {previewLine(lead)}
                          </p>
                        )}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDetailLead(lead)}
                            className="rounded-theme bg-brand px-3 py-2.5 text-sm font-semibold text-on-brand"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            disabled={deleting}
                            onClick={() => void deleteLeads([lead.id])}
                            className="rounded-theme border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50"
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-theme border border-line bg-surface md:block">
                <table className="w-full table-fixed text-left text-sm">
                  <colgroup>
                    <col className="w-10" />
                    <col className="w-[7.5rem]" />
                    <col className="w-[7.5rem]" />
                    <col />
                    <col className="w-[18%]" />
                    <col className="w-28" />
                    <col className="w-36" />
                  </colgroup>
                  <thead className="border-b border-line bg-surface-alt/80 text-xs uppercase tracking-wide text-ink-soft">
                    <tr>
                      <th className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={toggleAll}
                          aria-label="Alle auswählen"
                        />
                      </th>
                      <th className="px-3 py-3 font-medium">Datum</th>
                      <th className="px-3 py-3 font-medium">Rolle</th>
                      <th className="px-3 py-3 font-medium">Kontakt</th>
                      <th className="px-3 py-3 font-medium">Kurzinfo</th>
                      <th className="px-3 py-3 font-medium">Telefon</th>
                      <th className="px-3 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-line transition-colors hover:bg-brand-soft/40"
                      >
                        <td className="px-3 py-3 align-middle">
                          <input
                            type="checkbox"
                            checked={selected.has(lead.id)}
                            onChange={() => toggleOne(lead.id)}
                            aria-label={`${lead.name} auswählen`}
                          />
                        </td>
                        <td className="px-3 py-3 align-middle text-ink-soft">
                          {formatShortDate(lead.created_at)}
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <RoleBadge role={lead.role} />
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <p className="truncate font-medium text-ink">
                            {lead.name}
                          </p>
                          <p className="truncate text-ink-soft">{lead.email}</p>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <p className="line-clamp-2 text-ink-soft">
                            {previewLine(lead) || "—"}
                          </p>
                        </td>
                        <td className="px-3 py-3 align-middle text-ink">
                          <span className="truncate block">{phoneOf(lead)}</span>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetailLead(lead)}
                              className="rounded-theme border border-line px-2.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-soft"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              disabled={deleting}
                              onClick={() => void deleteLeads([lead.id])}
                              className="rounded-theme border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                            >
                              Löschen
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="mt-6 max-w-2xl">
          {!impressum ? (
            <p className="text-sm text-ink-soft">Lädt …</p>
          ) : (
            <form
              onSubmit={(e) => void saveImpressum(e)}
              className="space-y-4 rounded-theme border border-line bg-surface p-5 sm:p-6"
            >
              <div>
                <label
                  htmlFor="impressum-text"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Impressum-Text
                </label>
                <textarea
                  id="impressum-text"
                  value={impressum.text}
                  onChange={(e) =>
                    setImpressum({ ...impressum, text: e.target.value })
                  }
                  rows={16}
                  className="w-full resize-y rounded-theme border border-line bg-page px-3 py-2.5 font-mono text-sm leading-relaxed text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft"
                />
              </div>

              {impressumMessage && (
                <p className="rounded-theme bg-brand-soft px-3 py-2 text-sm text-brand">
                  {impressumMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={impressumSaving}
                className="w-full rounded-theme bg-brand px-5 py-3 text-sm font-semibold text-on-brand hover:bg-brand-strong disabled:opacity-70 sm:w-auto"
              >
                {impressumSaving ? "Speichert …" : "Impressum speichern"}
              </button>
            </form>
          )}
        </section>
      )}

      {detailLead && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-detail-title"
          onClick={() => setDetailLead(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-surface shadow-2xl sm:rounded-theme"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <RoleBadge role={detailLead.role} />
                  <span className="text-xs text-ink-soft">
                    {formatDate(detailLead.created_at)}
                  </span>
                </div>
                <h2
                  id="lead-detail-title"
                  className="mt-2 truncate font-brand text-xl font-semibold text-ink"
                >
                  {detailLead.name}
                </h2>
                <a
                  href={`mailto:${detailLead.email}`}
                  className="mt-0.5 block truncate text-sm text-brand"
                >
                  {detailLead.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setDetailLead(null)}
                className="shrink-0 rounded-theme border border-line px-3 py-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                Schließen
              </button>
            </div>

            <dl className="flex-1 space-y-0 overflow-y-auto px-5 py-2">
              {leadEntries(detailLead)
                .filter(([key]) => !["name", "email", "role", "created_at"].includes(key))
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 gap-0.5 border-b border-line/70 py-3 last:border-0 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      {labelFor(key)}
                    </dt>
                    <dd className="whitespace-pre-wrap break-words text-sm text-ink">
                      {formatValue(value)}
                    </dd>
                  </div>
                ))}
            </dl>

            <div className="border-t border-line px-5 py-4">
              <button
                type="button"
                disabled={deleting}
                onClick={() => void deleteLeads([detailLead.id])}
                className="w-full rounded-theme border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
              >
                {deleting ? "Löscht …" : "Eintrag löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function RoleBadge({ role }: { role: LeadRole }) {
  const isFirma = role === "firma";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
        isFirma
          ? "bg-brand-soft text-brand"
          : "bg-surface-alt text-ink-soft ring-1 ring-line"
      }`}
    >
      {isFirma ? "Unternehmen" : "Creator"}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-theme px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
        active ? "bg-brand text-on-brand" : "text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function ExportButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-theme border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm"
    >
      {children}
    </button>
  );
}

