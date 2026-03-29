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
  geboortedatum: "14 maart 1941",
  leeftijd: 84,
  kamer: "Zonnehof \u00B7 Kamer 14B",
  diagnose: "Dementie (fase 2), hartfalen (NYHA II)",
  reablement: {
    startdatum: "2 januari 2026",
    einddatum: "30 juni 2027",
    fase: "Fase 1 \u2014 Stabilisatie",
    voortgang: 34,
    coordinatorNaam: "Annemiek de Vries (SO Eigen)",
  },
  behandelplan: [
    { onderdeel: "Medicatie", status: "Actueel", bijgewerkt: "gisteren" },
    { onderdeel: "Voedingsplan", status: "Actueel", bijgewerkt: "3 dagen geleden" },
    { onderdeel: "Beweging", status: "Aandacht gevraagd", bijgewerkt: "1 week geleden" },
    { onderdeel: "Pijn & comfort", status: "Actueel", bijgewerkt: "vandaag" },
  ],
  bezoeken: [
    { datum: "Vandaag 14:00", type: "Familiebezoek", persoon: "Dochter M. Jansen", duur: "1 uur" },
    { datum: "Morgen 10:00", type: "SO Eigen", persoon: "Dr. A. de Vries", duur: "30 min" },
    { datum: "Overmorgen 09:00", type: "Fysiotherapie", persoon: "L. Bakker", duur: "45 min" },
    { datum: "Vrijdag 15:00", type: "Familiebezoek", persoon: "Zoon P. Jansen", duur: "2 uur" },
  ],
  openConsulten: [
    { id: "C-2041", ingediend: "Vandaag 08:32", status: "In behandeling", urgentie: "U2 \u2014 Dringend", toewijzing: "CT-arts GeriCall" },
  ],
};

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

window.triageCategorieen = [
  "Bewustzijn / verwardheid",
  "Pijn (borst, buik, hoofd)",
  "Ademhaling / benauwdheid",
  "Val / letsel",
  "Koorts / infectie",
  "Gedragsverandering",
];
