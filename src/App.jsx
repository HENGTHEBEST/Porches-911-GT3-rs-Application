import { useEffect, useRef, useState } from 'react';
import { Comparison, FilmViewer, ShareLink } from './Enhancements';

const officialUrl = 'https://www.porsche.com/international/models/911/911-gt3-rs/911-gt3-rs/';
const frames = [
  { src: '/media/showroom.png', title: 'An unmistakable silhouette.', detail: 'A wide stance, sculpted front arches and a high rear wing define the GT3 RS profile.', alt: 'Silver Porsche 911 GT3 RS with red wheels in an open showroom overlooking the mountains at sunset' },
  { src: '/media/rear-detail.png', title: 'Every detail. Every second.', detail: 'A close look at the rear-wing supports, red centre-lock wheel and contrasting yellow brake caliper.', alt: 'Close view of the carbon rear wing, red rear wheel and yellow brake caliper of the GT3 RS' },
  { src: '/media/interior.png', title: 'A seat at the limit.', detail: 'Carbon seat shells, red stitching and a driver-focused cockpit bring the motorsport character inside.', alt: 'GT3 RS cockpit with carbon bucket seat, steering wheel and red stitching against a sunset mountain view' },
  { src: '/media/sunset-drive.png', title: 'Chase the horizon.', detail: 'From the rear, the elevated wing, full-width light strip and low diffuser shape the silhouette.', alt: 'Rear three-quarter view of the silver GT3 RS driving through a mountain-road bend at sunset' },
];

function ResponsiveImage({ src, sizes = '100vw', ...props }) {
  const name = src.replace(/\.(png|jpg)$/, '');
  const fullWidth = src.endsWith('opening.jpg') ? 1920 : 1672;
  return <img src={`${name}-1280.webp`} srcSet={`${name}-640.webp 640w, ${name}-1280.webp 1280w, ${name}-1920.webp ${fullWidth}w`} sizes={sizes} decoding="async" {...props} />;
}

const aeroDetails = [
  { id: 'aero-wing', label: 'Active rear wing', image: '/media/wing-closeup.png', title: 'Grip, on demand.', copy: 'The two-part rear wing combines a fixed main wing with an adjustable upper element. Together with the active front elements, it balances downforce. DRS flattens the adjustable elements for lower drag on straights.', crop: 'wing' },
  { id: 'aero-splitter', label: 'Front splitter', image: '/media/splitter-closeup.png', title: 'Divide the air. Find the grip.', copy: 'The front splitter separates airflow above and below the car. Alongside the active front elements, it helps manage the aerodynamic balance between the front and rear axles.', crop: 'splitter' },
  { id: 'aero-wheel', label: 'Wheel-arch vents', image: '/media/wheel-closeup.png', title: 'Give pressure a way out.', copy: 'Louvred openings above the front wheels let air escape from the wheel arches. The openings behind the front wheels also help reduce pressure, while sideblades guide air outward.', crop: 'vents' },
];

