// GeriCall CareTaker Portal — Page Sections

const C = window.COLORS;
const { useState } = React;

// ══════════════════════════════════════════
// SECTION 1 — Overzicht
// ══════════════════════════════════════════
window.SectionOverzicht = function SectionOverzicht({ persona, addToast }) {
  const p = window.patient;
  const r = p.reablement;

  const bezoekKleur = (type) => {
    if (type.includes('Familiebezoek')) return C.groen;
    if (type.includes('SO') || type.includes('CT')) return C.oranje;
    return C.blauw;
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Patient Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.tekstPrimair }}>{p.naam}</div>
            <div style={{ fontSize: 13, color: C.tekstSecundair, marginTop: 2 }}>{p.kamer}</div>
            <div style={{ fontSize: 12, color: C.tekstMuted, marginTop: 2 }}>{p.diagnose}</div>
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: 24, background: C.oranjeLicht,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: C.oranje,
          }}>AJ</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: C.tekstSecundair }}>Re-ablement voortgang</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.oranje }}>{r.voortgang}%</span>
          </div>
          <ProgressBar percentage={r.voortgang} />
        </div>
      </Card>

      {/* Re-ablement Card */}
      <SectionTitle>Re-ablement traject</SectionTitle>
      <Card>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.tekstPrimair, marginBottom: 4 }}>{r.fase}</div>
        <div style={{ fontSize: 13, color: C.tekstSecundair, marginBottom: 8 }}>
          Co\u00F6rdinator: {r.coordinatorNaam}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: C.tekstMuted }}>Start: {r.startdatum}</span>
          <span style={{ fontSize: 12, color: C.tekstMuted }}>Eind: {r.einddatum}</span>
        </div>
        <ProgressBar percentage={r.voortgang} />
        <div style={{ fontSize: 12, color: C.tekstSecundair, marginTop: 8, fontStyle: 'italic' }}>
          Doel: zelfstandiger thuis — familie actief betrokken
        </div>
      </Card>

      {/* Bezoeken */}
      <SectionTitle>Bezoeken (komende 7 dagen)</SectionTitle>
      <Card>
        {p.bezoeken.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0',
            borderBottom: i < p.bezoeken.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 12, paddingTop: 4 }}>
              <div style={{
                width: 10, height: 10, borderRadius: 5, background: bezoekKleur(b.type),
              }} />
              {i < p.bezoeken.length - 1 && (
                <div style={{ width: 2, flex: 1, background: C.border, marginTop: 4, minHeight: 20 }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.tekstPrimair }}>{b.datum}</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>{b.type} — {b.persoon}</div>
              <div style={{ fontSize: 12, color: C.tekstMuted }}>Duur: {b.duur}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Open Consulten */}
      <SectionTitle>Open consulten</SectionTitle>
      {p.openConsulten.map((c_item) => {
        const isU1 = c_item.urgentie.includes('U1');
        const isU2 = c_item.urgentie.includes('U2');
        const urgColor = isU1 ? C.rood : isU2 ? C.oranje : C.blauw;
        const urgBg = isU1 ? C.roodLicht : isU2 ? C.oranjeLicht : C.blauwLicht;
        return (
          <Card key={c_item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.tekstPrimair }}>#{c_item.id}</span>
              <Badge label={c_item.urgentie} color={urgColor} bgColor={urgBg} />
            </div>
            <div style={{ fontSize: 13, color: C.tekstSecundair, marginBottom: 4 }}>
              Ingediend: {c_item.ingediend}
            </div>
            <div style={{ fontSize: 13, color: C.tekstSecundair, marginBottom: 4 }}>
              Status: <span style={{ fontWeight: 600 }}>{c_item.status}</span>
            </div>
            <div style={{ fontSize: 13, color: C.tekstSecundair, marginBottom: 8 }}>
              Toewijzing: {c_item.toewijzing}
            </div>
            {persona === 'Verzorgende' && (
              <button onClick={() => addToast('Consult bewerken via GeriForce')} style={{
                background: C.oranjeLicht, color: C.oranje, border: `1px solid ${C.oranje}`,
                borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%',
              }}>Consult bewerken</button>
            )}
          </Card>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════
// SECTION 2 — Behandelplan
// ══════════════════════════════════════════
window.SectionBehandelplan = function SectionBehandelplan({ persona, addToast }) {
  const [modalItem, setModalItem] = useState(null);
  const p = window.patient;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <SectionTitle>Behandelplan</SectionTitle>
      <div style={{ fontSize: 13, color: C.tekstSecundair, marginBottom: 12 }}>
        Overzicht van alle onderdelen van het behandelplan van {p.naam}
      </div>
      {p.behandelplan.map((item, i) => {
        const actueel = item.status === 'Actueel';
        return (
          <Card key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.tekstPrimair }}>{item.onderdeel}</span>
              <Badge
                label={item.status}
                color={actueel ? C.groen : C.oranje}
                bgColor={actueel ? C.groenLicht : C.oranjeLicht}
              />
            </div>
            <div style={{ fontSize: 12, color: C.tekstMuted, marginBottom: 10 }}>
              Bijgewerkt: {item.bijgewerkt}
            </div>
            {persona === 'Verzorgende' ? (
              <button onClick={() => addToast('Bewerking via GeriForce')} style={{
                background: C.oranjeLicht, color: C.oranje, border: `1px solid ${C.oranje}`,
                borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%',
              }}>Aanpassen</button>
            ) : (
              <button onClick={() => setModalItem(item)} style={{
                background: C.blauwLicht, color: C.blauw, border: `1px solid ${C.blauw}`,
                borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%',
              }}>Bekijk toelichting</button>
            )}
          </Card>
        );
      })}

      {modalItem && (
        <Modal title={modalItem.onderdeel} onClose={() => setModalItem(null)}>
          <p style={{ fontSize: 14, color: C.tekstSecundair, lineHeight: 1.6, marginBottom: 12 }}>
            Het onderdeel "{modalItem.onderdeel}" is onderdeel van het behandelplan van {p.naam}.
            Dit plan wordt regelmatig bijgewerkt door het behandelteam in overleg met de co\u00F6rdinator.
          </p>
          <p style={{ fontSize: 14, color: C.tekstSecundair, lineHeight: 1.6, marginBottom: 16 }}>
            Laatste update: {modalItem.bijgewerkt}. Neem bij vragen contact op met de afdeling.
          </p>
          <button onClick={() => setModalItem(null)} style={{
            background: C.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8,
            padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%',
          }}>Sluiten</button>
        </Modal>
      )}
    </div>
  );
};

