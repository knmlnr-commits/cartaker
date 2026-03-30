// GeriCall CareTaker Portal — Mock Data & Constants

window.COLORS = {
  oranje: '#E8732A',
  oranjeLicht: '#FFF3EB',
  oranjeDonker: '#C45E1E',
  achtergrond: '#F7F7F7',
  kaartWit: '#FFFFFF',
  border: '#E8E8E8',
  tekstPrimair: '#2D2D2D',
  tekstSecundair: '#666666',
  tekstMuted: '#AAAAAA',
  groen: '#2D9D78',
  groenLicht: '#E8F5F0',
  rood: '#D94F4F',
  roodLicht: '#FCEAEA',
  blauw: '#4A7FB5',
  blauwLicht: '#EBF2F9',
};

// ══════════════════════════════════════════
// WIJK — meerdere bewoners per verzorgende
// ══════════════════════════════════════════
// ── Stemming/mood per bewoner (gedeeld tussen alle gebruikers) ──
window.stemmingen = {
  jansen: { score: 3, label: 'Gaat redelijk', door: 'Sandra B.', rol: 'verzorgende', tijd: 'Vandaag 08:10', history: [
    { score: 3, door: 'Sandra B.', rol: 'verzorgende', tijd: 'Vandaag 08:10' },
    { score: 2, door: 'Kevin R.', rol: 'verzorgende', tijd: 'Gisteren 20:30' },
    { score: 4, door: 'Dochter M. Jansen', rol: 'familie', tijd: 'Gisteren 14:00' },
    { score: 3, door: 'Sandra B.', rol: 'verzorgende', tijd: 'Eergisteren 08:15' },
  ]},
  de_groot: { score: 4, label: 'Gaat goed', door: 'Sandra B.', rol: 'verzorgende', tijd: 'Vandaag 07:30', history: [] },
  van_dam: { score: 4, label: 'Gaat goed', door: 'L. Bakker (logo)', rol: 'verzorgende', tijd: 'Vandaag 10:45', history: [] },
  visser: { score: 2, label: 'Niet zo goed', door: 'Sandra B.', rol: 'verzorgende', tijd: 'Vandaag 07:55', history: [] },
};

// Stemming opties (1-5) — rustig, zonder emoji
window.stemmingOpties = [
  { score: 1, label: 'Slecht', kleur: '#D94F4F' },
  { score: 2, label: 'Matig', kleur: '#E8732A' },
  { score: 3, label: 'Redelijk', kleur: '#AAAAAA' },
  { score: 4, label: 'Goed', kleur: '#2D9D78' },
  { score: 5, label: 'Prima', kleur: '#2D9D78' },
];