function Icon({ name, ...props }) {
  const paths = {
    arrow: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
    diagonal: <><path d="M5 19 19 5M5 5h14v14" /></>,
    down: <><path d="M12 3v18M6 15l6 6 6-6" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    sound: <><path d="m11 4-6 5H2v6h3l6 5Z" /><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></>,
    mute: <><path d="m11 4-6 5H2v6h3l6 5Z" /><path d="m16 9 6 6m0-6-6 6" /></>,
    close: <><path d="m5 5 14 14M19 5 5 19" /></>,
    menu: <><path d="M3 8h18M3 16h18" /></>,
    expand: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function Counter({ value, decimals = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    let frame;
    const node = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const start = performance.now();
      const tick = (time) => {
        const progress = Math.min((time - start) / 1100, 1);
        node.textContent = (value * (1 - Math.pow(1 - progress, 4))).toFixed(decimals);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.8 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, decimals]);
  return <><span ref={ref} aria-hidden="true">{value.toFixed(decimals)}</span><span className="sr-only">{value.toFixed(decimals)}</span></>;
}

function Gallery() {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const change = (direction) => setIndex((current) => (current + direction + frames.length) % frames.length);
  const open = (nextIndex, event) => {
    trigger.current = event.currentTarget;
    setIndex(nextIndex);
    setIsOpen(true);
    dialog.current.showModal();
    document.body.classList.add('viewer-open');
  };
  const close = () => dialog.current.close();
  return <section id="gallery" className="gallery section-shell">
    <div className="section-heading">
      <h2>Some things<br />can't stand still.</h2>
      <p>Silver. Red. A little mountain air.<br />A closer look at a singular obsession.</p>
    </div>
    <div className="gallery-grid">
      {frames.map((frame, i) => <button key={frame.src} className={`gallery-frame frame-${i}`} aria-label={`View image ${i + 1}`} onClick={(event) => open(i, event)}>
        <ResponsiveImage sizes="(max-width: 650px) 100vw, 65vw" src={frame.src} alt={frame.alt} loading="lazy" width="1672" height="941" />
        <span className="frame-caption"><span>{frame.title}<small>{frame.detail}</small></span><Icon name="expand" /></span>
      </button>)}
    </div>
    <dialog ref={dialog} aria-label="GT3 RS image gallery" className="image-viewer" onClose={() => { setIsOpen(false); document.body.classList.remove('viewer-open'); trigger.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); change(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); }
    }}>
      <div className="viewer-top"><span>911 GT3 RS / IN FOCUS</span><button className="icon-button" aria-label="Close gallery" onClick={close}><Icon name="close" /></button></div>
      {isOpen && <img src={frames[index].src} alt={frames[index].alt} />}
      <div className="viewer-bottom"><div className="viewer-description"><strong>{frames[index].title}</strong><p>{frames[index].detail}</p></div><div className="viewer-navigation"><button className="icon-button previous" aria-label="Previous image" onClick={() => change(-1)}><Icon name="arrow" /></button><span className="viewer-count">{String(index + 1).padStart(2, '0')} / 04</span><button className="icon-button" aria-label="Next image" onClick={() => change(1)}><Icon name="arrow" /></button></div></div>
    </dialog>
  </section>;
}

