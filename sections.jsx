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

// SectionMelding is nu in melding.jsx met volledige NTS-triage