window.bewoners = [
  {
    id: 'jansen',
    naam: "Dhr. A. Jansen",
    roepnaam: "Adriaan",
    initialen: "AJ",
    geboortedatum: "14 maart 1941",
    leeftijd: 84,
    kamer: "14B",
    afdeling: "Zonnehof",
    diagnose: "Dementie (fase 2), hartfalen (NYHA II)",
    alert: 'U2', // open consult urgentie
    alertTekst: 'Toenemende verwardheid',
    takenOpen: 5,
    takenTotaal: 7,
    laatsteNotitie: 'Onrustige nacht, 2x gebeld',
    iot: {
      hartslag: { waarde: 82, eenheid: 'bpm', status: 'normaal', trend: 'stabiel', updated: '2 min geleden' },
      saturatie: { waarde: 93, eenheid: '%', status: 'let_op', trend: 'dalend', updated: '2 min geleden' },
      temperatuur: { waarde: 37.1, eenheid: '\u00B0C', status: 'normaal', trend: 'stabiel', updated: '10 min geleden' },
      bloeddruk: { waarde: '138/84', eenheid: 'mmHg', status: 'normaal', trend: 'stabiel', updated: '30 min geleden' },
      beweging: { waarde: 'Zittend', eenheid: '', status: 'normaal', trend: null, updated: 'nu' },
      valrisico: { waarde: 'Geen val', eenheid: '', status: 'normaal', trend: null, updated: 'nu' },
      slaap: { waarde: '4.5 uur', eenheid: '', status: 'let_op', trend: 'minder', updated: 'vannacht' },
      gewicht: { waarde: 78.2, eenheid: 'kg', status: 'let_op', trend: 'stijgend', updated: 'vanochtend' },
    },
    reablement: { fase: "Fase 1 \u2014 Stabilisatie", voortgang: 34, coordinatorNaam: "Annemiek de Vries (SO Eigen)", startdatum: "2 januari 2026", einddatum: "30 juni 2027" },
    behandelplan: [
      { onderdeel: "Medicatie", status: "Actueel", bijgewerkt: "gisteren", toelichting: "Metoprolol 50mg 2x daags, Furosemide 40mg 1x, Rivastigmine pleister 9.5mg/24u." },
      { onderdeel: "Voedingsplan", status: "Actueel", bijgewerkt: "3 dagen geleden", toelichting: "Natriumbeperkt dieet, 1.5L vochtbeperking. Eiwitverrijkt." },
      { onderdeel: "Beweging", status: "Aandacht gevraagd", bijgewerkt: "1 week geleden", toelichting: "Looptraining 2x daags 10 min. Valt achteruit." },
      { onderdeel: "Pijn & comfort", status: "Actueel", bijgewerkt: "vandaag", toelichting: "NRS stabiel 2-3. Paracetamol zo nodig." },
    ],
    openConsulten: [
      {
        id: "C-2041",
        ingediend: "Vandaag 08:32",
        ingediendDoor: "Sandra B. (verzorgende)",
        status: "In behandeling",
        urgentie: "U2 \u2014 Dringend",
        toewijzing: "CT-arts GeriCall",
        arts: "Dr. R. Mahmoud (CT-arts)",
        beschrijving: "Toenemende verwardheid sinds gisteravond",
        klacht: "Bewustzijnsstoornis / verwardheid",
        discriminatoren: [
          { vraag: "Acuut ontstaan?", antwoord: "Ja, sinds gisteravond" },
          { vraag: "Koorts?", antwoord: "Nee, 36.9\u00B0C" },
          { vraag: "Medicatie gewijzigd?", antwoord: "Nee" },
        ],
        vitalen: { hartslag: 82, saturatie: 93, temperatuur: 37.1, bloeddruk: "138/84", bewustzijn: "Voice" },
        tijdlijn: [
          { tijd: "08:32", type: "melding", tekst: "Melding ingediend door Sandra B.", door: "Sandra B." },
          { tijd: "08:35", type: "triage", tekst: "NTS-triage: U2 \u2014 Dringend. Bewustzijnsstoornis, acuut ontstaan.", door: "Systeem" },
          { tijd: "08:38", type: "toewijzing", tekst: "Toegewezen aan CT-arts GeriCall (Dr. R. Mahmoud)", door: "Systeem" },
          { tijd: "08:45", type: "bericht", tekst: "Ik bekijk de casus. Kunt u de huidige AVPU-score doorgeven en of er sprake is van koorts of urineretentie?", door: "Dr. R. Mahmoud" },
          { tijd: "09:01", type: "bericht", tekst: "AVPU = Voice, reageert op aanspreken. Geen koorts (36.9). Urineproductie normaal. Is na ontbijt iets rustiger geworden maar herkent personeel niet.", door: "Sandra B." },
          { tijd: "09:15", type: "verzoek", tekst: "Videoconsult aangevraagd door arts", door: "Dr. R. Mahmoud", verzoekType: "video_call", verzoekStatus: "gepland", verzoekTijd: "Vandaag 10:30" },
          { tijd: "09:20", type: "verzoek", tekst: "Aanvullende info aangevraagd: medicatieoverzicht + lab (laatste nierfunctie, elektrolyten)", door: "Dr. R. Mahmoud", verzoekType: "informatie", verzoekStatus: "in_afwachting", verzoekItems: ["Actueel medicatieoverzicht", "Lab: creatinine, eGFR, natrium, kalium", "Urineonderzoek (sediment)"] },
        ],
        videoCall: { gepland: "Vandaag 10:30", status: "gepland", link: null },
        informatieVerzoeken: [
          { id: 1, item: "Actueel medicatieoverzicht", status: "aangeleverd", aangeleverdDoor: "Sandra B.", aangeleverdOm: "09:35" },
          { id: 2, item: "Lab: creatinine, eGFR, natrium, kalium", status: "aangevraagd", aangevraagdBij: "Laboratorium Zonnehof" },
          { id: 3, item: "Urineonderzoek (sediment)", status: "aangevraagd", aangevraagdBij: "Laboratorium Zonnehof" },
        ],
      },
    ],
    taken: [
      { id: 1, tekst: 'ADL ochtend \u2014 douchen, aankleden', tijd: '07:30', gedaan: true, door: 'Sandra B.', gedaanOm: '07:42' },
      { id: 2, tekst: 'Medicatie ochtend \u2014 Metoprolol, Furosemide', tijd: '08:00', gedaan: true, door: 'Sandra B.', gedaanOm: '08:05' },
      { id: 3, tekst: 'Ontbijt begeleiden \u2014 natriumbeperkt', tijd: '08:30', gedaan: false, door: null, gedaanOm: null },
      { id: 4, tekst: 'Vochtinname registreren', tijd: '10:00', gedaan: false, door: null, gedaanOm: null },
      { id: 5, tekst: 'Looptraining 10 min', tijd: '10:30', gedaan: false, door: null, gedaanOm: null },
      { id: 6, tekst: 'Dagrapportage ochtend', tijd: '12:00', gedaan: false, door: null, gedaanOm: null },
      { id: 7, tekst: 'Medicatie middag \u2014 Rivastigmine pleister', tijd: '12:30', gedaan: false, door: null, gedaanOm: null },
    ],
    notities: [
      { tekst: 'Onrustige nacht, 2x gebeld. Na ontbijt rustiger.', auteur: 'Sandra B.', tijd: '07:45' },
      { tekst: 'Blauwe trui klaargezet (verzoek dochter)', auteur: 'Kevin R.', tijd: 'Gisteren 17:50' },
    ],
  },
  {
    id: 'de_groot',
    naam: "Mw. B. de Groot",
    roepnaam: "Betsie",
    initialen: "BG",
    geboortedatum: "22 juni 1938",
    leeftijd: 87,
    kamer: "14A",
    afdeling: "Zonnehof",
    diagnose: "COPD Gold III, diabetes type 2",
    alert: null,
    alertTekst: null,
    takenOpen: 3,
    takenTotaal: 6,
    laatsteNotitie: 'Goed geslapen, bloedsuiker stabiel',
    iot: {
      hartslag: { waarde: 74, eenheid: 'bpm', status: 'normaal', trend: 'stabiel', updated: '3 min geleden' },
      saturatie: { waarde: 91, eenheid: '%', status: 'let_op', trend: 'stabiel', updated: '3 min geleden' },
      temperatuur: { waarde: 36.8, eenheid: '\u00B0C', status: 'normaal', trend: 'stabiel', updated: '15 min geleden' },
      bloeddruk: { waarde: '142/88', eenheid: 'mmHg', status: 'let_op', trend: 'stabiel', updated: '1 uur geleden' },
      beweging: { waarde: 'In bed', eenheid: '', status: 'normaal', trend: null, updated: 'nu' },
      valrisico: { waarde: 'Geen val', eenheid: '', status: 'normaal', trend: null, updated: 'nu' },
      slaap: { waarde: '7.2 uur', eenheid: '', status: 'normaal', trend: 'stabiel', updated: 'vannacht' },
      gewicht: { waarde: 65.1, eenheid: 'kg', status: 'normaal', trend: 'stabiel', updated: 'gisteren' },
    },
    reablement: null,
    behandelplan: [
      { onderdeel: "Medicatie", status: "Actueel", bijgewerkt: "vandaag", toelichting: "Insuline, Metformine, Salbutamol, Tiotropium." },
      { onderdeel: "Ademhaling", status: "Actueel", bijgewerkt: "gisteren", toelichting: "2x daags inhalatie. Saturatie monitoren." },
      { onderdeel: "Voeding", status: "Actueel", bijgewerkt: "3 dagen geleden", toelichting: "Diabetesdieet, koolhydraat-bewust." },
    ],
    openConsulten: [],
    taken: [
      { id: 1, tekst: 'Insuline ochtend + bloedsuiker meten', tijd: '07:00', gedaan: true, door: 'Sandra B.', gedaanOm: '07:15' },
      { id: 2, tekst: 'Inhalatie ochtend (Salbutamol + Tiotropium)', tijd: '07:30', gedaan: true, door: 'Sandra B.', gedaanOm: '07:35' },
      { id: 3, tekst: 'ADL met standby hulp', tijd: '08:00', gedaan: true, door: 'Sandra B.', gedaanOm: '08:20' },
      { id: 4, tekst: 'Bloedsuiker meten (voor lunch)', tijd: '11:30', gedaan: false, door: null, gedaanOm: null },
      { id: 5, tekst: 'Insuline middag', tijd: '12:00', gedaan: false, door: null, gedaanOm: null },
      { id: 6, tekst: 'Inhalatie avond', tijd: '18:00', gedaan: false, door: null, gedaanOm: null },
    ],
    notities: [
      { tekst: 'Bloedsuiker ochtend: 7.2 mmol/L, goed.', auteur: 'Sandra B.', tijd: '07:20' },
    ],
  },
  {
    id: 'van_dam',
    naam: "Dhr. C. van Dam",
    roepnaam: "Cees",
    initialen: "CD",
    geboortedatum: "8 november 1943",
    leeftijd: 82,
    kamer: "15A",
    afdeling: "Zonnehof",
    diagnose: "CVA (2024), hemiparese links, afasie",
    alert: null,
    alertTekst: null,
    takenOpen: 4,
    takenTotaal: 5,
    laatsteNotitie: 'Logopedie ging goed, 3 woorden gesproken',
    iot: {
      hartslag: { waarde: 68, eenheid: 'bpm', status: 'normaal', trend: 'stabiel', updated: '1 min geleden' },
      saturatie: { waarde: 97, eenheid: '%', status: 'normaal', trend: 'stabiel', updated: '1 min geleden' },
      temperatuur: { waarde: 36.5, eenheid: '\u00B0C', status: 'normaal', trend: 'stabiel', updated: '20 min geleden' },
      bloeddruk: { waarde: '128/76', eenheid: 'mmHg', status: 'normaal', trend: 'stabiel', updated: '45 min geleden' },
      beweging: { waarde: 'Rolstoel', eenheid: '', status: 'normaal', trend: null, updated: 'nu' },
      valrisico: { waarde: 'Geen val', eenheid: '', status: 'normaal', trend: null, updated: 'nu' },
      slaap: { waarde: '6.8 uur', eenheid: '', status: 'normaal', trend: 'stabiel', updated: 'vannacht' },
      gewicht: { waarde: 81.5, eenheid: 'kg', status: 'normaal', trend: 'stabiel', updated: 'gisteren' },
    },
    reablement: { fase: "Fase 2 \u2014 Activering", voortgang: 58, coordinatorNaam: "Dr. J. Smit (revalidatiearts)", startdatum: "1 maart 2025", einddatum: "1 maart 2027" },
    behandelplan: [
      { onderdeel: "Medicatie", status: "Actueel", bijgewerkt: "vandaag", toelichting: "Ascal, Atorvastatine, Lisinopril." },
      { onderdeel: "Revalidatie", status: "Actueel", bijgewerkt: "gisteren", toelichting: "Fysiotherapie 3x/week, ergotherapie 2x/week." },
      { onderdeel: "Logopedie", status: "Aandacht gevraagd", bijgewerkt: "vandaag", toelichting: "Langzame vooruitgang. Extra sessies aangevraagd." },
    ],
    openConsulten: [],
    taken: [
      { id: 1, tekst: 'Medicatie ochtend', tijd: '08:00', gedaan: true, door: 'Sandra B.', gedaanOm: '08:10' },
      { id: 2, tekst: 'ADL \u2014 hulp bij aankleden (links)', tijd: '08:30', gedaan: false, door: null, gedaanOm: null },
      { id: 3, tekst: 'Transfer rolstoel begeleiden', tijd: '09:00', gedaan: false, door: null, gedaanOm: null },
      { id: 4, tekst: 'Oefeningen linkerarm (5 min)', tijd: '11:00', gedaan: false, door: null, gedaanOm: null },
      { id: 5, tekst: 'Dagrapportage', tijd: '12:00', gedaan: false, door: null, gedaanOm: null },
    ],
    notities: [
      { tekst: 'Logopedie: 3 woorden gesproken vandaag, goede sessie.', auteur: 'L. Bakker (logo)', tijd: '10:30' },
    ],
  },
  {
    id: 'visser',
    naam: "Mw. D. Visser",
    roepnaam: "Dina",
    initialen: "DV",
    geboortedatum: "3 januari 1940",
    leeftijd: 86,
    kamer: "15B",
    afdeling: "Zonnehof",
    diagnose: "Alzheimer, osteoporose, recente heupfractuur",
    alert: 'U3',
    alertTekst: 'Pijn heup toegenomen',
    takenOpen: 6,
    takenTotaal: 8,
    laatsteNotitie: 'Pijn bij transfers, NRS 6',
    iot: {
      hartslag: { waarde: 88, eenheid: 'bpm', status: 'let_op', trend: 'stijgend', updated: '1 min geleden' },
      saturatie: { waarde: 96, eenheid: '%', status: 'normaal', trend: 'stabiel', updated: '1 min geleden' },
      temperatuur: { waarde: 37.4, eenheid: '\u00B0C', status: 'normaal', trend: 'licht stijgend', updated: '10 min geleden' },
      bloeddruk: { waarde: '118/72', eenheid: 'mmHg', status: 'normaal', trend: 'stabiel', updated: '1 uur geleden' },
      beweging: { waarde: 'In bed', eenheid: '', status: 'let_op', trend: 'weinig beweging', updated: 'nu' },
      valrisico: { waarde: 'Geen val', eenheid: '', status: 'normaal', trend: null, updated: 'nu' },
      slaap: { waarde: '5.1 uur', eenheid: '', status: 'let_op', trend: 'onrustig', updated: 'vannacht' },
      gewicht: { waarde: 58.3, eenheid: 'kg', status: 'let_op', trend: 'dalend', updated: 'vanochtend' },
    },
    reablement: null,
    behandelplan: [
      { onderdeel: "Medicatie", status: "Actueel", bijgewerkt: "vandaag", toelichting: "Donepezil, Calcium/Vitamine D, Paracetamol 4x1g, Tramadol zo nodig." },
      { onderdeel: "Mobiliteit", status: "Aandacht gevraagd", bijgewerkt: "vandaag", toelichting: "Postoperatief heup. Voorzichtig mobiliseren met rollator. Pijn monitoren." },
    ],
    openConsulten: [
      {
        id: "C-2040",
        ingediend: "Gisteren 16:10",
        ingediendDoor: "Sandra B. (verzorgende)",
        status: "Wacht op SO",
        urgentie: "U3 \u2014 Urgent",
        toewijzing: "SO Eigen",
        arts: "Dr. A. de Vries (SO)",
        beschrijving: "Pijn heup toegenomen sinds gisteren",
        klacht: "Pijn / mobiliteit",
        discriminatoren: [
          { vraag: "Hoofdletsel?", antwoord: "Nee" },
          { vraag: "Belasting mogelijk?", antwoord: "Nee, sterk beperkt" },
        ],
        vitalen: { hartslag: 88, saturatie: 96, temperatuur: 37.4, bloeddruk: "118/72" },
        tijdlijn: [
          { tijd: "Gisteren 16:10", type: "melding", tekst: "Melding ingediend door Sandra B.", door: "Sandra B." },
          { tijd: "Gisteren 16:15", type: "triage", tekst: "NTS-triage: U3 \u2014 Urgent. Pijn toegenomen, NRS 6 bij transfer.", door: "Systeem" },
          { tijd: "Gisteren 16:20", type: "toewijzing", tekst: "Doorgezet naar SO Eigen (Dr. A. de Vries) voor visite morgen", door: "Systeem" },
          { tijd: "Gisteren 17:00", type: "bericht", tekst: "Tramadol 50mg gegeven. Pijn zakte naar NRS 4. Mevrouw ligt nu rustiger.", door: "Sandra B." },
          { tijd: "Vandaag 08:00", type: "verzoek", tekst: "Aanvullende info aangevraagd: foto heup (r\u00F6ntgen) + wondstatus", door: "Dr. A. de Vries", verzoekType: "informatie", verzoekStatus: "in_afwachting", verzoekItems: ["R\u00F6ntgenfoto heup (aanvragen radiologie)", "Foto wondstatus (via app)"] },
        ],
        videoCall: null,
        informatieVerzoeken: [
          { id: 1, item: "R\u00F6ntgenfoto heup", status: "aangevraagd", aangevraagdBij: "Radiologie Zonnehof" },
          { id: 2, item: "Foto wondstatus", status: "in_afwachting", aangevraagdBij: "Verzorgende" },
        ],
      },
    ],
    taken: [
      { id: 1, tekst: 'Medicatie ochtend incl. pijnmedicatie', tijd: '07:30', gedaan: true, door: 'Sandra B.', gedaanOm: '07:40' },
      { id: 2, tekst: 'ADL \u2014 bedverpleging (niet mobiliseren zonder OK fysiotherapeut)', tijd: '08:00', gedaan: true, door: 'Sandra B.', gedaanOm: '08:25' },
      { id: 3, tekst: 'Pijnscore meten (NRS)', tijd: '09:00', gedaan: false, door: null, gedaanOm: null },
      { id: 4, tekst: 'Ontbijt op bed', tijd: '08:30', gedaan: false, door: null, gedaanOm: null },
      { id: 5, tekst: 'Wond controleren heup', tijd: '10:00', gedaan: false, door: null, gedaanOm: null },
      { id: 6, tekst: 'Vochtinname bijhouden', tijd: '10:00', gedaan: false, door: null, gedaanOm: null },
      { id: 7, tekst: 'Fysiotherapeut komt \u2014 assisteren bij mobilisatie', tijd: '11:00', gedaan: false, door: null, gedaanOm: null },
      { id: 8, tekst: 'Medicatie middag', tijd: '12:30', gedaan: false, door: null, gedaanOm: null },
    ],
    notities: [
      { tekst: 'NRS 6 bij transfer. Tramadol gegeven om 07:45.', auteur: 'Sandra B.', tijd: '07:50' },
      { tekst: 'Wond ziet er goed uit, geen roodheid.', auteur: 'Sandra B.', tijd: 'Gisteren 16:00' },
    ],
  },
];

