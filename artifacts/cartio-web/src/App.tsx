import { type FormEvent, type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronRight, Code2, ExternalLink, Gift, Mail, Menu, Palette, Play, Send, WandSparkles, X } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import type { Group } from 'three';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '/gift-cards', label: 'Gift Cards' },
  { href: '#contact', label: 'Contact' },
];

function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      progress.current = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight * 3.2, 1)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return progress;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return reducedMotion;
}

function useScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add('has-scroll-reveal');
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return () => document.documentElement.classList.remove('has-scroll-reveal');
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('has-scroll-reveal');
    };
  }, []);
}

const projects = [
  {
    id: 'signal',
    title: 'Signal / Commerce',
    eyebrow: 'Commerce system · concept study',
    copy: 'A frictionless commerce direction for products that deserve a stronger signal. Motion, modular product logic, and a checkout-ready visual language.',
    visual: 'visual-signal',
    mediaKind: 'Interface preview',
    videoUrl: undefined,
  },
  {
    id: 'arc',
    title: 'Arc / Interface',
    eyebrow: 'Interface direction · concept study',
    copy: 'A fluid interface system built around pace, contrast, and the quiet confidence of a well-made tool.',
    visual: 'visual-arc',
    mediaKind: 'Motion study',
    videoUrl: undefined,
  },
  {
    id: 'green',
    title: 'Folio / Digital',
    eyebrow: 'Digital identity · concept study',
    copy: 'A warmer digital world for ideas in motion — where a restrained palette makes the important parts feel electric.',
    visual: 'visual-green',
    mediaKind: 'Digital direction',
    videoUrl: undefined,
  },
];

function Brand() {
  return (
    <a className="brand" href="/" data-testid="link-brand">
      <span className="brand-mark" aria-hidden="true"><i /></span>
      <span className="brand-word">CARTIO</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const closeMenu = () => setOpen(false);
  const resolveHref = (href: string) => href.startsWith('#') && location !== '/' ? `/${href}` : href;

  return (
    <header className="topbar" data-testid="header-navigation">
      <Brand />
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={resolveHref(item.href)} data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>{item.label}</a>
        ))}
      </nav>
      <a className="nav-cta" href="/#contact" data-testid="link-nav-contact">
        START A PROJECT <ArrowUpRight size={14} />
      </a>
      <button className="mobile-menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.href} href={resolveHref(item.href)} onClick={closeMenu} data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>{item.label}</a>
          ))}
          <a href="/#contact" onClick={closeMenu} data-testid="link-mobile-contact">START A PROJECT</a>
        </nav>
      )}
    </header>
  );
}

function FloatingScreen({ position, rotation, accent }: { position: [number, number, number]; rotation: [number, number, number]; accent: string }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.08;
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.15, 0.72, 0.045]} />
        <meshStandardMaterial color="#111439" emissive={accent} emissiveIntensity={0.18} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[0.98, 0.55]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} />
      </mesh>
      <mesh position={[-0.25, 0.1, 0.05]}>
        <boxGeometry args={[0.42, 0.035, 0.01]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[-0.18, -0.02, 0.05]}>
        <boxGeometry args={[0.55, 0.018, 0.01]} />
        <meshBasicMaterial color="#F8F8F9" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.12, -0.1, 0.05]}>
        <boxGeometry args={[0.68, 0.018, 0.01]} />
        <meshBasicMaterial color="#F8F8F9" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const points = Array.from({ length: 70 }, (_, index) => {
    const angle = index * 2.399;
    const radius = 1.5 + (index % 8) * 0.16;
    return [Math.cos(angle) * radius, Math.sin(angle * 1.2) * 0.85, Math.sin(angle) * radius * 0.45] as [number, number, number];
  });

  return (
    <group>
      {points.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index % 5 === 0 ? 0.018 : 0.009, 6, 6]} />
          <meshBasicMaterial color={index % 3 === 0 ? '#31EC56' : index % 3 === 1 ? '#EE72F8' : '#EF036C'} transparent opacity={0.58} />
        </mesh>
      ))}
    </group>
  );
}

