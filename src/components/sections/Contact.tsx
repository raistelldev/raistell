"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAudience } from "@/components/AudienceContext";
import { Section, SectionHeading } from "@/components/Section";
import { formOptions, site, type Audience } from "@/config/site";
import { validateLead } from "@/lib/lead-validation";

const inputClass = "w-full rounded-theme border border-line bg-page px-3 py-3 text-base text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-soft";

export function Contact() {
  const { audience, setAudience } = useAudience();
  const isCompany = audience === "firma";
  return (
    <Section id="kontakt" tone="dark">
      <SectionHeading eyebrow="Der nächste Schritt" title={isCompany ? "Was möchten Sie verständlich machen?" : "Zeig uns, was du kannst."}
        intro={isCompany ? "Ein paar Angaben reichen für den ersten Austausch. Gemeinsam klären wir, welcher Umfang zu Ihrem Projekt passt." : "Bewirb dich mit deinem Profil oder Portfolio. Für die reine Content-Produktion brauchst du keine große Community."} center onDark />
      <div role="group" aria-label="Anfrage als" className="mx-auto mt-8 flex max-w-md rounded-full border border-on-dark/20 p-1">
        {(["firma", "creator"] as const).map((role) => <button key={role} type="button" aria-pressed={role === audience} onClick={() => setAudience(role)} className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold ${role === audience ? "bg-on-dark text-brand-strong" : "text-on-dark/75"}`}>{role === "firma" ? "Unternehmen" : "Creator"}</button>)}
      </div>
      <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-line bg-surface p-5 sm:p-8">
        <LeadForm key={audience} role={audience} />
      </div>
    </Section>
  );
}

function LeadForm({ role }: { role: Audience }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCompany = role === "firma";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    const formData = new FormData(event.currentTarget);
    const data: Record<string, unknown> = { ...Object.fromEntries(formData.entries()), role };
    data.platforms = formData.getAll("platforms");
    data.seeking = formData.getAll("seeking");
    const validation = validateLead(data);
    if (!validation.ok) { setError(validation.error); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) { setError(result.error || "Senden fehlgeschlagen. Bitte erneut versuchen."); return; }
      try {
        sessionStorage.setItem("raistell:booking-prefill", JSON.stringify({ role, name: validation.lead.name, email: validation.lead.email }));
      } catch { /* The request is saved even if browser storage is unavailable. */ }
      router.push(`/danke?role=${role}`);
    } catch {
      setError("Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns per E-Mail.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label={isCompany ? "Projektanfrage" : "Creator-Bewerbung"}>
      <p className="text-xs text-ink-soft">Mit * markierte Angaben sind erforderlich.</p>
      {isCompany ? <CompanyFields /> : <CreatorFields />}
      <label className="flex items-start gap-3 pt-2 text-xs leading-relaxed text-ink-soft">
        <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
        <span>Ich habe die <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung dieser Anfrage zu.</span>
      </label>
      {error && <p role="alert" className="rounded-theme border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button type="submit" disabled={submitting} className="w-full rounded-theme bg-brand px-6 py-3.5 text-base font-semibold text-on-brand hover:bg-brand-strong disabled:cursor-wait disabled:opacity-70">{submitting ? "Wird gesendet …" : isCompany ? "Projekt anfragen" : "Als Creator bewerben"}</button>
      <p className="text-center text-xs leading-relaxed text-ink-soft">{isCompany ? "Ihre Anfrage ist unverbindlich. Eine optionale Terminwahl folgt im nächsten Schritt." : "Deine Bewerbung ist kostenlos. Eine optionale Terminwahl folgt im nächsten Schritt."}</p>
      <p className="text-center text-xs text-ink-soft">Fragen? <a className="text-brand underline underline-offset-2" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
    </form>
  );
}

function CompanyFields() {
  return <>
    <Field label="Unternehmen oder Website" name="company" required autoComplete="organization" />
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Ihr Name" name="contact" required autoComplete="name" /><Field label="Geschäftliche E-Mail" name="email" type="email" required autoComplete="email" /></div>
    <ChoiceGroup legend="Wofür möchten Sie die Inhalte einsetzen? *" name="seeking" options={formOptions.seeking} hint="Mehrfachauswahl möglich. Wenn Sie unsicher sind, wählen Sie ‚Noch offen‘." />
    <label className="block text-sm font-medium text-ink" htmlFor="budget">Geplantes Projektbudget <Optional /><select id="budget" name="budget" defaultValue="" className={`${inputClass} mt-2`}><option value="">Bitte wählen</option>{formOptions.budgets.map((budget) => <option key={budget}>{budget}</option>)}</select><span className="mt-2 block text-xs font-normal leading-relaxed text-ink-soft">Für Konzept und Produktion. Ein mögliches Werbebudget wird separat betrachtet.</span></label>
    <Field label="Telefonnummer" name="phone" type="tel" autoComplete="tel" />
    <TextField label="Was möchten Sie zeigen oder erklären?" name="message" placeholder="Zum Beispiel ein Kundenprojekt, den Ablauf einer Installation oder eine häufige Kundenfrage." />
  </>;
}

function CreatorFields() {
  const [collaborationType, setCollaborationType] = useState("produktion");
  const wantsPublication = collaborationType !== "produktion";
  return <>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" required autoComplete="name" /><Field label="E-Mail" name="email" type="email" required autoComplete="email" /></div>
    <Field label="Link zu deinem Profil oder Portfolio" name="profileUrl" type="url" required placeholder="https://…" />
    <Field label="Ort oder Region" name="region" required placeholder="Zum Beispiel München / Bayern" autoComplete="address-level2" />
    <label className="block text-sm font-medium text-ink" htmlFor="collaborationType">Welche Zusammenarbeit interessiert dich? *<select id="collaborationType" name="collaborationType" value={collaborationType} onChange={(event) => setCollaborationType(event.target.value)} className={`${inputClass} mt-2`}><option value="produktion">Videoproduktion für Unternehmen</option><option value="veroeffentlichung">Veröffentlichung auf meinem Kanal</option><option value="beides">Beides</option></select></label>
    {wantsPublication && <div className="space-y-5 rounded-theme border border-line bg-page p-4"><ChoiceGroup legend="Auf welchen Plattformen möchtest du veröffentlichen? *" name="platforms" options={formOptions.platforms} hint="Für Veröffentlichungen brauchen wir mindestens eine Plattform." /><label className="block text-sm font-medium" htmlFor="reach">Followerzahl <Optional /><select name="reach" id="reach" defaultValue="" className={`${inputClass} mt-2`}><option value="">Keine Angabe</option>{formOptions.followerRanges.map((range) => <option key={range}>{range}</option>)}</select></label><p className="text-xs leading-relaxed text-ink-soft">Für ein konkretes Projekt schauen wir gemeinsam auf durchschnittliche Aufrufe und die Region deines Publikums.</p></div>}
    <Field label="Themen und Erfahrung" name="topic" placeholder="Zum Beispiel Hausbau, PV, Handwerk oder Technik" />
    <TextField label="Was sollten wir über dich wissen?" name="about" placeholder="Hier ist Platz für Arbeitsproben, praktische Erfahrung oder mögliche Drehorte." />
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Preisvorstellung" name="price" /><Field label="Telefonnummer" name="phone" type="tel" autoComplete="tel" /></div>
  </>;
}

function Optional() { return <span className="ml-1 text-xs font-normal text-ink-soft">(optional)</span>; }

function Field({ label, name, type = "text", required = false, placeholder, autoComplete }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; autoComplete?: string }) {
  return <label htmlFor={name} className="block text-sm font-medium text-ink">{label}{required ? " *" : <Optional />}<input id={name} name={name} type={type} required={required} maxLength={name === "email" ? 254 : 500} placeholder={placeholder} autoComplete={autoComplete} className={`${inputClass} mt-2`} /></label>;
}

function TextField({ label, name, placeholder }: { label: string; name: string; placeholder: string }) {
  return <label htmlFor={name} className="block text-sm font-medium text-ink">{label}<Optional /><textarea id={name} name={name} rows={3} maxLength={4000} placeholder={placeholder} className={`${inputClass} mt-2`} /></label>;
}

function ChoiceGroup({ legend, hint, name, options }: { legend: string; hint: string; name: string; options: readonly string[] }) {
  return <fieldset><legend className="text-sm font-medium text-ink">{legend}</legend><p className="mb-3 mt-1 text-xs leading-relaxed text-ink-soft">{hint}</p><div className="space-y-2">{options.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-theme border border-line px-3 py-2.5 text-sm text-ink has-checked:border-brand has-checked:bg-brand-soft"><input type="checkbox" name={name} value={option} className="h-4 w-4 shrink-0 accent-brand" />{option}</label>)}</div></fieldset>;
}