// Backward compat: patient = eerste bewoner
window.patient = window.bewoners[0];

// ── Weekplanning: wie zorgt wanneer ──
window.weekplanning = [
  { dag: 'Maandag', datum: '31 mrt', shifts: [
    { periode: 'Ochtend', wie: 'Sandra B. (verzorgende)', taak: 'ADL, medicatie, ontbijt', status: 'bevestigd' },
    { periode: 'Middag', wie: 'Dochter M. Jansen', taak: 'Bezoek, wandeling, lunch', status: 'bevestigd', isFamilie: true },
    { periode: 'Avond', wie: 'Kevin R. (verzorgende)', taak: 'Avondverzorging, medicatie', status: 'bevestigd' },
    { periode: 'Nacht', wie: 'Nachtdienst afdeling', taak: 'Controle rondes', status: 'bevestigd' },
  ]},
  { dag: 'Dinsdag', datum: '1 apr', shifts: [
    { periode: 'Ochtend', wie: 'Sandra B. (verzorgende)', taak: 'ADL, medicatie', status: 'bevestigd' },
    { periode: 'Middag', wie: '\u2014', taak: 'Geen bezoek gepland', status: 'open', isFamilie: true },
    { periode: 'Avond', wie: 'Priya K. (verzorgende)', taak: 'Avondverzorging', status: 'bevestigd' },
    { periode: 'Nacht', wie: 'Nachtdienst afdeling', taak: 'Controle rondes', status: 'bevestigd' },
  ]},
  { dag: 'Woensdag', datum: '2 apr', shifts: [
    { periode: 'Ochtend', wie: 'Fysiotherapie L. Bakker', taak: 'Looptraining + ADL', status: 'bevestigd' },
    { periode: 'Middag', wie: 'Zoon P. Jansen', taak: 'Bezoek', status: 'onder voorbehoud', isFamilie: true },
    { periode: 'Avond', wie: 'Kevin R. (verzorgende)', taak: 'Avondverzorging', status: 'bevestigd' },
    { periode: 'Nacht', wie: 'Nachtdienst afdeling', taak: 'Controle rondes', status: 'bevestigd' },
  ]},
  { dag: 'Donderdag', datum: '3 apr', shifts: [
    { periode: 'Ochtend', wie: 'Sandra B. (verzorgende)', taak: 'ADL, medicatie', status: 'bevestigd' },
    { periode: 'Middag', wie: 'Dr. A. de Vries (SO)', taak: 'Visite + evaluatie behandelplan', status: 'bevestigd' },
    { periode: 'Avond', wie: '\u2014', taak: 'Verzorgende nog niet ingepland', status: 'open' },
    { periode: 'Nacht', wie: 'Nachtdienst afdeling', taak: 'Controle rondes', status: 'bevestigd' },
  ]},
  { dag: 'Vrijdag', datum: '4 apr', shifts: [
    { periode: 'Ochtend', wie: 'Priya K. (verzorgende)', taak: 'ADL, medicatie', status: 'bevestigd' },
    { periode: 'Middag', wie: 'Dochter M. Jansen', taak: 'Bezoek, samen eten', status: 'bevestigd', isFamilie: true },
    { periode: 'Avond', wie: 'Kevin R. (verzorgende)', taak: 'Avondverzorging, medicatie', status: 'bevestigd' },
    { periode: 'Nacht', wie: 'Nachtdienst afdeling', taak: 'Controle rondes', status: 'bevestigd' },
  ]},
  { dag: 'Zaterdag', datum: '5 apr', shifts: [
    { periode: 'Ochtend', wie: 'Weekenddienst', taak: 'ADL, medicatie', status: 'bevestigd' },
    { periode: 'Middag', wie: '\u2014', taak: 'Geen bezoek gepland', status: 'open', isFamilie: true },
    { periode: 'Avond', wie: 'Weekenddienst', taak: 'Avondverzorging', status: 'bevestigd' },
    { periode: 'Nacht', wie: 'Nachtdienst afdeling', taak: 'Controle rondes', status: 'bevestigd' },
  ]},
  { dag: 'Zondag', datum: '6 apr', shifts: [
    { periode: 'Ochtend', wie: 'Weekenddienst', taak: 'ADL, medicatie', status: 'bevestigd' },
    { periode: 'Middag', wie: 'Zoon P. Jansen + schoondochter', taak: 'Familiebezoek', status: 'bevestigd', isFamilie: true },
    { periode: 'Avond', wie: 'Weekenddienst', taak: 'Avondverzorging', status: 'bevestigd' },
    { periode: 'Nacht', wie: 'Nachtdienst afdeling', taak: 'Controle rondes', status: 'bevestigd' },
  ]},
];

