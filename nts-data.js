// NTS Triage — criteria per ingangsklacht + urgentie-algoritme

window.ntsCriteria = {
  bewustzijn: [
    { vraag: 'Is de pati\u00EBnt niet aanspreekbaar?', hint: 'Reageert niet op aanspreken of aanraken', urgUp: true },
    { vraag: 'Zijn de pupillen ongelijk of zijn er uitvalsverschijnselen?', hint: 'Scheef gezicht, arm/been niet kunnen bewegen', urgUp: true },
    { vraag: 'Is de verwardheid acuut opgetreden?', hint: 'Verschil t.o.v. normaal gedrag van deze bewoner', urgUp: true },
    { vraag: 'Is de pati\u00EBnt aanspreekbaar maar gedesori\u00EBnteerd?', hint: 'Weet niet waar hij/zij is of welke dag het is', urgUp: false },
  ],
  koorts: [
    { vraag: 'Is de temperatuur hoger dan 40\u00B0C?', hint: 'Gemeten met thermometer', urgUp: true },
    { vraag: 'Zijn er tekenen van sepsis?', hint: 'Koorts + verlaagd bewustzijn + snelle pols', urgUp: true },
    { vraag: 'Behoort de pati\u00EBnt tot een risicogroep?', hint: '> 80 jaar, immuungecompromitteerd, diabetes', urgUp: false },
    { vraag: 'Heeft de pati\u00EBnt al meer dan 3 dagen koorts?', hint: 'Zonder verbetering ondanks behandeling', urgUp: false },
  ],
  val: [
    { vraag: 'Was er bewustzijnsverlies na de val?', hint: 'Even weg geweest, niet meer weten wat er gebeurd is', urgUp: true },
    { vraag: 'Klaagt de pati\u00EBnt over hevige pijn (> 7/10)?', hint: 'NRS pijnscore 7 of hoger', urgUp: true },
    { vraag: 'Is er een zichtbare botbreuk of afwijkende stand?', hint: 'Vervorming, onnatuurlijke hoek', urgUp: true },
    { vraag: 'Kan de pati\u00EBnt zelfstandig bewegen?', hint: 'Opstaan, lopen, arm/been bewegen', urgUp: false },
  ],
  pijn_borst: [
    { vraag: 'Straalt de pijn uit naar kaak, arm of rug?', hint: 'Typische uitstraling bij hartproblemen', urgUp: true },
    { vraag: 'Is er sprake van transpireren of bleekheid?', hint: 'Koud zweet, grauw gezicht', urgUp: true },
    { vraag: 'Is de pijn acuut ontstaan (< 12 uur)?', hint: 'Plotseling begonnen', urgUp: true },
    { vraag: 'Heeft pati\u00EBnt bekende hartproblemen?', hint: 'Hartfalen, eerder infarct, stent', urgUp: false },
  ],
  dyspnoe: [
    { vraag: 'Kan de pati\u00EBnt niet meer in zinnen spreken?', hint: 'Alleen losse woorden of niet spreken', urgUp: true },
    { vraag: 'Is de saturatie lager dan 90%?', hint: 'Gemeten met saturatiemeter', urgUp: true },
    { vraag: 'Is de benauwdheid acuut ontstaan (< 2 uur)?', hint: 'Plotseling benauwd geworden', urgUp: true },
    { vraag: 'Is er sprake van piepende ademhaling?', hint: 'Hoorbaar piepen bij uitademen', urgUp: false },
  ],
  gedrag: [
    { vraag: 'Is er sprake van zelfverwondingsgevaar?', hint: 'Slaat, bijt, krabt zichzelf of anderen', urgUp: true },
    { vraag: 'Is de gedragsverandering acuut (< 24 uur)?', hint: 'Vandaag of gisteren begonnen', urgUp: true },
    { vraag: 'Is er een fluctuerend bewustzijn?', hint: 'Afwisselend helder en verward', urgUp: false },
    { vraag: 'Is er recent medicatie gewijzigd?', hint: 'Nieuwe medicatie of dosiswijziging', urgUp: false },
  ],
  buikpijn: [
    { vraag: 'Is de buik hard en opgezet?', hint: 'Gespannen buik, pijnlijk bij aanraken', urgUp: true },
    { vraag: 'Is er bloed bij ontlasting of braken?', hint: 'Rood bloed of koffiedik-braken', urgUp: true },
    { vraag: 'Is er sprake van niet kunnen plassen?', hint: 'Urineretentie, volle blaas', urgUp: false },
    { vraag: 'Heeft pati\u00EBnt al 3+ dagen geen ontlasting?', hint: 'Obstipatie', urgUp: false },
  ],
  huid: [
    { vraag: 'Is er een allergische reactie met zwelling gezicht/keel?', hint: 'Angio-oedeem, moeite met slikken', urgUp: true },
    { vraag: 'Is de wond actief bloedend en niet te stelpen?', hint: 'Ondanks druk uitoefenen', urgUp: true },
    { vraag: 'Zijn er tekenen van wondinfectie?', hint: 'Roodheid, warmte, pus, koorts erbij', urgUp: false },
    { vraag: 'Is er sprake van decubitus graad 3-4?', hint: 'Diep, tot op bot/spier', urgUp: false },
  ],
  urinewegen: [
    { vraag: 'Is er koorts bij de urinewegklachten?', hint: '> 38.5\u00B0C met dysurie of flankpijn', urgUp: true },
    { vraag: 'Is er zichtbaar bloed in de urine?', hint: 'Rode of bruine urine', urgUp: true },
    { vraag: 'Is er urineretentie (> 8 uur niet geplast)?', hint: 'Volle blaas, pijnlijk', urgUp: false },
    { vraag: 'Zijn er catheterklachten?', hint: 'Verstopping, lekkage, pijn', urgUp: false },
  ],
  pijn_alg: [
    { vraag: 'Is de pijnscore 8 of hoger (NRS)?', hint: 'Ernstige pijn', urgUp: true },
    { vraag: 'Is de pijn acuut ontstaan?', hint: 'Plotseling, niet geleidelijk', urgUp: true },
    { vraag: 'Reageert de pijn niet op huidige medicatie?', hint: 'Paracetamol/tramadol helpt niet', urgUp: false },
    { vraag: 'Is er een bekende oorzaak?', hint: 'Fractuur, wond, post-operatief', urgUp: false },
  ],
};

