// GeriCall — Volledige vertalingen NL + EN
// Voor normaal + uitgebreid interface

window.ui = function(key) {
  var taal = window.appTaal || 'nl';
  var entry = window.uiVertalingen[key];
  if (!entry) return key;
  return entry[taal] || entry.nl || key;
};

window.appTaal = 'nl';

window.uiVertalingen = {
  // ── Login / Rolkeuze ──
  samenZorgenVoor: { nl: 'Samen zorgen voor', en: 'Caring together for' },
  ikWerkInDeZorg: { nl: 'Ik werk in de zorg', en: 'I work in care' },
  ikBenFamilie: { nl: 'Ik ben familie / pati\u00EBnt', en: "I'm family / patient" },
  doelZorg: { nl: 'Doel: dagelijkse zorg uitvoeren en rapporteren', en: 'Goal: provide daily care and report' },
  doelFamilie: { nl: 'Doel: betrokken blijven en samenwerken', en: 'Goal: stay involved and collaborate' },
  prototype: { nl: 'Prototype', en: 'Prototype' },
  authDisclaimer: { nl: 'authenticatie via DigiD/UZI-pas wordt bij implementatie toegevoegd', en: 'authentication via DigiD/UZI will be added at implementation' },
  inloggenAlsZorg: { nl: 'Inloggen als zorgmedewerker', en: 'Log in as care worker' },
  selecteerProfiel: { nl: 'Selecteer uw profiel', en: 'Select your profile' },
  rechtenGekoppeld: { nl: 'rechten zijn gekoppeld aan uw rol', en: 'access is linked to your role' },
  wieBenJe: { nl: 'Wie ben je?', en: 'Who are you?' },
  selecteerNaam: { nl: 'Selecteer je naam', en: 'Select your name' },
  watJeZiet: { nl: 'wat je ziet is afgestemd op je rol', en: 'what you see is tailored to your role' },
  authUZI: { nl: 'authenticatie via UZI-pas wordt bij implementatie toegevoegd', en: 'UZI card authentication will be added at implementation' },
  authDigiD: { nl: 'authenticatie via DigiD wordt bij implementatie toegevoegd', en: 'DigiD authentication will be added at implementation' },
  terug: { nl: 'Terug', en: 'Back' },

  // ── Rol labels ──
  verpleegkundige: { nl: 'Verpleegkundige', en: 'Nurse' },
  verzorgende: { nl: 'Verzorgende IG', en: 'Care worker' },
  helpende: { nl: 'Helpende', en: 'Care assistant' },
  gezin: { nl: 'Gezin', en: 'Family' },
  ondersteuner: { nl: 'Ondersteuner', en: 'Supporter' },
  patient: { nl: 'Pati\u00EBnt', en: 'Patient' },

  // ── Rol doelen ──
  doelVerpleegkundige: { nl: 'Regie over zorgproces en klinische besluitvorming', en: 'Oversight of care process and clinical decisions' },
  doelVerzorgende: { nl: 'Dagelijkse zorg uitvoeren en signaleren', en: 'Provide daily care and report signals' },
  doelHelpende: { nl: 'Basiszorg en ondersteuning bieden', en: 'Provide basic care and support' },
  doelGezin: { nl: 'Actief meezorgen en beslissingen nemen', en: 'Actively co-care and make decisions' },
  doelOndersteuner: { nl: 'Betrokken blijven en praktisch helpen', en: 'Stay involved and help practically' },
  doelPatient: { nl: 'Inzicht in eigen dag en contact met familie', en: 'Insight into your day and family contact' },

  // ── Rechten tags ──
  volledigDossier: { nl: 'Volledig dossier en EPD', en: 'Full records and EHR' },
  consultenBeheren: { nl: 'Consulten beheren en escaleren', en: 'Manage and escalate consults' },
  ntsTriage: { nl: 'NTS-triage en meldingen', en: 'NTS triage and reports' },
  iotVitalen: { nl: 'IoT vitalen en lab-aanvragen', en: 'IoT vitals and lab requests' },
  takenRapportage: { nl: 'Taken, rapportage en e-learning', en: 'Tasks, reports and e-learning' },
  takenAfvinken: { nl: 'Taken afvinken en rapporteren', en: 'Complete tasks and report' },
  iotMonitoren: { nl: 'IoT vitalen monitoren', en: 'Monitor IoT vitals' },
  behandelplanRaadplegen: { nl: 'Behandelplan raadplegen', en: 'View care plan' },
  eLearningCert: { nl: 'E-learning en certificaten', en: 'E-learning and certificates' },
  takenAfvinkenKort: { nl: 'Taken afvinken', en: 'Complete tasks' },
  rapportageSchrijven: { nl: 'Rapportage schrijven en lezen', en: 'Write and read reports' },
  stemmingBijwerken: { nl: 'Stemming bijwerken', en: 'Update mood' },
  eLearningVolgen: { nl: 'E-learning volgen', en: 'Follow e-learning' },

  // ── Weergave ──
  eenvoudig: { nl: 'Eenvoudig', en: 'Simple' },
  normaal: { nl: 'Normaal', en: 'Normal' },
  uitgebreid: { nl: 'Uitgebreid', en: 'Advanced' },

  // ── Header ──
  uit: { nl: 'Uit', en: 'Out' },
  wissel: { nl: 'Wissel', en: 'Switch' },
  zoek: { nl: 'Zoek', en: 'Search' },
  inst: { nl: 'Inst.', en: 'Settings' },

  // ── Tabs zorg ──
  wijk: { nl: 'Wijk', en: 'Ward' },
  dienst: { nl: 'Dienst', en: 'Shift' },
  melding: { nl: 'Melding', en: 'Alert' },
  leren: { nl: 'Leren', en: 'Learn' },

  // ── Tabs familie ──
  planning: { nl: 'Planning', en: 'Schedule' },
  mijnDag: { nl: 'Mijn dag', en: 'My day' },
  wieKomt: { nl: 'Wie komt?', en: 'Who visits?' },
  familieChat: { nl: 'Familie chat', en: 'Family chat' },

  // ── Wijk overzicht ──
  mijnBewonersVol: { nl: 'Mijn bewoners', en: 'My residents' },
  bewoners: { nl: 'Bewoners', en: 'Residents' },
  takenOpen: { nl: 'Taken open', en: 'Tasks open' },
  alerts: { nl: 'Alerts', en: 'Alerts' },
  dienstVandaag: { nl: 'Dienst vandaag', en: 'Shift today' },
  afdelingZonnehof: { nl: 'Afdeling Zonnehof', en: 'Ward Zonnehof' },
  bewonersInUwWijk: { nl: 'bewoners in uw wijk', en: 'residents in your ward' },
  kamer: { nl: 'Kamer', en: 'Room' },
  taken: { nl: 'taken', en: 'tasks' },
  alleTakenAfgerond: { nl: 'Alle taken afgerond!', en: 'All tasks completed!' },
  wijkOverzicht: { nl: 'Wijk overzicht', en: 'Ward overview' },

  // ── Bewoner detail ──
  vitalen: { nl: 'Vitalen', en: 'Vitals' },
  notities: { nl: 'Notities', en: 'Notes' },
  dossier: { nl: 'Dossier', en: 'Records' },
  snelleNotitie: { nl: 'Snelle notitie...', en: 'Quick note...' },
  notitieOpslaan: { nl: 'Notitie opslaan', en: 'Save note' },
  fotoToevoegen: { nl: 'Foto', en: 'Photo' },
  spraaknotitie: { nl: 'Spraaknotitie', en: 'Voice note' },
  nogGeenNotities: { nl: 'Nog geen notities voor deze bewoner', en: 'No notes yet for this resident' },

  // ── Dienst / Rapportage ──
  rapporteren: { nl: 'Rapporteren', en: 'Report' },
  overdracht: { nl: 'Overdracht', en: 'Handover' },
  historie: { nl: 'Historie', en: 'History' },
  soepMethode: { nl: 'SOEP-methode', en: 'SOAP method' },
  vulVeldenIn: { nl: 'vul de relevante velden in voor', en: 'fill in the relevant fields for' },
  subjectief: { nl: 'Subjectief', en: 'Subjective' },
  subjectiefUitleg: { nl: 'Wat zegt/voelt de bewoner? Klachten, wensen, stemming.', en: 'What does the resident say/feel? Complaints, wishes, mood.' },
  objectief: { nl: 'Objectief', en: 'Objective' },
  objectiefUitleg: { nl: 'Wat heb je gemeten/waargenomen? Vitalen, observaties.', en: 'What did you measure/observe? Vitals, observations.' },
  evaluatieLabel: { nl: 'Evaluatie', en: 'Assessment' },
  evaluatieUitleg: { nl: 'Wat is je conclusie? Veranderingen, aandachtspunten.', en: 'What is your conclusion? Changes, attention points.' },
  planLabel: { nl: 'Plan', en: 'Plan' },
  planUitleg: { nl: 'Welke acties? Wat moet de volgende dienst doen?', en: 'Which actions? What should the next shift do?' },
  vitalenOphalen: { nl: 'Vitalen ophalen', en: 'Fetch vitals' },
  zichtbaarVoorFamilie: { nl: 'Zichtbaar voor familie', en: 'Visible to family' },
  rapportageOpslaan: { nl: 'Rapportage opslaan', en: 'Save report' },
  vulMinimaalEenVeld: { nl: 'Vul minimaal \u00E9\u00E9n SOEP-veld in', en: 'Fill in at least one SOAP field' },
  rapportageOpgeslagen: { nl: 'Rapportage opgeslagen (SOEP)', en: 'Report saved (SOAP)' },
  familie: { nl: 'Familie', en: 'Family' },
  intern: { nl: 'Intern', en: 'Internal' },
  geenRapportages: { nl: 'Geen rapportages gevonden', en: 'No reports found' },
  toonAlleRapportages: { nl: 'Toon alle', en: 'Show all' },
  rapportages: { nl: 'rapportages', en: 'reports' },
  print: { nl: 'Print', en: 'Print' },

  // ── Overdracht ──
  dienstOverdracht: { nl: 'Dienst overdracht', en: 'Shift handover' },
  van: { nl: 'Van', en: 'From' },
  naar: { nl: 'Naar', en: 'To' },
  bewonersOverdragen: { nl: 'Bewoners overdragen', en: 'Transfer residents' },
  overgedragen: { nl: 'overgedragen', en: 'transferred' },
  overdragen: { nl: 'Overdragen', en: 'Transfer' },
  sluiten: { nl: 'Sluiten', en: 'Close' },
  selecteerCollega: { nl: 'Selecteer eerst een collega', en: 'Select a colleague first' },
  draagAlleOver: { nl: 'Draag alle bewoners over om de overdracht te versturen', en: 'Transfer all residents to send the handover' },
  verstuurOverdracht: { nl: 'Verstuur volledige overdracht naar', en: 'Send full handover to' },
  overdrachtCompleet: { nl: 'Overdracht compleet', en: 'Handover complete' },
  bewonersOvergedragenAan: { nl: 'bewoners overgedragen aan', en: 'residents transferred to' },
  ontvangtNotificatie: { nl: 'ontvangt een notificatie en moet accepteren', en: 'will receive a notification and must accept' },
  ochtenddienst: { nl: 'Ochtenddienst', en: 'Morning shift' },
  middagdienst: { nl: 'Middagdienst', en: 'Afternoon shift' },
  avonddienst: { nl: 'Avonddienst', en: 'Evening shift' },
  nachtdienst: { nl: 'Nachtdienst', en: 'Night shift' },
  wijzig: { nl: 'Wijzig', en: 'Change' },
  opmerkingVolgende: { nl: 'Algemene opmerking voor volgende dienst...', en: 'General comment for next shift...' },

  // ── Melding / NTS ──
  meldingDoen: { nl: 'Melding doen / Consult aanvragen', en: 'Submit alert / Request consult' },
  belDirectGeriCall: { nl: 'Bel direct GeriCall', en: 'Call GeriCall directly' },
  lopendeMeldingen: { nl: 'Lopende meldingen', en: 'Active alerts' },
  nieuweMelding: { nl: 'Nieuwe melding', en: 'New alert' },
  stap: { nl: 'Stap', en: 'Step' },
  volgende: { nl: 'Volgende', en: 'Next' },
  vorige: { nl: 'Vorige', en: 'Previous' },
  dienIn: { nl: 'Dien melding in', en: 'Submit alert' },

  // ── Stemming ──
  slecht: { nl: 'Slecht', en: 'Bad' },
  matig: { nl: 'Matig', en: 'Fair' },
  redelijk: { nl: 'Redelijk', en: 'OK' },
  goed: { nl: 'Goed', en: 'Good' },
  prima: { nl: 'Prima', en: 'Great' },
  stemmingBijgewerkt: { nl: 'Stemming bijgewerkt', en: 'Mood updated' },
  eerdereUpdates: { nl: 'eerdere updates', en: 'previous updates' },
  verberg: { nl: 'Verberg', en: 'Hide' },

  // ── Familie ──
  hoeGaatHetMet: { nl: 'Hoe gaat het met', en: 'How is' },
  hoeGaatHetVandaag: { nl: 'Hoe gaat het vandaag?', en: 'How are you today?' },
  openBezoekslots: { nl: 'Open bezoekslots', en: 'Open visit slots' },
  dezeWeek: { nl: 'deze week', en: 'this week' },
  familieberichten: { nl: 'Familieberichten', en: 'Family messages' },
  vandaag: { nl: 'vandaag', en: 'today' },
  hoeWasHet: { nl: 'Hoe was het?', en: 'How was it?' },
  toonAlleRapportagesKnop: { nl: 'Toon alle', en: 'Show all' },
  toonMinder: { nl: 'Toon minder', en: 'Show less' },
  nogGeenRapportages: { nl: 'Nog geen rapportages beschikbaar', en: 'No reports available yet' },
  reablementTraject: { nl: 'Re-ablement traject', en: 'Re-ablement pathway' },
  voortgang: { nl: 'Voortgang', en: 'Progress' },
  behandelplan: { nl: 'Behandelplan', en: 'Care plan' },
  tikVoorToelichting: { nl: 'Tik voor toelichting', en: 'Tap for details' },
  opOrde: { nl: 'Op orde', en: 'On track' },
  aandacht: { nl: 'Aandacht', en: 'Attention' },
  bijgewerkt: { nl: 'Bijgewerkt', en: 'Updated' },
  lopendeMeldingenFam: { nl: 'Lopende meldingen', en: 'Active alerts' },
  erIsEenMelding: { nl: 'Er is een medische melding gedaan voor', en: 'A medical alert was submitted for' },
  status: { nl: 'Status', en: 'Status' },
  weekplanning: { nl: 'Weekplanning', en: 'Weekly schedule' },
  verdelingDezeWeek: { nl: 'Verdeling deze week', en: 'Distribution this week' },
  helpNodig: { nl: 'Help nodig', en: 'Help needed' },
  niemandGepland: { nl: 'Niemand gepland', en: 'No one scheduled' },
  ikKom: { nl: 'Ik kom', en: "I'll come" },
  nogNietZeker: { nl: 'Nog niet zeker', en: 'Not sure yet' },
  zetInAgenda: { nl: 'Zet in agenda', en: 'Add to calendar' },
  berichtAanFamilie: { nl: 'Bericht aan familie...', en: 'Message to family...' },
  nogGeenBerichten: { nl: 'Nog geen berichten. Stuur het eerste bericht!', en: 'No messages yet. Send the first one!' },

  // ── E-learning ──
  verplichtModules: { nl: 'Verplichte modules', en: 'Required modules' },
  modulesVoorFamilie: { nl: 'Modules voor familie', en: 'Modules for family' },
  mijnModules: { nl: 'Mijn modules', en: 'My modules' },
  kennismodule: { nl: 'Kennismodule bij pati\u00EBnt', en: 'Knowledge module for patient' },
  openModule: { nl: 'Open module', en: 'Open module' },
  lessen: { nl: 'lessen', en: 'lessons' },
  voltooid: { nl: 'voltooid', en: 'completed' },
  behaald: { nl: 'Behaald', en: 'Completed' },
  inUitvoering: { nl: 'In uitvoering', en: 'In progress' },
  nogTeStarten: { nl: 'Nog te starten', en: 'Not started' },
  behaaldOp: { nl: 'Behaald op', en: 'Completed on' },
  startModule: { nl: 'Start module', en: 'Start module' },
  gaVerder: { nl: 'Ga verder', en: 'Continue' },
  opnieuwBekijken: { nl: 'Opnieuw bekijken', en: 'Review again' },
  bekijkVideo: { nl: 'Bekijk video', en: 'Watch video' },
  aanbevolenVoorJou: { nl: 'Aanbevolen voor jou', en: 'Recommended for you' },
  verplicht: { nl: 'Verplicht', en: 'Required' },
  aanbevolen: { nl: 'Aanbevolen', en: 'Recommended' },
  optioneel: { nl: 'Optioneel', en: 'Optional' },
  zoekModules: { nl: 'Zoek modules, lessen of onderwerpen...', en: 'Search modules, lessons or topics...' },

  // ── EPD ──
  nutsPatientdata: { nl: 'NUTS Pati\u00EBntdata', en: 'NUTS Patient data' },
  patientkenmerken: { nl: 'Pati\u00EBnt', en: 'Patient' },
  vitaleFuncties: { nl: 'Vitalen', en: 'Vitals' },
  allergieen: { nl: 'Allergie\u00EBn', en: 'Allergies' },
  reanimatiebeleid: { nl: 'Reanimatie', en: 'Resuscitation' },
  lab: { nl: 'Lab', en: 'Lab' },
  medicatie: { nl: 'Medicatie', en: 'Medication' },
  geenBekend: { nl: 'Geen bekende', en: 'None known' },
  contactpersoon: { nl: 'Contactpersoon', en: 'Contact person' },
  zorgverlener: { nl: 'Zorgverlener', en: 'Care provider' },
  bekijkBeleid: { nl: 'Bekijk beleidsdocument', en: 'View policy document' },

  // ── Consult ──
  consultDetail: { nl: 'Consult detail', en: 'Consult detail' },
  ingediend: { nl: 'Ingediend', en: 'Submitted' },
  toewijzing: { nl: 'Toewijzing', en: 'Assignment' },
  vitalenBijMelding: { nl: 'Vitalen bij melding', en: 'Vitals at report' },
  videoconsult: { nl: 'Videoconsult', en: 'Video consult' },
  deelnemen: { nl: 'Deelnemen', en: 'Join' },
  aanvullendeInfo: { nl: 'Aanvullende informatie', en: 'Additional information' },
  aangeleverd: { nl: 'Aangeleverd', en: 'Delivered' },
  aangevraagd: { nl: 'Aangevraagd', en: 'Requested' },
  inAfwachting: { nl: 'In afwachting', en: 'Pending' },
  verloop: { nl: 'Verloop', en: 'Timeline' },
  berichtAanBehandelaar: { nl: 'Bericht aan behandelaar...', en: 'Message to clinician...' },
  stuur: { nl: 'Stuur', en: 'Send' },
  deelMetFamilie: { nl: 'Deel dit bericht ook met familie', en: 'Share this message with family' },
  triageAntwoorden: { nl: 'Triage-antwoorden', en: 'Triage answers' },

  // ── Instellingen ──
  instellingen: { nl: 'Instellingen', en: 'Settings' },
  tekstgrootte: { nl: 'Tekstgrootte', en: 'Text size' },
  hoogContrast: { nl: 'Hoog contrast', en: 'High contrast' },
  nachtmodus: { nl: 'Nachtmodus (dark mode)', en: 'Night mode (dark mode)' },
  herstelStandaard: { nl: 'Herstel standaard', en: 'Reset to default' },

  // ── Notificaties ──
  meldingen: { nl: 'Meldingen', en: 'Notifications' },
  geenMeldingen: { nl: 'Geen meldingen', en: 'No notifications' },
  allesGelezen: { nl: 'Alles gelezen', en: 'Mark all read' },

  // ── Onboarding ──
  welkom: { nl: 'Welkom bij GeriCall', en: 'Welcome to GeriCall' },
  aanDeSlag: { nl: 'Aan de slag!', en: "Let's go!" },
  overslaan: { nl: 'Overslaan', en: 'Skip' },

  // ── Privacy ──
  privacyTitel: { nl: 'Privacy & Medische gegevens', en: 'Privacy & Medical data' },
  privacyTekst: { nl: 'Dit portaal verwerkt medische gegevens conform de AVG en de Wet op de geneeskundige behandelingsovereenkomst (WGBO). Uw gegevens worden versleuteld opgeslagen en zijn alleen toegankelijk voor geautoriseerde zorgverleners en gemachtigde familieleden.', en: 'This portal processes medical data in accordance with GDPR and Dutch medical treatment law (WGBO). Your data is encrypted and only accessible to authorized care providers and designated family members.' },
  akkoord: { nl: 'Akkoord', en: 'Agree' },
  meerInfo: { nl: 'Meer info', en: 'More info' },

  // ── Algemeen ──
  ok: { nl: 'OK', en: 'OK' },
  annuleer: { nl: 'Annuleer', en: 'Cancel' },
  opslaan: { nl: 'Opslaan', en: 'Save' },
  verwijderen: { nl: 'Verwijderen', en: 'Delete' },
  bevestig: { nl: 'Bevestig', en: 'Confirm' },
  zoeken: { nl: 'Zoeken', en: 'Search' },
  geenResultaten: { nl: 'Geen resultaten', en: 'No results' },
};