// ── Dagrapportages (verzorgende vult in, familie kan lezen) ──
window.dagrapportages = [
  { datum: 'Vandaag 07:45', auteur: 'Sandra B.', tekst: 'Meneer was onrustig vannacht (2x gebeld). Ochtend ADL ging moeizaam, wilde niet uit bed. Na ontbijt rustiger. Medicatie ingenomen.', type: 'ochtend' },
  { datum: 'Gisteren 20:15', auteur: 'Kevin R.', tekst: 'Avondeten goed gegaan, 3/4 opgegeten. Was in de war over waar hij was. Naar bed om 20:00, rustig ingeslapen.', type: 'avond' },
  { datum: 'Gisteren 12:30', auteur: 'Dochter M. Jansen', tekst: 'Papa herkende me vandaag goed. Samen gewandeld in de gang, 10 minuten. Hij genoot ervan. Vroeg naar mama.', type: 'bezoek', isFamilie: true },
  { datum: 'Eergisteren 08:00', auteur: 'Priya K.', tekst: 'Goede ochtend. ADL zelfstandig met standby hulp. Goed ontbeten. Bloeddruk 135/82, pols 76.', type: 'ochtend' },
];

// ── Berichten tussen familie en verzorging ──
window.berichten = [
  { id: 1, van: 'Dochter M. Jansen', datum: 'Vandaag 09:14', tekst: 'Goedemorgen, ik las dat papa onrustig was vannacht. Heeft hij genoeg gedronken? Ik kom vanmiddag langs.', isFamilie: true },
  { id: 2, van: 'Sandra B. (verzorgende)', datum: 'Vandaag 09:28', tekst: 'Goedemorgen! Hij heeft vanochtend goed gedronken, 2 glazen water en thee. Nu zit hij rustig in de huiskamer. Tot vanmiddag!', isFamilie: false },
  { id: 3, van: 'Dochter M. Jansen', datum: 'Gisteren 16:30', tekst: 'Kunnen jullie ervoor zorgen dat papa zijn blauwe trui aan heeft morgen? Hij voelt zich daar fijn in.', isFamilie: true },
  { id: 4, van: 'Kevin R. (verzorgende)', datum: 'Gisteren 17:45', tekst: 'Zeker! Ik leg hem klaar. Fijne avond.', isFamilie: false },
];

// ── Familie leden (inlogbare profielen) ──
// ── Zorgmedewerker profielen ──
window.zorgprofielen = [
  { id: 'sandra', naam: 'Sandra B.', niveau: 'verzorgende', initialen: 'SB', label: 'Verzorgende IG' },
  { id: 'kevin', naam: 'Kevin R.', niveau: 'helpende', initialen: 'KR', label: 'Helpende' },
  { id: 'priya', naam: 'Priya K.', niveau: 'verzorgende', initialen: 'PK', label: 'Verzorgende IG' },
  { id: 'annemiek', naam: 'Annemiek de Vries', niveau: 'verpleegkundige', initialen: 'AV', label: 'Verpleegkundige' },
];

// Toegangsniveaus zorg
// helpende: taken, rapportage lezen, stemming
// verzorgende: + IoT, consulten, NTS melding, behandelplan
// verpleegkundige: + dossier, lab-aanvragen, volledige consult-beheer
window.zorgToegang = {
  helpende:        { taken: true, rapportageLezen: true, rapportageSchrijven: true, stemming: true, iot: false, consulten: false, melding: false, behandelplan: false, dossier: false, leren: true },
  verzorgende:     { taken: true, rapportageLezen: true, rapportageSchrijven: true, stemming: true, iot: true,  consulten: true,  melding: true,  behandelplan: true,  dossier: false, leren: true },
  verpleegkundige: { taken: true, rapportageLezen: true, rapportageSchrijven: true, stemming: true, iot: true,  consulten: true,  melding: true,  behandelplan: true,  dossier: true,  leren: true },
};

// Toegangsniveaus familie
// patient: stemming, wie-komt, chat
// lijn1 (gezin): alles
// lijn2 (overig): stemming, planning, chat (geen medisch)
window.familieToegang = {
  patient: { stemming: true, planning: true, chat: true, rapportages: false, behandelplan: false, consulten: false, reablement: false, leren: false },
  lijn1:   { stemming: true, planning: true, chat: true, rapportages: true,  behandelplan: true,  consulten: true,  reablement: true,  leren: true },
  lijn2:   { stemming: true, planning: true, chat: true, rapportages: false, behandelplan: false, consulten: false, reablement: false, leren: false },
};

window.familieleden = [
  { id: 'martha', naam: 'Martha Jansen', roepnaam: 'Martha', relatie: 'Dochter', telefoon: '06-1234****', bezoekfrequentie: '3x per week', laatsteBezoek: 'Gisteren', isHoofdcontact: true, initialen: 'MJ', kleur: '#2D9D78', lijn: 'lijn1' },
  { id: 'peter', naam: 'Peter Jansen', roepnaam: 'Peter', relatie: 'Zoon', telefoon: '06-5678****', bezoekfrequentie: '1x per week', laatsteBezoek: '4 dagen geleden', isHoofdcontact: false, initialen: 'PJ', kleur: '#4A7FB5', lijn: 'lijn1' },
  { id: 'lisa', naam: 'Lisa van Dijk-Jansen', roepnaam: 'Lisa', relatie: 'Schoondochter', telefoon: '06-9012****', bezoekfrequentie: '1x per 2 weken', laatsteBezoek: 'Vorige week zondag', isHoofdcontact: false, initialen: 'LJ', kleur: '#E8732A', lijn: 'lijn2' },
  { id: 'henk', naam: 'Henk Willems', roepnaam: 'Henk', relatie: 'Vriend', telefoon: '06-3456****', bezoekfrequentie: '1x per maand', laatsteBezoek: '2 weken geleden', isHoofdcontact: false, initialen: 'HW', kleur: '#666666', lijn: 'lijn2' },
  { id: 'adriaan', naam: 'Adriaan Jansen', roepnaam: 'Adriaan', relatie: 'Pati\u00EBnt', telefoon: null, bezoekfrequentie: null, laatsteBezoek: null, isHoofdcontact: false, initialen: 'AJ', kleur: '#E8732A', isPatient: true, lijn: 'patient' },
];

// ── Familiechat (contextgebonden aan planning + zorg) ──
window.familiechat = [
  { id: 1, van: 'martha', datum: 'Vandaag 09:14', tekst: 'Hoi allemaal, papa was onrustig vannacht volgens het rapport. Ik ga vanmiddag langs. Kan iemand dinsdag middag?', context: null },
  { id: 2, van: 'peter', datum: 'Vandaag 09:31', tekst: 'Dinsdag kan ik niet, ik zit in Rotterdam. Woensdag middag zou ik kunnen maar ben er niet 100% zeker van.', context: null },
  { id: 3, van: 'lisa', datum: 'Vandaag 09:45', tekst: 'Ik kan dinsdag middag! Zal ik me inschrijven? Dan neem ik ook zijn favoriete koekjes mee.', context: null },
  { id: 4, van: 'martha', datum: 'Vandaag 09:48', tekst: 'Top Lisa! Fijn. Peter, als je woensdag kunt zou dat ook goed zijn, dan is er elke dag iemand.', context: null },
  { id: 5, van: 'peter', datum: 'Vandaag 10:02', tekst: 'Ik zet woensdag op onder voorbehoud. Hoor morgen of mijn vergadering verzet kan worden.', context: 'planning:woensdag' },
  { id: 6, van: 'martha', datum: 'Vandaag 10:15', tekst: 'Heeft iemand trouwens de module "Omgaan met dementie" al bekeken? Volgens het zorgteam is dat echt aan te raden.', context: 'leren' },
  { id: 7, van: 'lisa', datum: 'Vandaag 10:22', tekst: 'Nog niet, ga ik dit weekend doen. Is er ook iets over de medicijnen? Ik vind het soms lastig te volgen wat hij allemaal slikt.', context: 'leren' },
  { id: 8, van: 'martha', datum: 'Vandaag 11:03', tekst: 'Ja! Er is een module "Medicijnen begrijpen". En heeft iemand zaterdag middag trouwens? Dat staat ook nog open.', context: 'planning:zaterdag' },
];

