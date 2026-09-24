# Raistell: vor Veröffentlichung prüfen

Diese Überarbeitung ist eine Vorschau. Sie enthält keine erfundenen Preise, Kundenreferenzen oder Anbieterangaben.

## Inhalt und Angebot

- Pilotumfang mit tatsächlich verfügbaren Creatorn abstimmen: ein Hauptvideo, drei Kurzfassungen, ein Projekt und eine gebündelte Korrekturrunde.
- Videolängen, Drehrahmen, Gesamtbudget, Nutzungsrechte, Freigaben und Zahlungsbedingungen je Angebot festhalten.
- Das Solar-Storyboard ist ausdrücklich ein Beispielkonzept, keine Arbeitsprobe oder Kundenreferenz.
- Persönliche Gründerangaben und echte Arbeitsproben ergänzen, sobald vorhanden.

## Anbieter und Datenschutz

- Vollständigen Betreiber-/Firmennamen und veröffentlichbare Geschäftsanschrift bestätigen. Die bestehenden Platzhalter in src/config/site.ts dürfen vor dem Live-Start nicht verbleiben.
- Impressumsseite mit den tatsächlich erforderlichen Angaben erstellen und verlinken; keine Adresse aus alten Unterhaltungen übernehmen.
- Datenschutzerklärung auf das reale Setup abstimmen: Netlify, Neon, Formularspeicherung und ggf. Calendly. Verantwortlichkeiten, Speicherfristen und Auftragsverarbeitung anhand der tatsächlichen Kontoeinstellungen klären.
- Der Cookie-Hinweis verändert keine Tracking-Konfiguration. Die rechtliche Vollständigkeit ist durch die Layoutänderung nicht geprüft.

## Formulare und Veröffentlichung

- Geänderte Formularfelder werden ohne Datenbankmigration als JSON-Payload gespeichert; Profil-Link und Kooperationsart erscheinen auch in der Admin-Ansicht.
- Client und Server verwenden dieselbe Validierung. Content-Produktion benötigt keine Followerzahl; für Creator-Veröffentlichungen ist eine Plattform erforderlich.
- Name und E-Mail werden nach erfolgreicher Anfrage nicht mehr in die Danke-URL geschrieben. Kalender-Vorausfüllung erfolgt optional aus dem Sitzungsspeicher und erst beim Laden des Calendly-Kalenders.
- Im Deployment DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET sowie die vorhandenen NEXT_PUBLIC_CALENDLY_URL_FIRMA/CREATOR-Einstellungen prüfen. Keine Zugangsdaten in Quellcode oder Repository speichern.
- Die lokale Vorschau nutzt das separate Neon-Testprojekt `raistell-preview`. Verbindung, Tabellenanlage und Admin-Lesen sind geprüft. Der Betreiber hat den Eingang einer persönlich abgesendeten Testbewerbung bestätigt. Vor Veröffentlichung zusätzlich den Unternehmensweg prüfen.
- Lokaler Build, Formularvalidierung, Desktop-/Mobilansicht, Ankerlinks, Creator-Wechsel und Namensgeschichte prüfen.
- Erst die Vorschau prüfen, anschließend die konkrete Veröffentlichung abstimmen.
