// GeriCall CareTaker Portal — Main App
// Bogus / interactief prototype · start.gericall.nl

const { useState, useEffect, useCallback } = React;
const C = window.COLORS;

function App() {
  const [persona, setPersona] = useState('Verzorgende');
  const [activeTab, setActiveTab] = useState('overzicht');
  const [toasts, setToasts] = useState([]);

  // Toast system
  const addToast = useCallback((message, type) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type: type || 'info', removing: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, removing: true } : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 2500);
  }, []);

  // Navigate from melding success back to overzicht
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date in Dutch
  const formatDate = () => {
    const d = new Date();
    const days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
    const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh', background: C.achtergrond }}>

        {/* ── Header ── */}
        <div style={{ padding: '16px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <GeriCallLogo />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: C.tekstMuted, textTransform: 'capitalize' }}>{formatDate()}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.oranje }}>CareTaker Portal</div>
          </div>
        </div>

        {/* ── Persona Switcher ── */}
        <PersonaSwitcher persona={persona} onSwitch={(p) => { setPersona(p); addToast(`U bekijkt dit portaal als: ${p}`); }} />
        <div style={{ fontSize: 12, color: C.tekstMuted, textAlign: 'center', marginBottom: 16, marginTop: -4 }}>
          U bekijkt dit portaal als: <span style={{ fontWeight: 600, color: C.oranje }}>{persona}</span>
        </div>

        {/* ── Active Section ── */}
        {activeTab === 'overzicht' && <SectionOverzicht persona={persona} addToast={addToast} />}
        {activeTab === 'behandelplan' && <SectionBehandelplan persona={persona} addToast={addToast} />}
        {activeTab === 'leren' && <SectionLeren persona={persona} addToast={addToast} />}
        {activeTab === 'melding' && <SectionMelding addToast={addToast} />}
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