// ══════════════════════════════════════════
// E-LEARNING MODULES — volledig uitgewerkt met lessen en video's
// ══════════════════════════════════════════

window.verzorgendeModules = [
  {
    naam: "Fundament Spoedzorg 1 \u2014 Kwetsbare ouderen",
    status: "certificaat",
    voortgang: 100,
    beschrijving: "Leer de basisprincipes van spoedzorg bij kwetsbare ouderen, inclusief herkenning van acute situaties en eerste handelingen.",
    duur: "3 uur",
    aanbieder: "GeriCall Academy",
    lessen: [
      { titel: "De kwetsbare oudere herkennen", beschrijving: "Wat maakt een oudere kwetsbaar? Frailty, multimorbiditeit en polyfarmacie. Leer de risicofactoren en hoe je ze snel herkent bij opname.", voltooid: true, voltooidOp: "12 jan 2026, 09:15", duur: "20 min", type: "tekst" },
      { titel: "ABCDE-systematiek bij ouderen", beschrijving: "De ABCDE-methode (Airway, Breathing, Circulation, Disability, Exposure) is de gouden standaard voor acute beoordeling. Bij ouderen wijken vitale parameters af van jongere pati\u00EBnten \u2014 leer de leeftijdsspecifieke normaalwaarden.", voltooid: true, voltooidOp: "12 jan 2026, 10:40", duur: "25 min", type: "video", video: "https://www.youtube.com/results?search_query=ABCDE+methode+spoedzorg+ouderen" },
      { titel: "Vroege waarschuwingssignalen (EWS)", beschrijving: "Early Warning Scores bij ouderen: hoe interpreteer je de Modified Early Warning Score (MEWS) en wanneer escaleer je? Oefenscenario\u2019s met veelvoorkomende casussen uit de VVT-sector.", voltooid: true, voltooidOp: "14 jan 2026, 14:20", duur: "30 min", type: "interactief" },
      { titel: "Communicatie in spoedsituaties", beschrijving: "SBAR-methode (Situation, Background, Assessment, Recommendation) voor overdracht aan arts of 112. Oefen met de SBAR-structuur zodat je in stresssituaties helder communiceert.", voltooid: true, voltooidOp: "14 jan 2026, 15:05", duur: "15 min", type: "video", video: "https://www.youtube.com/results?search_query=SBAR+communicatie+verpleegkundige" },
      { titel: "Casustoets en certificering", beschrijving: "Drie praktijkcasussen met multiple-choice vragen. Bij 80% of hoger scoort u het certificaat Fundament Spoedzorg 1.", voltooid: true, voltooidOp: "15 jan 2026, 11:30", duur: "20 min", type: "toets" },
    ],
  },
  {
    naam: "Hartfalen herkennen",
    status: "bezig",
    voortgang: 60,
    beschrijving: "Verdiep je kennis over de signalen en symptomen van hartfalen bij ouderen. Leer de NYHA-classificatie, dagelijkse monitoring en wanneer je moet escaleren.",
    duur: "2.5 uur",
    aanbieder: "Hartstichting / GeriCall Academy",
    lessen: [
      { titel: "Wat is hartfalen?", beschrijving: "Het hart pompt niet genoeg bloed rond. Maar wat betekent dat in de praktijk? Bekijk de animatie van de Hartstichting en leer het verschil tussen systolisch en diastolisch hartfalen. Bij dhr. Jansen is sprake van NYHA klasse II \u2014 klachten bij normale inspanning.", voltooid: true, voltooidOp: "3 mrt 2026, 08:45", duur: "15 min", type: "video", video: "https://www.hartstichting.nl/hart-en-vaatziekten/video/hartfalen" },
      { titel: "Signalen herkennen in de dagelijkse zorg", beschrijving: "Kortademigheid bij inspanning, gezwollen enkels, gewichtstoename door vochtretentie, vermoeidheid, nachtelijke benauwdheid (orthopno\u00EB). Leer deze signalen herkennen tijdens ADL-momenten. Weeg de bewoner dagelijks \u2014 >2kg toename in 3 dagen = direct melden.", voltooid: true, voltooidOp: "3 mrt 2026, 09:30", duur: "20 min", type: "tekst" },
      { titel: "NYHA-classificatie in de praktijk", beschrijving: "NYHA I: geen klachten. NYHA II (dhr. Jansen): klachten bij gewone inspanning. NYHA III: klachten bij lichte inspanning. NYHA IV: klachten in rust. Leer hoe je de klasse observeert en rapporteert \u2014 verslechtering van NYHA II naar III is een rode vlag.", voltooid: true, voltooidOp: "5 mrt 2026, 14:10", duur: "15 min", type: "interactief" },
      { titel: "Medicatie bij hartfalen", beschrijving: "ACE-remmers, b\u00E8tablokkers (Metoprolol), diuretica (Furosemide), aldosteronantagonisten. Wat doet elk medicijn? Waar let je op bij toediening? Bijwerkingen die je als verzorgende kunt signaleren: duizeligheid (te lage bloeddruk), droge hoest (ACE-remmer), te veel plassen (diuretica).", voltooid: false, duur: "25 min", type: "tekst" },
      { titel: "Wanneer escaleren? Beslisboom", beschrijving: "Praktische beslisboom: welke signalen meld je aan de verpleegkundige, welke direct aan de arts? Oefen met scenario\u2019s: \u201CDhr. Jansen is 3 kg aangekomen in 2 dagen en is benauwd bij het aankleden\u201D \u2014 wat doe je?", voltooid: false, duur: "20 min", type: "interactief" },
    ],
  },
  {
    naam: "ABCDE bij dementie",
    status: "niet_gestart",
    voortgang: 0,
    beschrijving: "Acute beoordeling bij pati\u00EBnten met dementie is extra uitdagend: ze kunnen klachten niet goed uiten, vertonen atypische symptomen en reageren anders op pijn. Deze module leert je de ABCDE-systematiek toe te passen bij deze kwetsbare groep.",
    duur: "2 uur",
    aanbieder: "GeriCall Academy",
    lessen: [
      { titel: "Dementie en acute zorg: de uitdaging", beschrijving: "Pati\u00EBnten met dementie uiten pijn anders \u2014 onrust, roepen, weigeren van zorg kunnen tekenen zijn van een onderliggende acute aandoening. Leer de \u2018vertaling\u2019 van gedrag naar mogelijke somatische oorzaken.", voltooid: false, duur: "20 min", type: "video", video: "https://www.youtube.com/results?search_query=dementie+acute+zorg+herkennen" },
      { titel: "Delier vs. dementie: het verschil herkennen", beschrijving: "Een delier komt veel voor bij ouderen met dementie maar wordt vaak gemist. Acuut begin, wisselend bewustzijn en onrust zijn rode vlaggen. De DOS-score (Delirium Observatie Screening) helpt je om een delier te herkennen \u2014 oefen met de screeningstool.", voltooid: false, duur: "25 min", type: "interactief" },
      { titel: "ABCDE aangepast voor dementie", beschrijving: "Airway: kan de pati\u00EBnt slikken? Breathing: let op ademhalingspatroon, niet alleen frequentie. Circulation: koude handen en voeten als vroeg teken. Disability: gebruik AVPU in plaats van GCS. Exposure: inspecteer het hele lichaam \u2014 verwondingen worden vaak niet gemeld.", voltooid: false, duur: "20 min", type: "tekst" },
      { titel: "Pijnherkenning zonder woorden", beschrijving: "De PAINAD-schaal (Pain Assessment in Advanced Dementia): observeer ademhaling, vocalisatie, gezichtsuitdrukking, lichaamstaal en troostbaarheid. Score 0-10. Oefen met videofragmenten.", voltooid: false, duur: "25 min", type: "video", video: "https://www.youtube.com/results?search_query=PAINAD+pijn+dementie+observatie" },
      { titel: "Casustoets", beschrijving: "Twee casussen: een bewoner met dementie die plotseling onrustig is, en een bewoner die niet meer eet. Doorloop de ABCDE-systematiek en bepaal de juiste escalatie.", voltooid: false, duur: "15 min", type: "toets" },
    ],
  },
];