function Aerodynamics() {
  const [mode, setMode] = useState('downforce');
  const isDrs = mode === 'drs';
  const [selected, setSelected] = useState(0);
  const detail = aeroDetails[selected];
  useEffect(() => {
    const syncHash = () => {
      const index = aeroDetails.findIndex(item => `#${item.id}` === location.hash);
      if (index < 0) return;
      setSelected(index);
      requestAnimationFrame(() => document.getElementById('aero-detail')?.scrollIntoView({ block: 'center' }));
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);
  return <section id="aerodynamics" className={`aerodynamics ${isDrs ? 'drs-active' : ''}`}>
    <div className="section-shell section-heading aero-heading">
      <h2>Shaped by air.<br /><span>Defined by purpose.</span></h2>
      <p>Nothing here is ornamental.<br />Every surface has a job to do.</p>
    </div>
    <div className="aero-stage">
      <ResponsiveImage src="/media/opening.jpg" alt="The GT3 RS with its prominent rear wing and aerodynamic front bodywork" loading="lazy" width="1920" height="1080" />
      <div className="aero-shade" />
      <svg className="airflow" viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><linearGradient id="flow-fade"><stop offset="0" stopColor="white" stopOpacity="0" /><stop offset=".35" stopColor="white" stopOpacity=".8" /><stop offset=".8" stopColor="white" stopOpacity=".65" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient></defs>
        {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} style={{ '--line': i }}>
          <path className="flow-base" d={`M 1490 ${365 + i * 34} C 1200 ${335 + i * 35}, 980 ${90 + i * 38}, 710 ${150 + i * 33} S 280 ${205 + i * 16}, -100 ${135 + i * 35}`} />
          <path className="flow-moving" d={`M 1490 ${365 + i * 34} C 1200 ${335 + i * 35}, 980 ${90 + i * 38}, 710 ${150 + i * 33} S 280 ${205 + i * 16}, -100 ${135 + i * 35}`} />
        </g>)}
      </svg>
      {aeroDetails.map((item, i) => <button key={item.label} className={`aero-annotation ${['wing', 'front', 'vent'][i]}-annotation`} aria-pressed={selected === i} aria-controls="aero-detail" onClick={() => {
        setSelected(i);
        history.pushState(null, '', `#${item.id}`);
        document.getElementById('aero-detail').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
      }}><span className="annotation-dot" /><span>{item.label}</span><span className="annotation-line" /></button>)}
      <span className="aero-caption">AIRFLOW STUDY / ILLUSTRATIVE VISUALISATION</span>
    </div>
    <div className="aero-detail section-shell" id="aero-detail">
      <div className={`aero-closeup crop-${detail.crop}`}><ResponsiveImage src={detail.image} alt={`${detail.label} detail on the silver GT3 RS`} sizes="(max-width: 650px) 100vw, 40vw" loading="lazy" width="1672" height="941" /></div>
      <div className="aero-detail-copy" aria-live="polite"><p className="detail-name">{detail.label}</p><h3>{detail.title}</h3><p>{detail.copy}</p><a className="text-link" href="https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html" target="_blank" rel="noreferrer">Explore the engineering<Icon name="diagonal" /></a><ShareLink hash={`#${detail.id}`} label="Copy feature link" /></div>
    </div>
    <div className="aero-console section-shell">
      <div className="aero-explore">
        <div className="mode-switch" aria-label="Explore aerodynamic modes">
          <button aria-pressed={!isDrs} onClick={() => setMode('downforce')}>Downforce<Icon name="arrow" /></button>
          <button aria-pressed={isDrs} onClick={() => setMode('drs')}>Drag reduction<Icon name="arrow" /></button>
        </div>
        <p id="aero-description" aria-live="polite">{isDrs ? 'On a straight, DRS flattens the adjustable wing elements to reduce drag within its operating range.' : 'Active front and rear wing elements work together to generate 860 kg of downforce at 285 km/h.'}</p>
      </div>
      <div className="wing-diagram">
        <svg viewBox="0 0 300 110" role="img" aria-label={isDrs ? 'Schematic of a flattened wing in drag reduction mode' : 'Schematic of an angled wing in downforce mode'}>
          <path d="M15 76h267M90 76l19-28h92l24 28M120 76V49m71 27V49" fill="none" stroke="#707277" strokeWidth="1" />
          <g className="force-vectors" aria-hidden="true">
            {[110, 155, 200].map((x, i) => <path key={x} style={{ '--vector': i }} d={isDrs ? `M${x - 17} 16h30m-5-4 5 4-5 4` : `M${x} 4v23m-4-5 4 5 4-5`} />)}
          </g>
          <path className="wing-flap" d="M87 39q64-19 139 0l-6 8H91z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M72 91h163" stroke="#707277" strokeWidth="1" strokeDasharray="3 4" />
        </svg>
        <span>{isDrs ? 'DRS / WING FLATTENED' : 'DOWNFORCE / WING ANGLED'}</span>
      </div>
    </div>
  </section>;
}

