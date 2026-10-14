import { useEffect, useRef, useState } from 'react';

export function ShareLink({ hash, label = 'Copy section link' }) {
  const [status, setStatus] = useState('');
  const [fallback, setFallback] = useState('');
  useEffect(() => { setStatus(''); setFallback(''); }, [hash]);
  const copy = async () => {
    const url = new URL(hash, window.location.href).href;
    try { await navigator.clipboard.writeText(url); setStatus('Link copied'); }
    catch { setFallback(url); setStatus('Select and copy the link below'); }
  };
  return <div className="share-control"><button className="text-link" onClick={copy}>{label}</button>{status && <span role="status">{status}</span>}{fallback && <input aria-label="Section link" value={fallback} readOnly onFocus={event => event.target.select()} />}</div>;
}

export function FilmViewer({ heroVideo }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const player = useRef(null);
  useEffect(() => {
    if (!open) return;
    dialog.current.showModal();
    document.body.classList.add('viewer-open');
    heroVideo.current.pause();
    player.current.play().catch(() => {});
    return () => document.body.classList.remove('viewer-open');
  }, [open, heroVideo]);
  return <><button ref={trigger} className="watch-film text-link" onClick={() => { setError(false); setOpen(true); }}>Watch the film</button>
    <dialog ref={dialog} className="film-viewer" aria-label="Watch the GT3 RS film" onClose={() => { player.current?.pause(); setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="viewer-top"><span>911 GT3 RS / THE FILM</span><button className="text-link" onClick={() => dialog.current.close()} aria-label="Close film">Close</button></div>
      {open && <video ref={player} src="/media/911-gt3-rs.mp4" poster="/media/hero.jpg" controls playsInline preload="metadata" aria-label="Full GT3 RS film" onError={() => setError(true)} onLoadedData={() => setError(false)} />}
      <div className="film-viewer-bottom"><p>Mountain roads. A singular obsession.</p><a href="/media/911-gt3-rs.mp4" target="_blank" rel="noreferrer">Open original film</a></div>
      {error && <p role="alert">The film could not load. <button className="text-link" onClick={() => { player.current.load(); player.current.play().catch(() => setError(true)); }}>Retry film</button></p>}
    </dialog></>;
}

export function Comparison() {
  const [rs, setRs] = useState(true);
  const values = rs ? ['525 PS', '3.2 s', '296 km/h', 'Active front and rear elements with DRS'] : ['510 PS', '3.4 s', '318 km/h', 'Swan-neck rear wing'];
  return <section id="comparison" className="comparison section-shell">
    <div className="section-heading"><h2>Shared DNA.<br /><span>Different obsessions.</span></h2><p>992.1 generation. PDK transmission.<br />GT3 (2021) and GT3 RS (2022).</p></div>
    <div className="comparison-layout"><div><div className="mode-switch" aria-label="Select a model"><button aria-pressed={!rs} onClick={() => setRs(false)}>911 GT3</button><button aria-pressed={rs} onClick={() => setRs(true)}>911 GT3 RS</button></div><p className="comparison-story">{rs ? 'The RS puts aerodynamic grip at the centre of the experience. More power and active aero serve its track-focused purpose.' : 'The GT3 pairs its naturally aspirated engine with a broader road-and-track brief. Its higher top speed shows why a single number never tells the whole story.'}</p><ShareLink hash="#comparison" /></div>
    <dl className="comparison-specs" aria-live="polite" aria-label={rs ? '911 GT3 RS specifications' : '911 GT3 specifications'}>{['Maximum power', '0–100 km/h', 'Top speed', 'Aerodynamics'].map((label, i) => <div key={label}><dt>{label}</dt><dd>{values[i]}</dd></div>)}</dl></div>
    <p className="comparison-sources">Published launch specifications: <a href="https://newsroom.porsche.com/en/2021/products/porsche-911-gt3-if-not-now-when-christophorus-399-25304.html" target="_blank" rel="noreferrer">Porsche 911 GT3</a> · <a href="https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html" target="_blank" rel="noreferrer">Porsche 911 GT3 RS</a>. All photography on this page depicts the GT3 RS.</p>
  </section>;
}