window.familieModules = [
  {
    naam: "Bewegen met je naaste",
    status: "bezig",
    voortgang: 40,
    beschrijving: "Samen bewegen is een van de krachtigste manieren om bij te dragen aan het herstel van uw naaste. Deze module leert u veilige en leuke oefeningen die u samen kunt doen tijdens uw bezoek.",
    duur: "1.5 uur",
    aanbieder: "GeriCall i.s.m. Bewegen met Bart",
    lessen: [
      { titel: "Waarom bewegen zo belangrijk is", beschrijving: "Bij hartfalen en dementie lijkt rust logisch, maar het tegenovergestelde is waar: gecontroleerd bewegen verbetert de hartfunctie, vermindert angst en vertraagt cognitieve achteruitgang. Uw vader heeft looptraining 2x per dag \u2014 u kunt daar bij helpen!", voltooid: true, voltooidOp: "18 mrt 2026, 10:00", duur: "10 min", type: "tekst" },
      { titel: "Zittende oefeningen voor samen", beschrijving: "Bekijk deze video van Bewegen met Bart: eenvoudige stoelgymnastiek die u samen met uw naaste kunt doen. Arm-, schouder- en beenoefeningen vanuit een stoel. Geen materiaal nodig, 10 minuten per sessie.", voltooid: true, voltooidOp: "18 mrt 2026, 10:20", duur: "12 min", type: "video", video: "https://www.youtube.com/@BewegenMetBart" },
      { titel: "Wandelen op de afdeling", beschrijving: "Tips voor een veilige wandeling op de gang: loop naast uw naaste (niet erachter), bied uw arm aan maar trek niet, pauzeer als hij moe wordt, en maak er een gezellig moment van \u2014 vertel over thuis, de kleinkinderen, het weer. Doel: 10 minuten per bezoek.", voltooid: false, duur: "8 min", type: "tekst" },
      { titel: "Signalen van overbelasting herkennen", beschrijving: "Wanneer moet u stoppen? Kortademigheid waarbij uw naaste niet meer kan praten, pijn op de borst, duizeligheid, of extreme vermoeidheid. Bij hartfalen (NYHA II) is lichte inspanning goed, maar luister naar het lichaam. Bij twijfel: meld het aan de verzorging.", voltooid: false, duur: "10 min", type: "tekst" },
      { titel: "Weekschema: beweegmomenten plannen", beschrijving: "Maak samen met het zorgteam een realistisch weekschema. Doel: minimaal 2x per dag 10 minuten bewegen. Familie kan 1-2 van deze momenten invullen \u2014 plan het in het weekoverzicht van de CareTaker app.", voltooid: false, duur: "10 min", type: "interactief" },
    ],
  },
  {
    naam: "Medicijnen begrijpen",
    status: "niet_gestart",
    voortgang: 0,
    beschrijving: "Uw vader gebruikt meerdere medicijnen. Het is belangrijk dat u begrijpt waarvoor ze dienen, zodat u kunt signaleren als er iets niet klopt. Deze module legt elk medicijn uit in begrijpelijke taal.",
    duur: "1 uur",
    aanbieder: "GeriCall Academy",
    lessen: [
      { titel: "Het medicijnoverzicht van uw vader", beschrijving: "Adriaan gebruikt drie medicijnen: Metoprolol (voor het hart \u2014 verlaagt hartslag en bloeddruk), Furosemide (plastablet \u2014 verwijdert overtollig vocht) en de Rivastigmine pleister (voor geheugen en concentratie bij dementie). Elk medicijn heeft een specifiek doel en tijdstip.", voltooid: false, duur: "15 min", type: "tekst" },
      { titel: "Waar let u op als familie?", beschrijving: "U hoeft geen medicijnen toe te dienen, maar u kunt w\u00E9l signaleren: Is vader duizelig? (Metoprolol te sterk) Gaat hij vaker plassen dan normaal? (Furosemide) Heeft hij huidirritatie op zijn rug? (Rivastigmine pleister). Meld afwijkingen via de berichtenfunctie.", voltooid: false, duur: "12 min", type: "tekst" },
      { titel: "Video: hoe werken medicijnen bij hartfalen?", beschrijving: "Bekijk de animatie van de Hartstichting over hoe medicijnen helpen bij hartfalen. Het hart is als een pomp die te zwak is geworden \u2014 medicijnen helpen het hart effici\u00EBnter te werken en voorkomen dat er vocht ophoopt.", voltooid: false, duur: "8 min", type: "video", video: "https://www.hartstichting.nl/hart-en-vaatziekten/video/hartfalen" },
      { titel: "Veelgestelde vragen", beschrijving: "Mag vader koffie drinken? (Ja, maar max 3 kopjes) Mag hij zout eten? (Nee, natriumbeperkt dieet bij hartfalen) Hoeveel mag hij drinken? (Max 1.5 liter per dag) Wat als hij een medicijn vergeet? (Meld het aan de verzorging, geef het NIET zelf)", voltooid: false, duur: "10 min", type: "tekst" },
    ],
  },
  {
    naam: "Omgaan met dementie thuis",
    status: "niet_gestart",
    voortgang: 0,
    beschrijving: "Uw vader heeft dementie fase 2. Dat betekent dat hij soms in de war is, mensen niet herkent of boos wordt. Deze module helpt u om deze momenten beter te begrijpen en er rustiger mee om te gaan.",
    duur: "2 uur",
    aanbieder: "GeriCall i.s.m. Alzheimer Nederland",
    lessen: [
      { titel: "Wat is dementie fase 2?", beschrijving: "In fase 2 (matige dementie) kan Adriaan bekende gezichten soms niet plaatsen, raakt hij de draad kwijt in gesprekken en kan hij angstig of geagiteerd worden. Dit is niet bewust \u2014 zijn hersenen verwerken informatie anders. Begrip hiervan helpt u om geduldig te blijven.", voltooid: false, duur: "15 min", type: "tekst" },
      { titel: "Communicatietips", beschrijving: "Spreek rustig en in korte zinnen. Stel geen toetsvragen (\u201CWeet je nog wie ik ben?\u201D) maar zeg \u201CHoi papa, ik ben Martha, je dochter.\u201D Gebruik aanraking \u2014 een hand op de arm geeft veiligheid. Corrigeer niet, maar sluit aan bij zijn belevingswereld.", voltooid: false, duur: "12 min", type: "tekst" },
      { titel: "Dilemmafilm: omgaan met een veranderende werkelijkheid", beschrijving: "In deze video van Alzheimer Nederland vertellen mantelzorgers hoe zij omgaan met situaties waarin hun naaste fantasie en werkelijkheid door elkaar haalt. Herkenbare dilemma\u2019s en praktische tips van ervaringsdeskundigen.", voltooid: false, duur: "15 min", type: "video", video: "https://www.zorgvoorbeter.nl/thema-s/dementie/scholing/videos" },
      { titel: "Wat te doen bij onrust of boosheid?", beschrijving: "Als Adriaan onrustig of boos wordt: blijf kalm, verlaag uw stem, leid af met iets vertrouwds (muziek, een foto, een wandeling). Ga nooit in discussie. Als het escaleert: verlaat even de kamer en informeer de verzorging. Onrust kan ook een teken zijn van pijn of infectie.", voltooid: false, duur: "15 min", type: "tekst" },
      { titel: "Dilemmafilm: \u201CMoeten we het rijbewijs afpakken?\u201D", beschrijving: "Een herkenbaar dilemma voor veel families. In deze video van Alzheimer Nederland delen families hun ervaringen met moeilijke beslissingen rondom autonomie en veiligheid.", voltooid: false, duur: "15 min", type: "video", video: "https://mantelzorgelijk.nl/videoreeks-alzheimer-nederland-tips-en-ervaringen-mantelzorgers/" },
      { titel: "Uw eigen grenzen bewaken", beschrijving: "Mantelzorg voor iemand met dementie is zwaar. Het is normaal om verdriet, frustratie of schuldgevoel te voelen. Zorg ook voor uzelf: accepteer hulp, verdeel taken met Peter en Lisa, en neem pauzes. De DementieLijn (0800-5088) is 7 dagen per week bereikbaar.", voltooid: false, duur: "10 min", type: "tekst" },
    ],
  },
];