// ══════════════════════════════════════════
// SECTION 3 — E-learning
// ══════════════════════════════════════════
window.SectionLeren = function SectionLeren({ persona, addToast }) {
  const [modalModule, setModalModule] = useState(null);
  const modules = persona === 'Verzorgende' ? window.verzorgendeModules : window.familieModules;
  const shared = window.gedeeldeModule;

  const statusLabel = (s) => {
    if (s === 'certificaat') return { label: 'Certificaat behaald \u2713', color: C.groen, bg: C.groenLicht };
    if (s === 'bezig') return { label: 'In uitvoering', color: C.oranje, bg: C.oranjeLicht };
    return { label: 'Nog te starten', color: C.tekstMuted, bg: C.achtergrond };
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <SectionTitle>E-learning</SectionTitle>

      {/* Shared module */}
      <Card style={{ border: `2px solid ${C.oranje}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.tekstPrimair, marginBottom: 4 }}>
          {shared.naam}
        </div>
        <div style={{ fontSize: 12, color: C.tekstSecundair, marginBottom: 8 }}>
          {shared.voltooid} van {shared.totaal} onderdelen voltooid
        </div>
        <ProgressBar percentage={(shared.voltooid / shared.totaal) * 100} />
        <button onClick={() => addToast('E-learning wordt geladen', 'success')} style={{
          background: C.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8,
          padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 12,
        }}>Ga verder</button>
      </Card>

      {/* Persona-specific modules */}
      <div style={{ fontSize: 14, fontWeight: 600, color: C.tekstSecundair, margin: '16px 0 8px' }}>
        {persona === 'Verzorgende' ? 'Uw modules' : 'Modules voor familie'}
      </div>

      {modules.map((m, i) => {
        const st = statusLabel(m.status);
        return (
          <Card key={i} style={{ cursor: 'pointer' }} onClick={() => setModalModule(m)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.tekstPrimair, flex: 1, marginRight: 8 }}>{m.naam}</span>
              <Badge label={st.label} color={st.color} bgColor={st.bg} />
            </div>
            {m.status === 'bezig' && <ProgressBar percentage={m.voortgang} />}
          </Card>
        );
      })}

      {/* Klantcertificaat (verzorgende only) */}
      {persona === 'Verzorgende' && (
        <Card style={{ background: C.groenLicht, border: `1px solid ${C.groen}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>\u2705</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.groen }}>Zonnehof — toegangscertificaat behaald</div>
              <div style={{ fontSize: 12, color: C.tekstSecundair }}>Klantcertificaat actief</div>
            </div>
          </div>
        </Card>
      )}

      {/* Familie subtekst */}
      {persona === 'Familie' && (
        <div style={{ fontSize: 13, color: C.tekstMuted, fontStyle: 'italic', textAlign: 'center', marginTop: 8 }}>
          Deze modules zijn speciaal samengesteld voor familie van {window.patient.naam}
        </div>
      )}

      {/* Module Modal */}
      {modalModule && (
        <Modal title={modalModule.naam} onClose={() => setModalModule(null)}>
          <p style={{ fontSize: 14, color: C.tekstSecundair, lineHeight: 1.6, marginBottom: 12 }}>
            {modalModule.beschrijving}
          </p>
          {modalModule.status === 'bezig' && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.tekstMuted, marginBottom: 4 }}>Voortgang: {modalModule.voortgang}%</div>
              <ProgressBar percentage={modalModule.voortgang} />
            </div>
          )}
          {modalModule.status === 'certificaat' && (
            <div style={{ padding: 12, background: C.groenLicht, borderRadius: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 14, color: C.groen, fontWeight: 600 }}>\u2713 Certificaat behaald</span>
            </div>
          )}
          <button onClick={() => { addToast('E-learning wordt geladen', 'success'); setModalModule(null); }} style={{
            background: C.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8,
            padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%',
          }}>{modalModule.status === 'niet_gestart' ? 'Start module' : modalModule.status === 'bezig' ? 'Ga verder' : 'Opnieuw bekijken'}</button>
        </Modal>
      )}
    </div>
  );
};