// Ingangsklachten met mapping naar criteria-key
window.ntsKlachtenLijst = [
  { id: 'bewustzijn', label: 'Bewustzijnsstoornis', labelEN: 'Consciousness disorder', desc: 'Verminderd bewustzijn; niet aanspreekbaar; verwardheid', descEN: 'Reduced consciousness; unresponsive; confusion', icon: '\uD83E\uDDE0' },
  { id: 'pijn_borst', label: 'Pijn op de borst', labelEN: 'Chest pain', desc: 'Retrosternale pijn; druk op de borst; uitstraling', descEN: 'Retrosternal pain; chest pressure; radiation', icon: '\u2764\uFE0F' },
  { id: 'dyspnoe', label: 'Benauwdheid / Dyspnoe', labelEN: 'Breathlessness / Dyspnea', desc: 'Kortademigheid; ademhalingsproblemen; saturatiedaling', descEN: 'Shortness of breath; respiratory problems; desaturation', icon: '\uD83C\uDF2C\uFE0F' },
  { id: 'val', label: 'Val / Trauma', labelEN: 'Fall / Trauma', desc: 'Val uit hoogte; van bed; heupletsel; hoofdletsel', descEN: 'Fall from height; from bed; hip injury; head injury', icon: '\u26A0\uFE0F' },
  { id: 'koorts', label: 'Koorts / Infectie', labelEN: 'Fever / Infection', desc: 'Temperatuurverhoging; rillingen; infectieverschijnselen', descEN: 'Elevated temperature; chills; signs of infection', icon: '\uD83C\uDF21\uFE0F' },
  { id: 'gedrag', label: 'Gedragsverandering / Delier', labelEN: 'Behavioral change / Delirium', desc: 'Agitatie; onrust; hallucinaties; dag-nachtritme verstoord', descEN: 'Agitation; restlessness; hallucinations; disrupted rhythm', icon: '\uD83D\uDCA4' },
  { id: 'buikpijn', label: 'Buikpijn', labelEN: 'Abdominal pain', desc: 'Abdominale pijn; misselijkheid; braken; obstipatie', descEN: 'Abdominal pain; nausea; vomiting; constipation', icon: '\uD83E\uDDB7' },
  { id: 'huid', label: 'Huidproblemen / Wonden', labelEN: 'Skin problems / Wounds', desc: 'Decubitus; roodheid; wonddehiscentie; allergische reactie', descEN: 'Pressure sores; redness; wound dehiscence; allergic reaction', icon: '\uD83E\uDE79' },
  { id: 'urinewegen', label: 'Urinewegproblemen', labelEN: 'Urinary problems', desc: 'Dysurie; hematurie; urineretentie; catheterklachten', descEN: 'Dysuria; hematuria; retention; catheter issues', icon: '\uD83D\uDCA7' },
  { id: 'pijn_alg', label: 'Pijn algemeen', labelEN: 'General pain', desc: 'Acute pijn zonder duidelijke focus; pijnscore \u2265 7/10', descEN: 'Acute pain without clear focus; pain score \u2265 7/10', icon: '\uD83D\uDCA2' },
];

