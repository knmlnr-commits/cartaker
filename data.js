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

window.patient = {
  naam: "Dhr. A. Jansen",
  roepnaam: "Adriaan",
  geboortedatum: "14 maart 1941",
  leeftijd: 84,
  kamer: "Zonnehof \u00B7 Kamer 14B",
  foto: null,
  diagnose: "Dementie (fase 2), hartfalen (NYHA II)",
  reablement: {
    startdatum: "2 januari 2026",
    einddatum: "30 juni 2027",
    fase: "Fase 1 \u2014 Stabilisatie",
    voortgang: 34,
    coordinatorNaam: "Annemiek de Vries (SO Eigen)",
  },
  behandelplan: [
    { onderdeel: "Medicatie", status: "Actueel", bijgewerkt: "gisteren", toelichting: "Metoprolol 50mg 2x daags, Furosemide 40mg 1x, Rivastigmine pleister 9.5mg/24u. Geen wijzigingen." },
    { onderdeel: "Voedingsplan", status: "Actueel", bijgewerkt: "3 dagen geleden", toelichting: "Natriumbeperkt dieet, 1.5L vochtbeperking. Eiwitverrijkt. Bijvoeding bij lunch." },
    { onderdeel: "Beweging", status: "Aandacht gevraagd", bijgewerkt: "1 week geleden", toelichting: "Looptraining 2x daags 10 min. Valt achteruit sinds vorige week \u2014 fysiotherapie ge\u00EFntensiveerd." },
    { onderdeel: "Pijn & comfort", status: "Actueel", bijgewerkt: "vandaag", toelichting: "NRS stabiel 2-3. Paracetamol 3x 1000mg zo nodig. Nachtrust verbeterd." },
  ],
  openConsulten: [
    { id: "C-2041", ingediend: "Vandaag 08:32", status: "In behandeling", urgentie: "U2 \u2014 Dringend", toewijzing: "CT-arts GeriCall", beschrijving: "Toenemende verwardheid sinds gisteravond" },
  ],
};

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

// ── Familie leden ──
window.familieleden = [
  { naam: 'Martha Jansen', relatie: 'Dochter', telefoon: '06-1234****', bezoekfrequentie: '3x per week', laatsteBezoek: 'Gisteren', isHoofdcontact: true },
  { naam: 'Peter Jansen', relatie: 'Zoon', telefoon: '06-5678****', bezoekfrequentie: '1x per week', laatsteBezoek: '4 dagen geleden', isHoofdcontact: false },
];

window.verzorgendeModules = [
  { naam: "Fundament Spoedzorg 1 \u2014 Kwetsbare ouderen", status: "certificaat", voortgang: 100, beschrijving: "Leer de basisprincipes van spoedzorg bij kwetsbare ouderen, inclusief herkenning van acute situaties en eerste handelingen." },
  { naam: "Hartfalen herkennen", status: "bezig", voortgang: 60, beschrijving: "Verdiep je kennis over de signalen en symptomen van hartfalen bij ouderen en leer hoe je adequaat kunt handelen." },
  { naam: "ABCDE bij dementie", status: "niet_gestart", voortgang: 0, beschrijving: "Een systematische aanpak voor het beoordelen van acute situaties bij pati\u00EBnten met dementie." },
];

window.familieModules = [
  { naam: "Bewegen met je naaste", status: "bezig", voortgang: 40, beschrijving: "Praktische oefeningen en tips om samen met uw naaste in beweging te blijven, afgestemd op de mogelijkheden." },
  { naam: "Medicijnen begrijpen", status: "niet_gestart", voortgang: 0, beschrijving: "Begrijp welke medicijnen uw naaste gebruikt, waarvoor ze dienen en waar u op moet letten." },
  { naam: "Omgaan met dementie thuis", status: "niet_gestart", voortgang: 0, beschrijving: "Handvatten voor het dagelijks omgaan met dementie in de thuissituatie, met aandacht voor communicatie en veiligheid." },
];

window.gedeeldeModule = {
  naam: "Beweging bij hartfalen \u2014 voor mantelzorgers",
  voltooid: 2,
  totaal: 5,
  beschrijving: "Deze module helpt mantelzorgers om veilig en effectief bewegingsoefeningen te begeleiden bij pati\u00EBnten met hartfalen.",
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