export default function App() {
  const video = useRef(null);
  const hero = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const player = video.current;
    if (!motion.matches) player.play().catch((error) => {
      setPlaying(false);
      if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') setPlayError(true);
    });
    const onMotion = () => { if (motion.matches) player.pause(); };
    motion.addEventListener('change', onMotion);
    let frame = 0;
    let previousScroll = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const currentScroll = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - innerHeight));
        setHeaderScrolled(currentScroll > 80);
        if (currentScroll <= 80) {
          setHeaderHidden(false);
          previousScroll = currentScroll;
        } else if (Math.abs(currentScroll - previousScroll) >= 8) {
          setHeaderHidden(currentScroll > previousScroll);
          previousScroll = currentScroll;
        }
        const progress = Math.min(scrollY / Math.max(hero.current.offsetHeight, 1), 1);
        hero.current.style.setProperty('--hero-progress', motion.matches ? 0 : progress);
        document.documentElement.style.setProperty('--page-progress', `${scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1) * 100}%`);
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { motion.removeEventListener('change', onMotion); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const onEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  useEffect(() => {
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' });
    const reveals = document.querySelectorAll('.performance-heading h2, .aero-heading h2, .story-copy h2, .gallery .section-heading h2, .cockpit h2, .comparison h2, .story-photo, .closing');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('motion-entered');
        revealObserver.unobserve(target);
      });
    }, { threshold: 0.18 });
    reveals.forEach(node => revealObserver.observe(node));
    const loops = document.querySelectorAll('.aerodynamics, .moving-type, .film-label');
    const loopObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => target.classList.toggle('motion-visible', isIntersecting));
    });
    loops.forEach(node => loopObserver.observe(node));
    const onVisibility = () => document.documentElement.classList.toggle('page-inactive', document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => {
      revealObserver.disconnect();
      loopObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      document.documentElement.classList.remove('page-inactive');
    };
  }, []);

  const togglePlayback = async () => {
    if (!video.current.paused && !playError) { video.current.pause(); return; }
    try { if (playError) video.current.load(); await video.current.play(); setPlayError(false); } catch { setPlayError(true); }
  };
  const toggleSound = () => {
    video.current.muted = !video.current.muted;
    setMuted(video.current.muted);
  };

  return <div className={motionPaused ? 'showcase motion-paused' : 'showcase'}>
    <a className="skip-link" href="#performance">Skip to content</a>
    <header className={`site-header ${menuOpen ? 'menu-open' : ''} ${headerScrolled ? 'is-scrolled' : ''} ${headerHidden && !menuOpen ? 'is-hidden' : ''}`}>
      <a className="wordmark" href="#top" aria-label="Porsche showcase home">PORSCHE</a>
      <nav id="main-nav" aria-label="Main">
        <a href="#performance" onClick={() => setMenuOpen(false)}>Performance</a>
        <a href="#aerodynamics" onClick={() => setMenuOpen(false)}>Aerodynamics</a>
        <a href="#cockpit" onClick={() => setMenuOpen(false)}>Cockpit</a>
        <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
      </nav>
      <a className="header-model" href={officialUrl} target="_blank" rel="noreferrer">Explore the model<Icon name="diagonal" /></a>
      <button className="menu-toggle icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
    </header>

    <main>
      <section id="top" ref={hero} className="hero">
        <div className="hero-media"><video ref={video} poster="/media/hero.jpg" loop muted playsInline preload="metadata" aria-label="GT3 RS mountain-road showcase film" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setPlayError(true); }}><source src="/media/911-gt3-rs.mp4" type="video/mp4" onError={() => { setPlaying(false); setPlayError(true); }} /></video></div>
        <div className="hero-overlay" />
        <div className="hero-title"><h1>911 GT3 <span>RS</span></h1><div className="hero-title-meta"><span>RACE CAR. ROAD LEGAL.</span><span>THE ESSENCE OF MOTORSPORT.</span></div></div>
        <div className="hero-bottom">
          <div className="hero-intro"><p>Driven by<br /><em>obsession.</em></p><a href="#performance" className="explore-link"><span className="round-arrow"><Icon name="down" /></span>Discover the extraordinary</a></div>
          <div className="film-controls"><FilmViewer heroVideo={video} /><span className="film-label"><span className={playing ? 'live-dot live' : 'live-dot'} />THE GT3 RS IN MOTION</span><div className="control-row"><button className="sound-button" aria-label={muted ? 'Enable sound' : 'Mute sound'} aria-pressed={!muted} onClick={toggleSound}><Icon name={muted ? 'mute' : 'sound'} /><span>SOUND {muted ? 'OFF' : 'ON'}</span></button><button className="icon-button" aria-label={playing ? 'Pause film' : 'Play film'} onClick={togglePlayback}><Icon name={playing ? 'pause' : 'play'} /></button></div>{playError && <p className="media-error" role="status">Film unavailable. Use play to retry.</p>}</div>
        </div>
        <div className="hero-edge"><span>4.0 L NATURALLY ASPIRATED FLAT-SIX</span><span>UNCOMPROMISING. UNFILTERED.</span></div>
      </section>

      <section id="performance" className="performance section-shell">
        <div className="performance-heading"><h2>Closer to the limit.<br /><span>Further from ordinary.</span></h2><p>A naturally aspirated heart.<br />A motorsport soul.<br />An experience that stays with you.</p></div>
        <dl className="performance-stats">
          <div><dt>Maximum power</dt><dd><Counter value={525} /><span>PS</span></dd><p>386 kW. Pure response.</p></div>
          <div><dt>0–100 km/h</dt><dd><Counter value={3.2} decimals={1} /><span>s</span></dd><p>Every fraction matters.</p></div>
          <div><dt>Top speed</dt><dd><Counter value={296} /><span>km/h</span></dd><p>Engineered to keep going.</p></div>
        </dl>
        <div className="engineering-strip"><span>4.0 L <small>FLAT-SIX</small></span><span>7-SPEED <small>PDK TRANSMISSION</small></span><span>1,450 KG <small>DIN KERB WEIGHT</small></span><span className="rs-signature">GT3 <i>RS</i></span></div>
      </section>

      <Comparison />
      <Aerodynamics />

      <section className="design-story section-shell">
        <div className="story-photo"><ResponsiveImage sizes="(max-width: 650px) 100vw, 50vw" src="/media/rear-detail.png" alt="Carbon rear wing and red rear wheel with yellow brake caliper on the silver GT3 RS" loading="lazy" width="1672" height="941" /><span>FORM FOLLOWS FAST.</span></div>
        <div className="story-copy"><h2>Every gram.<br />Every curve.<br /><span>Every instinct.</span></h2><p>Carbon-fibre bodywork. Centre-lock wheels. A wing that makes its intentions clear. This is precision you can see, and purpose you can feel.</p><a href="#gallery" className="text-link">Get closer<Icon name="arrow" /></a></div>
      </section>

      <div className="moving-type" aria-hidden="true"><div><span>NO COMPROMISE.</span><span className="outline-type">JUST PERFORMANCE.</span><span>NO COMPROMISE.</span><span className="outline-type">JUST PERFORMANCE.</span></div></div>

      <section id="cockpit" className="cockpit section-shell">
        <div className="section-heading"><h2>Take your place.<br /><span>Feel everything.</span></h2><p>A cockpit built around the driver.<br />Every touch brings you closer.</p></div>
        <ShareLink hash="#cockpit" label="Copy cockpit link" />
        <div className="cockpit-layout">
        <div className="cockpit-photo"><ResponsiveImage sizes="(max-width: 800px) 100vw, 52vw" src="/media/interior.png" alt="GT3 RS interior with carbon bucket seats, steering controls and red stitching" loading="lazy" width="1672" height="941" /></div>
        <div className="cockpit-details">
          <div><h3>Held in the moment.</h3><p>Deep bucket seats and sculpted bolsters surround the driver. Carbon shells carry the lightweight philosophy into the cabin.</p></div>
          <div><h3>Control at your fingertips.</h3><p>Steering-wheel controls put driving adjustments close to hand. The central rev counter keeps engine speed in focus.</p></div>
          <div><h3>Purpose you can touch.</h3><p>Visible carbon weave, tactile surfaces and red stitching give the cockpit its unmistakable motorsport character.</p></div>
        </div>
        </div>
      </section>
      <Gallery />

      <section className="closing"><ResponsiveImage src="/media/sunset-drive.png" alt="Rear view of the Porsche GT3 RS rounding a mountain bend beside a lake at sunset" loading="lazy" width="1672" height="941" /><div className="closing-shade" /><div className="closing-content"><h2>The road ends.<br /><span>The obsession doesn't.</span></h2><a href={officialUrl} className="primary-link" target="_blank" rel="noreferrer">Explore the 911 GT3 RS<Icon name="diagonal" /></a></div><span className="closing-tag">THERE IS NO SUBSTITUTE.</span></section>
    </main>

    <footer className="site-footer section-shell"><div className="footer-top"><a href="#top" className="wordmark" aria-label="Porsche showcase home">PORSCHE</a><div className="footer-actions"><button className="motion-control text-link" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? 'Resume animations' : 'Pause animations'}<Icon name={motionPaused ? 'play' : 'pause'} /></button><a href="#top" className="text-link">Back to top<Icon name="down" className="up-arrow" /></a></div></div><div className="footer-bottom"><p>Independent automotive showcase. Not affiliated with Porsche AG.<br />Porsche and 911 GT3 RS are trademarks of Porsche AG.</p><a href="https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html" target="_blank" rel="noreferrer">Vehicle specifications / Porsche Newsroom<Icon name="diagonal" /></a></div></footer>
  </div>;
}