// Urgentie bepalen
window.bepaalNTSUrgentie = function(abcd, criteriaAntwoorden, klachtId) {
  var abcdInstabiel = Object.values(abcd).some(function(v) { return v === 'nee'; });
  if (abcdInstabiel) {
    var aantalNee = Object.values(abcd).filter(function(v) { return v === 'nee'; }).length;
    return aantalNee >= 2 ? 'U0' : 'U1';
  }
  var criteria = window.ntsCriteria[klachtId] || [];
  var urgVerhogend = 0;
  var positief = 0;
  criteriaAntwoorden.forEach(function(ans, i) {
    if (ans) {
      positief++;
      if (criteria[i] && criteria[i].urgUp) urgVerhogend++;
    }
  });
  if (urgVerhogend >= 2) return 'U2';
  if (urgVerhogend === 1 || positief >= 2) return 'U3';
  if (positief === 1) return 'U4';
  return 'U5';
};

// Urgentie metadata
window.urgentieInfo = {
  U0: { label: 'U0 \u2014 Reanimatie', kleur: '#8B0000', bg: '#FCEAEA', actie: 'Direct 112 bellen; arts informeren', actieEN: 'Call 112 immediately; inform doctor', icon: '\uD83D\uDEA8' },
  U1: { label: 'U1 \u2014 Levensgevaar', kleur: '#D94F4F', bg: '#FCEAEA', actie: 'Direct CT-arts bellen; ambulance', actieEN: 'Call CT doctor immediately; ambulance', icon: '\uD83D\uDEA8' },
  U2: { label: 'U2 \u2014 Spoed', kleur: '#E8732A', bg: '#FFF3EB', actie: 'Arts binnen 1 uur via GeriForce; DCR aanmaken', actieEN: 'Doctor within 1 hour via GeriForce; create DCR', icon: '\uD83D\uDCDE' },
  U3: { label: 'U3 \u2014 Dringend', kleur: '#D4A017', bg: '#FFF9E6', actie: 'Terugbelafspraak plannen; arts beoordeelt visite', actieEN: 'Schedule callback; doctor assesses visit need', icon: '\uD83D\uDCDE' },
  U4: { label: 'U4 \u2014 Niet dringend', kleur: '#4A7FB5', bg: '#EBF2F9', actie: 'DCR aanmaken; arts beoordeelt bij volgende ronde', actieEN: 'Create DCR; doctor assesses at next round', icon: '\uD83D\uDCCB' },
  U5: { label: 'U5 \u2014 Advies', kleur: '#2D9D78', bg: '#E8F5F0', actie: 'Zelfzorgadvies; instelling informeren; geen arts nodig', actieEN: 'Self-care advice; inform facility; no doctor needed', icon: '\u2139\uFE0F' },
};

// Demo persona's met prefilled geboortedatum
window.ntsPersonas = [
  { naam: 'Mevr. Bakker', geboortedatum: '1942-03-15', klacht: 'koorts', observatie: 'Pati\u00EBnte klaagt over rillingen en voelt erg warm aan. Thermometer 39,2\u00B0C. Al 2 dagen niet gegeten.', observatieEN: 'Patient complains of chills and feels very warm. Thermometer 39.2\u00B0C. Has not eaten for 2 days.' },
  { naam: 'Dhr. Jansen', geboortedatum: '1949-07-22', klacht: 'bewustzijn', observatie: 'Meneer reageert nauwelijks op aanspreken; is slap en heeft een asgrauw gezicht.', observatieEN: 'Patient barely responds to speech; is limp and has an ashen face.' },
  { naam: 'Mevr. De Vries', geboortedatum: '1935-11-28', klacht: 'val', observatie: 'Mevrouw is uit bed gevallen. Kan zelf weer opstaan. Lichte schaafwond op knie. Geen pijn hoofd.', observatieEN: 'Patient fell out of bed. Can stand up by herself. Minor scrape on knee. No head pain.' },
];