// ══════════════════════════════════════════
// SECTION 4 — Melding doen
// ══════════════════════════════════════════
window.SectionMelding = function SectionMelding({ addToast }) {
  const [stap, setStap] = useState(1);
  const [beschrijving, setBeschrijving] = useState('');
  const [geselecteerd, setGeselecteerd] = useState([]);
  const [ingediend, setIngediend] = useState(false);

  const toggleCategorie = (cat) => {
    setGeselecteerd((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Urgentie bepaling
  const bepaalUrgentie = () => {
    const u1 = ['Bewustzijn / verwardheid', 'Ademhaling / benauwdheid', 'Pijn (borst, buik, hoofd)'];
    const u2 = ['Koorts / infectie', 'Val / letsel'];
    if (geselecteerd.some((s) => u1.includes(s))) return {
      niveau: 'U1', label: 'U1 — Levensbedreigend', kleur: C.rood, achtergrond: C.roodLicht, icon: '\uD83D\uDD34',
      toelichting: 'Direct actie vereist. De situatie wordt als potentieel levensbedreigend beoordeeld op basis van de aangegeven klachten. Een arts wordt onmiddellijk gewaarschuwd.'
    };
    if (geselecteerd.some((s) => u2.includes(s))) return {
      niveau: 'U2', label: 'U2 — Dringend', kleur: C.oranje, achtergrond: C.oranjeLicht, icon: '\uD83D\uDFE0',
      toelichting: 'Beoordeling binnen 1 uur noodzakelijk. De klachten vereisen spoedige medische aandacht maar zijn niet direct levensbedreigend.'
    };
    return {
      niveau: 'U3', label: 'U3 — Niet spoedeisend', kleur: C.blauw, achtergrond: C.blauwLicht, icon: '\uD83D\uDD35',
      toelichting: 'Geen acute dreiging. De melding wordt opgepakt tijdens reguliere dienst. Monitoren en rapporteren bij verandering.'
    };
  };

  // Routering
  const bepaalRoute = () => {
    const uur = new Date().getHours();
    const min = new Date().getMinutes();
    const urgentie = bepaalUrgentie();
    const tijdStr = `${String(uur).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

    if (uur >= 8 && (uur < 17 || (uur === 17 && min <= 30))) return {
      tijdstip: tijdStr, dienst: 'Dagdienst', dienstTijd: '08:00 – 17:30',
      route: 'Eigen verpleging \u00B7 dagtaak of SO Eigen',
      reactietijd: 'Verwachte reactie binnen 30 minuten',
    };
    if ((uur === 17 && min > 30) || (uur >= 18 && uur < 23)) return {
      tijdstip: tijdStr, dienst: 'Avonddienst', dienstTijd: '17:30 – 23:00',
      route: urgentie.niveau === 'U1' || urgentie.niveau === 'U2'
        ? '\uD83D\uDCDE GeriCall CT-arts wordt gewaarschuwd'
        : 'SO Eigen (achterwacht)',
      reactietijd: urgentie.niveau === 'U1' ? 'Verwachte reactie binnen 10 minuten' : 'Verwachte reactie binnen 1 uur',
    };
    return {
      tijdstip: tijdStr, dienst: 'ANW (nacht/weekend)', dienstTijd: '23:00 – 08:00',
      route: '\uD83D\uDCDE GeriCall CT-arts \u00B7 SO ANW beschikbaar',
      reactietijd: 'Verwachte reactie binnen 15 minuten',
    };
  };

  const handleIndienen = () => {
    setIngediend(true);
    addToast('Melding succesvol ingediend', 'success');
  };

  const handleReset = () => {
    setStap(1);
    setBeschrijving('');
    setGeselecteerd([]);
    setIngediend(false);
  };

  if (ingediend) {
    const urgentie = bepaalUrgentie();
    const route = bepaalRoute();
    return (
      <div style={{ animation: 'scaleIn 0.4s ease', textAlign: 'center', padding: '20px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 32, background: C.groenLicht,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 32, animation: 'scaleIn 0.5s ease',
        }}>\u2713</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.groen, marginBottom: 4 }}>Melding ingediend</div>
        <div style={{ fontSize: 14, color: C.tekstSecundair, marginBottom: 20 }}>Consult #C-2042</div>
        <Card>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: C.tekstMuted, marginBottom: 4 }}>Beschrijving</div>
            <div style={{ fontSize: 14, color: C.tekstPrimair, marginBottom: 12 }}>{beschrijving || '(geen beschrijving)'}</div>
            <div style={{ fontSize: 13, color: C.tekstMuted, marginBottom: 4 }}>Categorie\u00EBn</div>
            <div style={{ fontSize: 14, color: C.tekstPrimair, marginBottom: 12 }}>{geselecteerd.join(', ') || '(geen)'}</div>
            <div style={{ fontSize: 13, color: C.tekstMuted, marginBottom: 4 }}>Urgentie</div>
            <Badge label={urgentie.label} color={urgentie.kleur} bgColor={urgentie.achtergrond} />
            <div style={{ fontSize: 13, color: C.tekstMuted, marginBottom: 4, marginTop: 12 }}>Routering</div>
            <div style={{ fontSize: 14, color: C.tekstPrimair }}>{route.route}</div>
          </div>
        </Card>
        <button onClick={handleReset} style={{
          background: C.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8,
          padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8,
        }}>Terug naar overzicht</button>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <SectionTitle>Melding doen / Consult aanvragen</SectionTitle>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: s <= stap ? C.oranje : C.border, transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Step 1 */}
      {stap === 1 && (
        <div style={{ animation: 'slideInRight 0.3s ease' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.tekstPrimair, marginBottom: 8 }}>
            Stap 1 — Klacht beschrijven
          </div>
          <textarea
            value={beschrijving}
            onChange={(e) => setBeschrijving(e.target.value)}
            placeholder="Beschrijf wat u heeft waargenomen..."
            style={{
              width: '100%', minHeight: 100, padding: 12, borderRadius: 8,
              border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              resize: 'vertical', outline: 'none', color: C.tekstPrimair,
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, color: C.tekstSecundair, margin: '16px 0 8px' }}>
            NTS-triage snelkeuze
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {window.triageCategorieen.map((cat) => {
              const selected = geselecteerd.includes(cat);
              return (
                <button key={cat} onClick={() => toggleCategorie(cat)} style={{
                  padding: '14px 10px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  background: selected ? C.oranjeLicht : C.kaartWit,
                  border: `2px solid ${selected ? C.oranje : C.border}`,
                  color: selected ? C.oranje : C.tekstPrimair,
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                }}>{cat}</button>
              );
            })}
          </div>
          <button
            onClick={() => { if (beschrijving.trim() || geselecteerd.length) setStap(2); else addToast('Vul een beschrijving in of selecteer een categorie'); }}
            style={{
              background: C.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8,
              padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 16,
            }}>Volgende</button>
        </div>
      )}

      {/* Step 2 — Urgentiebepaling */}
      {stap === 2 && (() => {
        const urg = bepaalUrgentie();
        return (
          <div style={{ animation: 'slideInRight 0.3s ease' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.tekstPrimair, marginBottom: 12 }}>
              Stap 2 — Urgentiebepaling (NTS)
            </div>
            <Card style={{ border: `2px solid ${urg.kleur}`, background: urg.achtergrond, animation: 'fadeIn 0.5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{urg.icon}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: urg.kleur }}>{urg.label}</span>
              </div>
              <p style={{ fontSize: 14, color: C.tekstPrimair, lineHeight: 1.6 }}>{urg.toelichting}</p>
            </Card>
            <div style={{ fontSize: 13, color: C.tekstMuted, marginTop: 8, marginBottom: 16 }}>
              Geselecteerd: {geselecteerd.join(', ')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStap(1)} style={{
                flex: 1, background: C.kaartWit, color: C.tekstSecundair, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}>Vorige</button>
              <button onClick={() => setStap(3)} style={{
                flex: 2, background: C.oranje, color: '#FFFFFF', border: 'none',
                borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Volgende</button>
            </div>
          </div>
        );
      })()}

      {/* Step 3 — Routering */}
      {stap === 3 && (() => {
        const route = bepaalRoute();
        const urg = bepaalUrgentie();
        return (
          <div style={{ animation: 'slideInRight 0.3s ease' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.tekstPrimair, marginBottom: 12 }}>
              Stap 3 — Routering
            </div>
            <Card style={{ border: `2px solid ${C.blauw}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.tekstMuted }}>Nu: {route.tijdstip}</span>
                <Badge label={route.dienst} color={C.blauw} bgColor={C.blauwLicht} />
              </div>
              <div style={{ fontSize: 12, color: C.tekstMuted, marginBottom: 8 }}>{route.dienstTijd}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair, marginBottom: 4 }}>{route.route}</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>{route.reactietijd}</div>
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginBottom: 8 }}>Samenvatting</div>
              <div style={{ fontSize: 13, color: C.tekstMuted, marginBottom: 4 }}>Urgentie:</div>
              <Badge label={urg.label} color={urg.kleur} bgColor={urg.achtergrond} />
              <div style={{ fontSize: 13, color: C.tekstMuted, marginBottom: 4, marginTop: 8 }}>Beschrijving:</div>
              <div style={{ fontSize: 14, color: C.tekstPrimair, marginBottom: 4 }}>{beschrijving || '(geen)'}</div>
              <div style={{ fontSize: 13, color: C.tekstMuted, marginBottom: 4, marginTop: 8 }}>Categorie\u00EBn:</div>
              <div style={{ fontSize: 14, color: C.tekstPrimair }}>{geselecteerd.join(', ') || '(geen)'}</div>
            </Card>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStap(2)} style={{
                flex: 1, background: C.kaartWit, color: C.tekstSecundair, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}>Vorige</button>
              <button onClick={handleIndienen} style={{
                flex: 2, background: C.groen, color: '#FFFFFF', border: 'none',
                borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>Dien in</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