window.gedeeldeModule = {
  naam: "Beweging bij hartfalen \u2014 voor mantelzorgers",
  voltooid: 2,
  totaal: 5,
  beschrijving: "Deze module helpt mantelzorgers om veilig en effectief bewegingsoefeningen te begeleiden bij pati\u00EBnten met hartfalen. Speciaal samengesteld voor de familie van Adriaan.",
  duur: "1 uur",
  aanbieder: "Hartstichting / GeriCall",
  lessen: [
    { titel: "Hartfalen en bewegen: de basis", beschrijving: "Waarom is bewegen belangrijk bij hartfalen? Het hart is een spier die getraind kan worden. Gecontroleerde beweging verbetert de pompfunctie, vermindert kortademigheid en verbetert de kwaliteit van leven. De Hartstichting adviseert dagelijks bewegen, aangepast aan het niveau.", voltooid: true, voltooidOp: "22 mrt 2026, 15:30", duur: "10 min", type: "video", video: "https://www.hartstichting.nl/hart-en-vaatziekten/video/hartfalen" },
    { titel: "Veilig bewegen bij NYHA II", beschrijving: "Bij NYHA klasse II (zoals Adriaan) zijn er klachten bij normale inspanning. Dat betekent: wandelen mag, trap lopen met rustpauzes, lichte stoelgymnastiek. Vermijd: zware tillen, rennen, of doorduwen bij benauwdheid. De Borg-schaal (6-20) helpt: blijf onder de 13 (enigszins zwaar).", voltooid: true, voltooidOp: "24 mrt 2026, 09:10", duur: "12 min", type: "tekst" },
    { titel: "Oefenvideo: 10 minuten stoelgymnastiek", beschrijving: "Volg deze sessie van Bewegen met Bart: zittende oefeningen die veilig zijn bij hartfalen. Armen, schouders, benen. Gebruik eventueel lichte gewichtjes (flesjes water). Ideaal om samen te doen tijdens een bezoek.", voltooid: false, duur: "12 min", type: "video", video: "https://www.youtube.com/@BewegenMetBart" },
    { titel: "Wanneer stoppen? Alarmsignalen", beschrijving: "Stop direct met bewegen als Adriaan: pijn op de borst heeft, heel benauwd wordt en niet meer kan praten, duizelig wordt of bijna flauwvalt, of ongewoon moe is. Meld dit aan de verzorging. Let ook op: gezwollen enkels na inspanning kunnen wijzen op vochtophoping.", voltooid: false, duur: "8 min", type: "tekst" },
    { titel: "Een beweegplan maken met het zorgteam", beschrijving: "Bespreek met de fysiotherapeut en verzorging welke oefeningen passen bij Adriaans niveau. Doel: 2x per dag 10 minuten. Familie kan 1-2 sessies per week invullen. Registreer voortgang in de app en vier kleine overwinningen samen.", voltooid: false, duur: "10 min", type: "interactief" },
  ],
};

// ══════════════════════════════════════════
// E-learning suggesties (catalogus met aanbevelingen)
// ══════════════════════════════════════════
window.moduleSuggesties = {
  verzorgende: [
    { naam: "Valpreventie bij ouderen", reden: "Mw. Visser heeft een recente heupfractuur \u2014 valpreventie is essentieel", duur: "1.5 uur", aanbieder: "Vilans", urgentie: "aanbevolen", tags: ["val", "heup", "mobiliteit"] },
    { naam: "Pijnmanagement bij dementie", reden: "Dhr. Jansen kan pijn moeilijk uiten door dementie \u2014 leer non-verbale pijnsignalen herkennen", duur: "1 uur", aanbieder: "V&VN", urgentie: "aanbevolen", tags: ["pijn", "dementie", "observatie"] },
    { naam: "Diabetes bij ouderen \u2014 hypo herkennen", reden: "Mw. de Groot heeft diabetes type 2 \u2014 herken de signalen van een hypoglykemie", duur: "45 min", aanbieder: "Diabetesvereniging", urgentie: "aanbevolen", tags: ["diabetes", "hypo", "bloedsuiker"] },
    { naam: "Omgaan met afasie na CVA", reden: "Dhr. van Dam heeft afasie \u2014 leer effectief communiceren zonder woorden", duur: "1 uur", aanbieder: "Afasievereniging", urgentie: "optioneel", tags: ["afasie", "CVA", "communicatie"] },
    { naam: "COPD-exacerbatie herkennen", reden: "Mw. de Groot heeft COPD Gold III \u2014 weet wanneer je moet escaleren", duur: "1 uur", aanbieder: "Longfonds", urgentie: "aanbevolen", tags: ["COPD", "ademhaling", "exacerbatie"] },
    { naam: "Medicatieveiligheid in de VVT", reden: "U werkt met 4 bewoners met complexe medicatie \u2014 verdiep uw kennis", duur: "2 uur", aanbieder: "GeriCall Academy", urgentie: "verplicht", tags: ["medicatie", "veiligheid"] },
    { naam: "Nachtelijke onrust bij dementie", reden: "Dhr. Jansen was onrustig vannacht \u2014 leer dag-nachtritme te ondersteunen", duur: "45 min", aanbieder: "Alzheimer Nederland", urgentie: "optioneel", tags: ["dementie", "nacht", "onrust", "slaap"] },
  ],
  familie: [
    { naam: "Vallen voorkomen: wat kunt u doen?", reden: "Uw vader heeft een verhoogd valrisico \u2014 leer hoe u bezoeken veiliger maakt", duur: "30 min", aanbieder: "VeiligheidNL", urgentie: "aanbevolen", tags: ["val", "veiligheid"] },
    { naam: "Voeding bij hartfalen", reden: "Adriaan heeft een natriumbeperkt dieet \u2014 weet wat u w\u00E9l en niet kunt meenemen", duur: "20 min", aanbieder: "Hartstichting", urgentie: "aanbevolen", tags: ["voeding", "hartfalen", "natrium"] },
    { naam: "Wat is re-ablement?", reden: "Adriaan zit in een re-ablement traject \u2014 begrijp uw rol daarin", duur: "15 min", aanbieder: "GeriCall Academy", urgentie: "aanbevolen", tags: ["reablement", "herstel"] },
    { naam: "Praten over het einde", reden: "Voorbereid zijn op gesprekken over de toekomst, wensen en grenzen", duur: "25 min", aanbieder: "PZNL (Palliatieve Zorg)", urgentie: "optioneel", tags: ["palliatief", "gesprek", "wensen"] },
    { naam: "Mantelzorg en zelfzorg", reden: "Zorgen voor een naaste is zwaar \u2014 vergeet uzelf niet", duur: "20 min", aanbieder: "MantelzorgNL", urgentie: "optioneel", tags: ["mantelzorg", "zelfzorg", "belasting"] },
  ],
};

// ══════════════════════════════════════════
// NTS-gebaseerde triage data
// Gebaseerd op de Nederlandse Triage Standaard (NHG/InEen)
// Aangepast voor geriatrische setting
// ══════════════════════════════════════════