function ThreeHeroScene() {
  const group = useRef<Group>(null);
  const scrollProgress = useScrollProgress();
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!group.current) return;
    const scroll = reducedMotion ? 0 : scrollProgress.current;
    const pointerX = reducedMotion ? 0 : state.pointer.x;
    const pointerY = reducedMotion ? 0 : state.pointer.y;
    group.current.rotation.y += reducedMotion ? 0 : delta * (0.055 + scroll * 0.045);
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, (pointerY * 0.12) + scroll * 0.26, 0.045);
    group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, (pointerX * 0.08) - scroll * 0.18, 0.045);
    group.current.position.y = MathUtils.lerp(group.current.position.y, -scroll * 0.42, 0.045);
    group.current.position.z = MathUtils.lerp(group.current.position.z, -scroll * 0.2, 0.045);
    const scale = 1 - scroll * 0.13;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.72} />
      <pointLight position={[2, 2, 3]} color="#EE72F8" intensity={3.2} distance={6} />
      <pointLight position={[-2, -1, 2]} color="#31EC56" intensity={2.3} distance={5} />
      <pointLight position={[0, 0, 1]} color="#EF036C" intensity={1.1} distance={4} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.012, 12, 96]} />
        <meshBasicMaterial color="#EE72F8" transparent opacity={0.54} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.2, 0.6]}>
        <torusGeometry args={[1.16, 0.008, 10, 96]} />
        <meshBasicMaterial color="#EF036C" transparent opacity={0.42} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshStandardMaterial color="#111439" emissive="#EF036C" emissiveIntensity={0.65} metalness={0.9} roughness={0.16} wireframe />
      </mesh>
      <FloatingScreen position={[-0.98, 0.44, 0.05]} rotation={[0.05, 0.25, -0.28]} accent="#EE72F8" />
      <FloatingScreen position={[0.92, -0.28, 0.08]} rotation={[-0.06, -0.32, 0.22]} accent="#31EC56" />
      <ParticleField />
    </group>
  );
}

function HeroVisual() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setWebglSupported(Boolean(context));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (webglSupported !== true) {
    return <div className="webgl-fallback" aria-label="CARTIO interactive visual fallback" />;
  }

  return (
    <Canvas dpr={[1, 1.25]} camera={{ position: [0, 0, 3.5], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance' }} fallback={<div className="webgl-fallback" aria-label="CARTIO interactive visual fallback" />}>
      <ThreeHeroScene />
    </Canvas>
  );
}

function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: (event.clientX - bounds.left - bounds.width / 2) / 22,
      y: (event.clientY - bounds.top - bounds.height / 2) / 22,
    });
  };

  return (
    <section className="hero section" id="top" data-testid="section-hero">
      <div className="container-wide hero-grid">
        <div>
          <div className="eyebrow mono-label" data-testid="text-hero-eyebrow">Independent digital studio · India / everywhere</div>
          <h1>CARTIO<br /><em>BUILD. CREATE. GROW.</em></h1>
          <p className="hero-intro">Freelance web development, e-commerce, video editing and digital solutions for modern businesses and creators.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#contact" data-testid="button-hero-start">START A PROJECT <ArrowUpRight size={16} /></a>
            <a className="text-link" href="#work" data-testid="link-hero-work">View my work <span><ArrowUpRight size={14} /></span></a>
          </div>
          <div className="hero-note" data-testid="text-hero-note"><span className="live-dot" /> Taking on a few good problems for 2026</div>
        </div>
        <div className="orbital-stage" onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} data-testid="visual-hero-orbit">
          <div className="three-stage" aria-label="Interactive CARTIO 3D studio scene">
            <HeroVisual />
          </div>
          <div className="orbit orbit-a" style={{ transform: `rotate(-27deg) translate(${tilt.x * .35}px, ${tilt.y * .35}px)` }} />
          <div className="orbit orbit-b" style={{ transform: `rotate(49deg) translate(${tilt.x * .55}px, ${tilt.y * .55}px)` }} />
          <div className="orbit orbit-c" style={{ transform: `rotate(86deg) translate(${tilt.x * .75}px, ${tilt.y * .75}px)` }} />
          <div className="core" style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }} aria-label="CARTIO orbital mark" />
          <div className="stage-caption"><strong>WORKSHOP / 01</strong>Digital systems with a pulse. Built to feel inevitable.</div>
          <span className="hero-index">01 — 04</span>
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="statement" aria-label="Studio introduction" data-testid="section-statement" data-reveal>
      <div className="container-wide statement-layout">
        <div className="mono-label">The short version</div>
        <div>
          <h2>Small team energy.<br /><span>Large surface area.</span></h2>
          <p className="statement-side">From first sketch to final frame, we bring strategy, design, code, and motion into the same room. Fewer handoffs. Better decisions.</p>
        </div>
      </div>
    </section>
  );
}