// ── VVT Controles: veldspecificaties ──
window.controleVelden = [
  { id: 'hartslag', label: 'Hartslag', labelEN: 'Heart rate', eenheid: '/min', type: 'int', normaal: '60-100', warn: [40, 140], danger: [20, 180] },
  { id: 'bloeddruk_sys', label: 'Bloeddruk systolisch', labelEN: 'BP systolic', eenheid: 'mmHg', type: 'int', normaal: '100-140', warn: [90, 160], danger: [70, 200] },
  { id: 'bloeddruk_dia', label: 'Bloeddruk diastolisch', labelEN: 'BP diastolic', eenheid: 'mmHg', type: 'int', normaal: '60-90', warn: [50, 100], danger: [30, 150] },
  { id: 'saturatie', label: 'Saturatie (SpO\u2082)', labelEN: 'Saturation (SpO\u2082)', eenheid: '%', type: 'int', normaal: '\u2265 95', warn: [90, 100], danger: [85, 100] },
  { id: 'temperatuur', label: 'Temperatuur', labelEN: 'Temperature', eenheid: '\u00B0C', type: 'decimal', normaal: '36.5-37.5', warn: [37.5, 39.0], danger: [38.5, 42.0] },
  { id: 'ademfrequentie', label: 'Ademhalingsfreq.', labelEN: 'Respiratory rate', eenheid: '/min', type: 'int', normaal: '12-20', warn: [10, 30], danger: [5, 40] },
  { id: 'glucose', label: 'Glucosewaarde', labelEN: 'Glucose', eenheid: 'mmol/L', type: 'decimal', normaal: '4.0-8.0', warn: [3.5, 15.0], danger: [2.0, 25.0] },
];

window.getControleStatus = function(veld, waarde) {
  if (!waarde && waarde !== 0) return 'empty';
  var v = parseFloat(waarde);
  if (isNaN(v)) return 'empty';
  if (v < veld.danger[0] || v > veld.danger[1]) return 'danger';
  if (v < veld.warn[0] || v > veld.warn[1]) return 'warning';
  return 'normal';
};

window.checkControleSignalen = function(controles) {
  var signalen = [];
  if (controles.saturatie && parseFloat(controles.saturatie) < 90)
    signalen.push({ tekst: 'Saturatie < 90%', tekstEN: 'Saturation < 90%', ernst: 'danger' });
  if (controles.bloeddruk_sys && parseFloat(controles.bloeddruk_sys) < 90)
    signalen.push({ tekst: 'Bloeddruk < 90 systolisch', tekstEN: 'BP < 90 systolic \u2014 possible shock', ernst: 'danger' });
  if (controles.hartslag && (parseFloat(controles.hartslag) > 130 || parseFloat(controles.hartslag) < 40))
    signalen.push({ tekst: 'Hartslag sterk afwijkend', tekstEN: 'Heart rate abnormal', ernst: 'warning' });
  if (controles.temperatuur && parseFloat(controles.temperatuur) > 39.5)
    signalen.push({ tekst: 'Koorts > 39.5\u00B0C', tekstEN: 'Fever > 39.5\u00B0C', ernst: 'warning' });
  return signalen;
};

window.ntsPersonaControles = {
  'Mevr. Bakker': { hartslag: '98', bloeddruk_sys: '118', bloeddruk_dia: '74', saturatie: '96', temperatuur: '39.2' },
  'Dhr. Jansen': { hartslag: '132', bloeddruk_sys: '78', bloeddruk_dia: '42', saturatie: '84', temperatuur: '37.1' },
  'Mevr. De Vries': { hartslag: '76', bloeddruk_sys: '128', bloeddruk_dia: '80', saturatie: '97', temperatuur: '36.8' },
};