window.ntsIngangsklachten = [
  {
    id: 'bewustzijn',
    naam: 'Bewustzijnsstoornis',
    icon: '\uD83E\uDDE0',
    toelichting: 'Verminderd bewustzijn, niet aanspreekbaar, verwardheid',
    discriminatoren: [
      { id: 'bew_1', vraag: 'Is de pati\u00EBnt aanspreekbaar?', opties: ['Ja', 'Nee, reageert niet'], urgentieImpact: { 'Nee, reageert niet': 'U1' } },
      { id: 'bew_2', vraag: 'Is er sprake van een acute verandering in bewustzijn (< 24 uur)?', opties: ['Ja, acuut ontstaan', 'Nee, geleidelijk'], urgentieImpact: { 'Ja, acuut ontstaan': 'U1' } },
      { id: 'bew_3', vraag: 'Reageert de pati\u00EBnt op pijnprikkels?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Nee': 'U0' } },
      { id: 'bew_4', vraag: 'Is er sprake van koorts (> 38.5\u00B0C)?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'bew_5', vraag: 'Gebruikt pati\u00EBnt bloedverdunners of anti-epileptica?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: {} },
    ],
  },
  {
    id: 'pijn_borst',
    naam: 'Pijn op de borst',
    icon: '\u2764\uFE0F',
    toelichting: 'Retrosternale pijn, druk op de borst, uitstraling',
    discriminatoren: [
      { id: 'pb_1', vraag: 'Is de pijn acuut ontstaan (< 12 uur geleden)?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U1' } },
      { id: 'pb_2', vraag: 'Straalt de pijn uit naar kaak, arm of rug?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U1' } },
      { id: 'pb_3', vraag: 'Is er sprake van transpireren, misselijkheid of bleekheid?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U1' } },
      { id: 'pb_4', vraag: 'Is er sprake van benauwdheid bij de pijn?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U1' } },
      { id: 'pb_5', vraag: 'Heeft pati\u00EBnt bekende cardiale voorgeschiedenis?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: { 'Ja': 'U2' } },
    ],
  },
  {
    id: 'dyspnoe',
    naam: 'Benauwdheid / Dyspnoe',
    icon: '\uD83C\uDF2C\uFE0F',
    toelichting: 'Kortademigheid, ademhalingsproblemen, saturatiedaling',
    discriminatoren: [
      { id: 'dy_1', vraag: 'Is de pati\u00EBnt in staat om in zinnen te spreken?', opties: ['Ja, hele zinnen', 'Alleen losse woorden', 'Kan niet spreken'], urgentieImpact: { 'Kan niet spreken': 'U0', 'Alleen losse woorden': 'U1' } },
      { id: 'dy_2', vraag: 'Wat is de saturatie (SpO2)?', opties: ['> 94%', '90-94%', '< 90%', 'Niet gemeten'], urgentieImpact: { '< 90%': 'U1', '90-94%': 'U2' } },
      { id: 'dy_3', vraag: 'Is de benauwdheid acuut ontstaan (< 2 uur)?', opties: ['Ja', 'Nee, geleidelijk'], urgentieImpact: { 'Ja': 'U1' } },
      { id: 'dy_4', vraag: 'Gebruikt pati\u00EBnt zuurstof thuis?', opties: ['Ja', 'Nee'], urgentieImpact: {} },
      { id: 'dy_5', vraag: 'Is er sprake van stridor of piepende ademhaling?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U2' } },
    ],
  },
  {
    id: 'vallen',
    naam: 'Val / Trauma',
    icon: '\u26A0\uFE0F',
    toelichting: 'Val uit hoogte, van bed, heupletsel, hoofdletsel',
    discriminatoren: [
      { id: 'val_1', vraag: 'Is er sprake van hoofdletsel?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'val_2', vraag: 'Gebruikt pati\u00EBnt antistolling (bloedverdunners)?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'val_3', vraag: 'Kan de pati\u00EBnt het aangedane lichaamsdeel belasten/bewegen?', opties: ['Ja', 'Nee, sterk beperkt'], urgentieImpact: { 'Nee, sterk beperkt': 'U3' } },
      { id: 'val_4', vraag: 'Is er sprake van een zichtbare vervorming of open wond?', opties: ['Ja, vervorming', 'Ja, open wond', 'Nee'], urgentieImpact: { 'Ja, vervorming': 'U2', 'Ja, open wond': 'U3' } },
      { id: 'val_5', vraag: 'Was er sprake van bewustzijnsverlies bij de val?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: { 'Ja': 'U2' } },
    ],
  },
  {
    id: 'koorts',
    naam: 'Koorts / Infectie',
    icon: '\uD83C\uDF21\uFE0F',
    toelichting: 'Temperatuurverhoging, rillen, infectieverschijnselen',
    discriminatoren: [
      { id: 'ko_1', vraag: 'Wat is de temperatuur?', opties: ['< 38.0\u00B0C', '38.0 - 39.0\u00B0C', '39.0 - 40.0\u00B0C', '> 40.0\u00B0C', 'Niet gemeten'], urgentieImpact: { '> 40.0\u00B0C': 'U2', '39.0 - 40.0\u00B0C': 'U3' } },
      { id: 'ko_2', vraag: 'Is er sprake van rilkoorts of koude rillingen?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'ko_3', vraag: 'Is er sprake van verminderde vochtinname (< 24 uur)?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U3' } },
      { id: 'ko_4', vraag: 'Zijn er tekenen van een urineweginfectie (troebele/stinkende urine)?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: {} },
      { id: 'ko_5', vraag: 'Is de pati\u00EBnt immuungecompromitteerd of gebruikt deze immunosuppressiva?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: { 'Ja': 'U2' } },
    ],
  },
  {
    id: 'gedrag',
    naam: 'Gedragsverandering / Delier',
    icon: '\uD83D\uDCA4',
    toelichting: 'Agitatie, onrust, hallucinaties, dag-nachtritme verstoord',
    discriminatoren: [
      { id: 'ge_1', vraag: 'Is de gedragsverandering acuut ontstaan (< 24 uur)?', opties: ['Ja', 'Nee, geleidelijk'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'ge_2', vraag: 'Is er sprake van (zelf)verwondingsgevaar?', opties: ['Ja, acuut gevaar', 'Mogelijk risico', 'Nee'], urgentieImpact: { 'Ja, acuut gevaar': 'U1', 'Mogelijk risico': 'U3' } },
      { id: 'ge_3', vraag: 'Is er een fluctuerend bewustzijn (helder \u2194 verward)?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'ge_4', vraag: 'Zijn er aanwijzingen voor een somatische oorzaak (koorts, pijn, urineretentie)?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'ge_5', vraag: 'Is er recent medicatie gewijzigd?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: {} },
    ],
  },
  {
    id: 'pijn_buik',
    naam: 'Buikpijn',
    icon: '\uD83E\uDDB7',
    toelichting: 'Abdominale pijn, misselijkheid, braken, obstipatie',
    discriminatoren: [
      { id: 'bu_1', vraag: 'Is de buik hard en opgezet?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'bu_2', vraag: 'Is er sprake van bloed bij ontlasting of braken?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'bu_3', vraag: 'Hoe lang bestaan de klachten?', opties: ['< 6 uur', '6-24 uur', '> 24 uur'], urgentieImpact: { '< 6 uur': 'U3' } },
      { id: 'bu_4', vraag: 'Is er sprake van niet kunnen plassen (urineretentie)?', opties: ['Ja', 'Nee', 'Onbekend'], urgentieImpact: { 'Ja': 'U3' } },
      { id: 'bu_5', vraag: 'Heeft de pati\u00EBnt de afgelopen 3 dagen ontlasting gehad?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Nee': 'U4' } },
    ],
  },
  {
    id: 'huid',
    naam: 'Huidproblemen / Wonden',
    icon: '\uD83E\uDE79',
    toelichting: 'Decubitus, roodheid, wonddehiscentie, allergische reactie',
    discriminatoren: [
      { id: 'hu_1', vraag: 'Is er sprake van een allergische reactie met zwelling van gezicht/keel?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U1' } },
      { id: 'hu_2', vraag: 'Is de wond actief bloedend en niet te stelpen?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U2' } },
      { id: 'hu_3', vraag: 'Zijn er tekenen van wondinfectie (roodheid, warmte, pus)?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U3' } },
      { id: 'hu_4', vraag: 'Welke graad decubitus (indien van toepassing)?', opties: ['Graad 1 (roodheid)', 'Graad 2 (blaar/oppervlakkig)', 'Graad 3-4 (diep)', 'Niet van toepassing'], urgentieImpact: { 'Graad 3-4 (diep)': 'U3' } },
      { id: 'hu_5', vraag: 'Is er sprake van koorts bij de wond?', opties: ['Ja', 'Nee'], urgentieImpact: { 'Ja': 'U3' } },
    ],
  },
];

// ABCDE-vitale parameters invoer
window.abcdeParameters = [
  { id: 'ademfrequentie', label: 'Ademfrequentie', eenheid: '/min', normaal: '12-20', type: 'number', placeholder: 'bv. 18' },
  { id: 'saturatie', label: 'SpO2 (saturatie)', eenheid: '%', normaal: '> 94%', type: 'number', placeholder: 'bv. 96' },
  { id: 'polsfrequentie', label: 'Polsfrequentie', eenheid: '/min', normaal: '60-100', type: 'number', placeholder: 'bv. 78' },
  { id: 'bloeddruk_sys', label: 'Bloeddruk systolisch', eenheid: 'mmHg', normaal: '100-150', type: 'number', placeholder: 'bv. 130' },
  { id: 'bloeddruk_dia', label: 'Bloeddruk diastolisch', eenheid: 'mmHg', normaal: '60-90', type: 'number', placeholder: 'bv. 80' },
  { id: 'temperatuur', label: 'Temperatuur', eenheid: '\u00B0C', normaal: '36.0-37.5', type: 'number', placeholder: 'bv. 37.2' },
  { id: 'bewustzijn_avpu', label: 'Bewustzijn (AVPU)', eenheid: '', normaal: 'Alert', type: 'select', opties: ['Alert', 'Voice (reageert op aanspreken)', 'Pain (reageert op pijn)', 'Unresponsive'] },
  { id: 'pijnscore', label: 'Pijnscore (NRS)', eenheid: '/10', normaal: '0-3', type: 'range', min: 0, max: 10 },
];

// Urgentie niveaus conform NTS
window.urgentieNiveaus = {
  U0: { label: 'U0 \u2014 Reanimatie', kleur: '#2D2D2D', achtergrond: '#E8E8E8', icon: '\u26AB', beschrijving: 'Directe reanimatie noodzakelijk. BLS/ALS protocol starten. 112 bellen.', reactietijd: 'Onmiddellijk' },
  U1: { label: 'U1 \u2014 Levensbedreigend', kleur: '#D94F4F', achtergrond: '#FCEAEA', icon: '\uD83D\uDD34', beschrijving: 'Potentieel levensbedreigend. Directe medische interventie vereist.', reactietijd: 'Binnen 15 minuten' },
  U2: { label: 'U2 \u2014 Spoed', kleur: '#E8732A', achtergrond: '#FFF3EB', icon: '\uD83D\uDFE0', beschrijving: 'Spoedgeval. Snelle medische beoordeling noodzakelijk.', reactietijd: 'Binnen 1 uur' },
  U3: { label: 'U3 \u2014 Urgent', kleur: '#4A7FB5', achtergrond: '#EBF2F9', icon: '\uD83D\uDD35', beschrijving: 'Urgent maar niet acuut bedreigend. Beoordeling op korte termijn.', reactietijd: 'Binnen 3 uur' },
  U4: { label: 'U4 \u2014 Niet urgent', kleur: '#2D9D78', achtergrond: '#E8F5F0', icon: '\uD83D\uDFE2', beschrijving: 'Niet-urgent. Kan wachten op reguliere dienst.', reactietijd: 'Binnen 24 uur' },
  U5: { label: 'U5 \u2014 Advies', kleur: '#666666', achtergrond: '#F7F7F7', icon: '\u26AA', beschrijving: 'Geen acute zorgvraag. Telefonisch advies volstaat.', reactietijd: 'Volgende werkdag' },
};