function ServiceIcon({ type }: { type: 'build' | 'shape' | 'signal' }) {
  if (type === 'build') return <Code2 size={19} strokeWidth={1.5} />;
  if (type === 'shape') return <Palette size={19} strokeWidth={1.5} />;
  return <WandSparkles size={19} strokeWidth={1.5} />;
}

function Services() {
  const services = [
    { number: '01', icon: 'build' as const, title: 'Web development', copy: 'Fast, resilient web products that hold up under real use — not just a polished first impression.', tags: ['Frontend builds', 'Web apps', 'Performance'] },
    { number: '02', icon: 'build' as const, title: 'E-commerce websites', copy: 'Commerce experiences that make the path from discovery to decision feel effortless and considered.', tags: ['Storefronts', 'Conversion flows', 'Custom systems'] },
    { number: '03', icon: 'shape' as const, title: 'UI/UX design', copy: 'Interfaces with a point of view. A visual system that gives your product a voice people remember.', tags: ['Product UX', 'Visual systems', 'Prototyping'] },
    { number: '04', icon: 'signal' as const, title: 'Video editing', copy: 'Sharp, paced visual stories for launches, social feeds, explainers, and the ideas in between.', tags: ['Short form', 'Motion edits', 'Sound & pace'] },
    { number: '05', icon: 'signal' as const, title: 'AI & automation', copy: 'Smarter operations and useful AI assistance that remove friction without removing the human part.', tags: ['AI workflows', 'Automations', 'Prototypes'] },
    { number: '06', icon: 'signal' as const, title: 'Custom digital solutions', copy: 'The connective tissue behind the scenes — tailored tools for problems that do not fit a template.', tags: ['Experiments', 'Integrations', 'Digital systems'] },
  ];

  return (
    <section className="section" id="services" data-testid="section-services" data-reveal>
      <div className="container-wide">
        <div className="section-head">
          <div><div className="mono-label">01 / What we do</div><h2 className="section-title">Services<br />with a point of view.</h2></div>
          <p className="section-description">We follow the shape of the problem, then bring in exactly the right mix of craft to solve it.</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number} data-testid={`card-service-${service.number}`}>
              <span className="service-number">{service.number}</span>
              <div className="service-icon" aria-hidden="true"><ServiceIcon type={service.icon} /></div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <div className="service-list">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="service-orb" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectVisual({ project, modal = false }: { project: typeof projects[number]; modal?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) void videoRef.current.requestFullscreen();
  };

  return (
    <div className={`${modal ? 'modal-visual' : 'project-card-inner'} project-visual ${project.visual}`} data-testid={modal ? 'visual-project-modal' : `visual-project-${project.id}`}>
      {project.videoUrl ? (
        <>
          <video ref={videoRef} className="project-video" src={project.videoUrl} controls playsInline preload="metadata" aria-label={`${project.title} video preview`} />
          {modal && <button className="media-fullscreen" type="button" onClick={handleFullscreen}><ExternalLink size={13} /> Fullscreen</button>}
        </>
      ) : (
        <div className="project-placeholder" aria-label={`${project.title} ${project.mediaKind} placeholder`}>
          <span className="project-placeholder-icon"><Play size={15} fill="currentColor" /></span>
          <span>Self-initiated concept preview</span>
        </div>
      )}
      <div className="project-media-meta"><span>{project.mediaKind}</span><span>{project.videoUrl ? 'Video preview' : 'Self-initiated study'}</span></div>
    </div>
  );
}

function Work() {
  const [selected, setSelected] = useState<typeof projects[number] | null>(null);

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  return (
    <section className="section work-section" id="work" data-testid="section-work" data-reveal>
      <div className="container-wide">
        <div className="work-intro">
          <div><div className="mono-label">02 / Selected directions</div><h2 className="section-title">MY<br />WORK.</h2></div>
          <p className="work-meta">A few self-initiated studies from the workshop. Not case studies. Just a glimpse at how we think.</p>
        </div>
        <div className="work-grid">
          {projects.map((project, index) => (
            <button className={`project-card ${index === 0 ? 'tall' : ''}`} key={project.id} type="button" onClick={() => setSelected(project)} data-testid={`button-project-${project.id}`}>
              <ProjectVisual project={project} />
              <span className="project-arrow"><ArrowUpRight size={16} /></span>
              <div className="project-info">
                <div><div className="mono-label">{project.eyebrow}</div><h3>{project.title}</h3></div>
                <p>{project.copy.slice(0, 82)}…</p>
              </div>
            </button>
          ))}
        </div>
        <div className="work-foot"><span>Three explorations / infinite directions</span><span>Click a frame to inspect <ArrowUpRight size={11} /></span></div>
      </div>
      {selected && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)} data-testid="modal-project-backdrop">
          <div className="project-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={(event) => event.stopPropagation()} data-testid="modal-project">
            <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close project preview" data-testid="button-close-project"><X size={17} /></button>
            <ProjectVisual project={selected} modal />
            <div className="modal-copy"><div className="mono-label">{selected.eyebrow}</div><h2>{selected.title}</h2><p>{selected.copy}</p></div>
          </div>
        </div>
      )}
    </section>
  );
}