// Handelingsadviezen met media links
window.handelingsAdviezen = {
  U0: [
    { tekst: 'Start reanimatie (BLS/ALS protocol)', tekstEN: 'Start resuscitation (BLS/ALS protocol)', prioriteit: 'direct', media: { type: 'video', url: 'https://www.youtube.com/results?search_query=BLS+reanimatie+ouderen', label: 'Reanimatie instructievideo' } },
    { tekst: 'Bel 112', tekstEN: 'Call 112', prioriteit: 'direct' },
    { tekst: 'Haal AED indien beschikbaar', tekstEN: 'Get AED if available', prioriteit: 'direct', media: { type: 'afbeelding', url: 'https://www.hartstichting.nl/aed', label: 'AED handleiding' } },
  ],
  U1: [
    { tekst: 'Pati\u00EBnt niet alleen laten', tekstEN: 'Do not leave patient alone', prioriteit: 'direct' },
    { tekst: 'Vrije ademweg waarborgen (stabiele zijligging)', tekstEN: 'Ensure clear airway (recovery position)', prioriteit: 'direct', media: { type: 'afbeelding', url: 'https://www.rodekruis.nl/ehbo/stabiele-zijligging/', label: 'Stabiele zijligging' } },
    { tekst: 'Zuurstof toedienen indien beschikbaar', tekstEN: 'Administer oxygen if available', prioriteit: 'direct' },
    { tekst: 'Bel CT-arts GeriCall', tekstEN: 'Call CT doctor GeriCall', prioriteit: 'direct' },
    { tekst: 'Vitalen monitoren (continu)', tekstEN: 'Monitor vitals (continuous)', prioriteit: 'direct' },
  ],
  U2: [
    { tekst: 'Pati\u00EBnt comfortabel en veilig positioneren', tekstEN: 'Position patient comfortably and safely', prioriteit: 'direct' },
    { tekst: 'Vitalen monitoren (elke 15 minuten)', tekstEN: 'Monitor vitals (every 15 minutes)', prioriteit: 'direct' },
    { tekst: 'Niets eten of drinken geven tot arts contact', tekstEN: 'Nothing to eat or drink until doctor contact', prioriteit: 'afwachten' },
    { tekst: 'Relevante medicatie klaarzetten', tekstEN: 'Prepare relevant medication', prioriteit: 'afwachten' },
    { tekst: 'Pijnstilling overwegen (paracetamol)', tekstEN: 'Consider pain relief (paracetamol)', prioriteit: 'afwachten', media: { type: 'info', url: 'https://www.thuisarts.nl/pijnstillers', label: 'Pijnstilling richtlijn' } },
  ],
  U3: [
    { tekst: 'Vitalen vastleggen (zie controles)', tekstEN: 'Record vitals (see controls)', prioriteit: 'direct' },
    { tekst: 'Pati\u00EBnt observeren op verslechtering', tekstEN: 'Observe patient for deterioration', prioriteit: 'direct', media: { type: 'info', url: 'https://www.vilans.nl/kennis/signaleren-in-de-ouderenzorg', label: 'Signaleren verslechtering' } },
    { tekst: 'Zorg voor comfort (pijnstilling, warmte)', tekstEN: 'Ensure comfort (pain relief, warmth)', prioriteit: 'direct' },
    { tekst: 'Informeer collega op de afdeling', tekstEN: 'Inform colleague on the ward', prioriteit: 'afwachten' },
    { tekst: 'Vochtinname bevorderen indien geen slikproblemen', tekstEN: 'Encourage fluid intake if no swallowing issues', prioriteit: 'afwachten' },
  ],
  U4: [
    { tekst: 'Wond/letsel verzorgen indien van toepassing', tekstEN: 'Treat wound/injury if applicable', prioriteit: 'direct', media: { type: 'video', url: 'https://www.youtube.com/results?search_query=wondzorg+ouderen+verpleeghuis', label: 'Wondzorg instructie' } },
    { tekst: 'Situatie rapporteren in het dossier', tekstEN: 'Report situation in records', prioriteit: 'direct' },
    { tekst: 'Pati\u00EBnt geruststellen', tekstEN: 'Reassure patient', prioriteit: 'direct' },
    { tekst: 'Valpreventie maatregelen controleren', tekstEN: 'Check fall prevention measures', prioriteit: 'afwachten', media: { type: 'info', url: 'https://www.veiligheid.nl/valpreventie/interventies/in-het-verpleeghuis', label: 'Valpreventie checklist' } },
  ],
  U5: [
    { tekst: 'Zelfzorgadvies geven aan pati\u00EBnt/bewoner', tekstEN: 'Give self-care advice to patient/resident', prioriteit: 'direct' },
    { tekst: 'Vastleggen in rapportage', tekstEN: 'Document in report', prioriteit: 'direct' },
  ],
};