function Process() {
  const stages = [
    ['01', 'Discuss', 'A sharp conversation about the real opportunity underneath the brief.'],
    ['02', 'Design', 'We make the invisible tangible: flows, frames, prototypes, and a direction worth backing.'],
    ['03', 'Build', 'The chosen idea gets engineered, animated, tested, and made sturdy enough for reality.'],
    ['04', 'Deliver', 'You get a system that keeps working after launch — and a studio you can call when it evolves.'],
  ];

  return (
    <section className="section process" id="process" data-testid="section-process" data-reveal>
      <div className="container-wide process-grid">
        <div>
          <div className="mono-label">03 / How we work</div>
          <div className="process-lead"><strong>No theatre. No mystery meat process.</strong>Good work moves quickly when the right people are in the room and the work is allowed to talk.</div>
        </div>
        <div className="process-list">
          {stages.map(([number, title, copy]) => (
            <div className="process-row" key={number} data-testid={`row-process-${number}`}>
              <span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><span><ChevronRight size={17} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'accepted' | 'fallback' | 'error'>('idle');
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const service = String(data.get('service') || '');
    const details = String(data.get('details') || '');
    const body = `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${details}`;
    setStatus('sending');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, service, projectDetails: details }),
      });

      if (response.ok) {
        setStatus('accepted');
        form.reset();
        return;
      }

      if (response.status !== 503) {
        setStatus('error');
        return;
      }
    } catch {
      // The mailto path below is the intentional fallback when the delivery service is unavailable.
    }

    window.location.href = `mailto:support@cartio.in?subject=${encodeURIComponent(`Project inquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
    setStatus('fallback');
  };

  return (
    <section className="section" id="contact" data-testid="section-contact" data-reveal>
      <div className="container-wide">
        <div className="contact-panel">
          <div className="contact-grid">
            <div>
              <div className="mono-label">04 / Start a conversation</div>
              <h2>LET&apos;S BUILD<br />SOMETHING GREAT.</h2>
              <p className="contact-panel-copy">Tell us what is stuck, what is moving, or what you cannot stop thinking about. We will get back to you with a useful next step.</p>
              <a className="email-link" href="mailto:support@cartio.in" data-testid="link-contact-email"><Mail size={15} /> support@cartio.in</a>
              <a className="button-primary contact-email-cta" href="mailto:support@cartio.in" data-testid="button-contact-email">EMAIL ME <ArrowUpRight size={15} /></a>
            </div>
            <form className="inquiry-form" onSubmit={handleSubmit} data-testid="form-project-inquiry">
              <div className="field-row">
                <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required placeholder="Your name" data-testid="input-name" /></div>
                <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" name="email" required placeholder="you@company.com" data-testid="input-email" /></div>
              </div>
              <div className="field"><label htmlFor="service">What can we help with?</label><select id="service" name="service" defaultValue="" required data-testid="select-service"><option value="" disabled>Select a direction</option><option value="Web development">Web development</option><option value="Commerce build">Commerce build</option><option value="Interface design">Interface design</option><option value="Video editing">Video editing</option><option value="AI automation">AI automation</option><option value="Something custom">Something custom</option></select></div>
              <div className="field"><label htmlFor="details">Project details</label><textarea id="details" name="details" required minLength={10} maxLength={5000} placeholder="What are you imagining? What would make this a win?" data-testid="textarea-details" /></div>
              {status === 'accepted' && <div className="form-success" role="status" data-testid="status-form-submitted">Thanks — your inquiry is on its way. We&apos;ll be in touch soon.</div>}
              {status === 'fallback' && <div className="form-success" role="status" data-testid="status-form-submitted">Your email draft is ready. Send it to complete the inquiry.</div>}
              {status === 'error' && <div className="form-error" role="alert" data-testid="status-form-error">We couldn&apos;t deliver that inquiry right now. Please use Email me instead.</div>}
              <div className="form-bottom"><span className="form-note">No pitch deck required.<br />The messy version is usually more useful.</span><button className="button-primary" type="submit" disabled={status === 'sending'} data-testid="button-submit-inquiry">{status === 'sending' ? 'Sending…' : 'Send inquiry'} <Send size={15} /></button></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftCards() {
  return (
    <main className="site-shell page-shell">
      <Header />
      <section className="gift-page section" aria-labelledby="gift-cards-title">
        <div className="container-wide">
          <div className="gift-page-intro">
            <div className="mono-label">CARTIO / Secondary service</div>
            <h1 id="gift-cards-title">GIFT CARDS</h1>
            <p>Buy &amp; Sell Digital Gift Cards</p>
            <span className="gift-page-note">Manual, contact-based service. No public checkout or payment flow.</span>
          </div>
          <div className="gift-options">
            <article className="gift-option">
              <div className="gift-option-icon"><Gift size={20} /></div>
              <div>
                <div className="mono-label">01 / Find an offer</div>
                <h2>BUY GIFT CARDS</h2>
                <p>Find available gift-card offers and contact CARTIO with the card, value, and region you need.</p>
              </div>
              <a className="button-primary" href="mailto:support@cartio.in?subject=Buy gift cards" data-testid="button-buy-gift-cards">Buy gift cards <ArrowUpRight size={15} /></a>
            </article>
            <article className="gift-option">
              <div className="gift-option-icon gift-option-icon-lime"><Gift size={20} /></div>
              <div>
                <div className="mono-label">02 / Offer a card</div>
                <h2>SELL GIFT CARDS</h2>
                <p>Want to sell an eligible gift card? Email the details and CARTIO will review the offer manually.</p>
              </div>
              <a className="button-primary" href="mailto:support@cartio.in?subject=Sell gift cards" data-testid="button-sell-gift-cards">Sell gift cards <ArrowUpRight size={15} /></a>
            </article>
          </div>
          <div className="gift-channel">
            <div>
              <div className="mono-label">Stay in the loop</div>
              <h2>Offers, when they are ready.</h2>
            </div>
            <a className="text-link" href="https://whatsapp.com/channel/0029Vb92G1OLikg1ziZUxC2n" target="_blank" rel="noreferrer" data-testid="link-whatsapp-channel">Join WhatsApp channel <ExternalLink size={14} /></a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const isPrivacy = type === 'privacy';
  return (
    <main className="site-shell page-shell">
      <Header />
      <section className="legal-page section" aria-labelledby="legal-title">
        <div className="container-wide legal-copy">
          <div className="mono-label">CARTIO / {isPrivacy ? 'Privacy' : 'Terms'}</div>
          <h1 id="legal-title">{isPrivacy ? 'Privacy Policy' : 'Terms'}</h1>
          <p>For questions about this page or a project inquiry, contact <a href="mailto:support@cartio.in">support@cartio.in</a>.</p>
          <p>This page is being prepared for the full CARTIO service terms. The current website does not process public payments, checkout, orders, or customer accounts.</p>
          <a className="text-link" href="/">Back to CARTIO <ArrowUpRight size={14} /></a>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-top"><div><Brand /><p className="footer-tagline">Digital solutions for creators &amp; businesses.</p></div><div className="footer-links"><a href="/#services" data-testid="link-footer-services">Services</a><a href="/#work" data-testid="link-footer-work">Portfolio</a><a href="/#contact" data-testid="link-footer-contact">Contact</a><a href="/privacy" data-testid="link-footer-privacy">Privacy Policy</a><a href="/terms" data-testid="link-footer-terms">Terms</a></div></div>
        <div className="footer-bottom"><a href="mailto:support@cartio.in" className="footer-email">support@cartio.in</a><span>© 2026 CARTIO.in — digital studio for the next thing</span></div>
      </div>
    </footer>
  );
}

function Home() {
  useScrollReveal();
  return <main className="site-shell"><Header /><Hero /><Statement /><Services /><Work /><Process /><Contact /><Footer /></main>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/gift-cards" component={GiftCards} />
        <Route path="/privacy"><LegalPage type="privacy" /></Route>
        <Route path="/terms"><LegalPage type="terms" /></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;