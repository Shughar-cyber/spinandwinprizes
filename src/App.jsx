import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Gift,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { gameConfig } from './config/gameConfig';
import { prizes } from './data/prizes';
import { countries, regionsByCountry } from './data/locations';
import { getBottleRotationForPrize, selectPrize } from './utils/spin';
import { buildWhatsAppUrl } from './utils/whatsapp';
import { validateClaim } from './utils/validation';
import { playTickSound, playWinSound } from './utils/audio';

const initialForm = {
  fullName: '',
  age: '',
  phone: '',
  email: '',
  country: '',
  region: '',
  city: '',
  confirmed: false,
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(15);
  const [winner, setWinner] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  function handleSpin() {
    if (isSpinning || winner) return;
    const selected = selectPrize(prizes);
    const index = prizes.findIndex((prize) => prize.id === selected.id);
    const finalRotation = getBottleRotationForPrize(index, prizes.length, rotation);

    setIsSpinning(true);
    setWinner(null);
    setResultOpen(false);
    setRotation(finalRotation);

    let isActive = true;
    const tickDuration = gameConfig.spinDurationMs;
    const tickStart = Date.now();
    
    const nextTick = () => {
      if (!isActive) return;
      if (!muted) playTickSound(1.0);
      const elapsed = Date.now() - tickStart;
      const progress = Math.min(elapsed / tickDuration, 1);
      const delay = 50 + Math.pow(progress, 2) * 350;
      setTimeout(nextTick, delay);
    };
    nextTick();

    window.setTimeout(() => {
      isActive = false;
      if (!muted) playWinSound(1.0);
      setWinner(selected);
      setIsSpinning(false);
      setResultOpen(true);
    }, gameConfig.spinDurationMs);
  }

  function resetGame() {
    setWinner(null);
    setResultOpen(false);
    setClaimOpen(false);
    setSuccessOpen(false);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070711] text-white">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero
          isSpinning={isSpinning}
          rotation={rotation}
          winner={winner}
          onSpin={handleSpin}
          muted={muted}
          setMuted={setMuted}
        />
        <HowItWorks />
        <PrizeSection />
        <TermsSection />
      </main>
      <Footer />
      {winner && resultOpen && (
        <WinnerModal
          prize={winner}
          onClose={() => setResultOpen(false)}
          onClaim={() => {
            setResultOpen(false);
            setClaimOpen(true);
          }}
          onSpinAgain={gameConfig.allowReplay ? resetGame : null}
        />
      )}
      {winner && claimOpen && (
        <ClaimForm
          prize={winner}
          onClose={() => setClaimOpen(false)}
          onPrepared={(url) => {
            setWhatsappUrl(url);
            setClaimOpen(false);
            setSuccessOpen(true);
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
        />
      )}
      {winner && successOpen && (
        <ClaimSuccess prize={winner} whatsappUrl={whatsappUrl} onClose={() => setSuccessOpen(false)} />
      )}
      {winner && <Confetti />}
    </div>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  const links = [
    ['Home', '#home'],
    ['How It Works', '#how-it-works'],
    ['Prizes', '#prizes'],
    ['Terms & Conditions', '#terms'],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 p-4 sm:p-6 transition-all duration-300">
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <a href="#home" className="flex items-center gap-3 focus-ring group">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(252,211,77,0.3)] transition-transform group-hover:scale-105">
            <Sparkles size={21} />
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[.18em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">{gameConfig.brandName}</span>
            <span className="block text-[10px] uppercase tracking-wider text-white/[.58]">Promotional game</span>
          </span>
        </a>
        
        <div className="hidden items-center gap-1 md:flex rounded-full bg-white/[.04] p-1 border border-white/[.05]">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="px-5 py-2 text-xs font-bold text-white/[.72] transition-all duration-300 hover:text-slate-900 hover:bg-amber-300 rounded-full focus-ring">
              {label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="icon-btn md:hidden !rounded-xl !bg-white/[.06] hover:!bg-white/[.12] !border-white/[.08]"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="absolute inset-x-4 top-24 rounded-2xl border border-white/10 bg-[#11111f]/95 p-5 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] md:hidden">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-amber-200">Navigation</span>
            <button className="icon-btn !h-8 !w-8" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-2">
            {links.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-white/80 transition hover:bg-amber-300/10 hover:text-amber-200">
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ isSpinning, rotation, winner, onSpin, muted, setMuted }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      <div className="hero-bg" />
      <div className="mx-auto grid max-w-7xl gap-8 pb-16 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-sm font-bold text-amber-100">
            <ShieldCheck size={17} />
            100% Secure & Guaranteed Prizes
          </div>
          <h1 className="text-balance text-5xl font-black leading-[.96] tracking-normal text-white sm:text-6xl lg:text-7xl">
            SPIN THE BOTTLE & WIN!
          </h1>
          <p className="mt-5 text-xl font-semibold text-amber-100">Spin the bottle, discover your prize, and claim your reward.</p>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/[.68]">
            Take one promotional spin, land on a highlighted prize, then submit your details to continue with a prepared WhatsApp claim message.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="primary-btn" onClick={onSpin} disabled={isSpinning || !!winner}>
              <Gift size={21} />
              {isSpinning ? 'SPINNING...' : winner ? 'PRIZE SELECTED' : 'SPIN NOW'}
            </button>
            <button className="secondary-btn" type="button" onClick={() => setMuted(!muted)} aria-pressed={!muted}>
              {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              {muted ? 'Sound Off' : 'Sound On'}
            </button>
          </div>
          <p className="mt-4 text-sm text-white/50">
            {isSpinning ? 'Spinning...' : winner ? `The bottle landed on ${winner.name}.` : 'Tap the button to start your spin.'}
          </p>
        </div>
        <SpinGame isSpinning={isSpinning} rotation={rotation} winner={winner} onSpin={onSpin} />
      </div>
    </section>
  );
}

function SpinGame({ isSpinning, rotation, winner, onSpin }) {
  return (
    <div className="relative z-10 mx-auto mt-10 w-full max-w-[620px] lg:mt-0">
      <div className="game-shell">
        <div className="absolute inset-5 rounded-full border border-white/10" />
        <div className="absolute inset-12 rounded-full border border-amber-200/20" />
        <Bottle rotation={rotation} isSpinning={isSpinning} onSpin={onSpin} />
        <button
          className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-panel transition hover:bg-amber-100 focus-ring disabled:cursor-not-allowed disabled:opacity-55"
          type="button"
          onClick={onSpin}
          disabled={isSpinning || !!winner}
        >
          {isSpinning ? 'Spinning...' : 'SPIN NOW'}
        </button>
      </div>
    </div>
  );
}


function Bottle({ rotation, isSpinning, onSpin }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className={`bottle cursor-pointer ${isSpinning ? 'bottle-active' : ''}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-label="Spinning bottle pointer"
        onClick={onSpin}
        role="button"
        tabIndex={0}
      >
        <div className="bottle-neck" />
        <div className="bottle-body">
          <span className="bottle-shine" />
          <span className="bottle-label">WIN</span>
        </div>
      </div>
      <div className="absolute h-5 w-5 rounded-full border-4 border-white bg-amber-300 shadow-glow pointer-events-none" />
    </div>
  );
}

function WinnerModal({ prize, onClose, onClaim, onSpinAgain }) {
  const Icon = prize.icon;
  const isTryAgain = prize.id === 'try-again';

  return (
    <Modal onClose={onClose} labelledBy="winner-title">
      <div className="text-center">
        <div className={`mx-auto grid h-20 w-20 place-items-center rounded-2xl ${isTryAgain ? 'bg-slate-700 text-white' : 'bg-amber-300 text-slate-950 shadow-glow'}`}>
          <Icon size={36} />
        </div>
        <p className={`mt-6 text-sm font-black uppercase tracking-[.2em] ${isTryAgain ? 'text-slate-400' : 'text-amber-200'}`}>
          {isTryAgain ? 'Oops!' : 'Congratulations'}
        </p>
        <h2 id="winner-title" className="mt-2 text-3xl font-black text-white">
          {isTryAgain ? 'Better luck next time!' : `You won a ${prize.name}!`}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-white/65">
          {isTryAgain 
            ? "Your bottle landed on Try Again. Don't give up, you can always try again!"
            : "Your bottle landed on this prize. Continue to claim and prepare your WhatsApp message."}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!isTryAgain && (
            <button className="primary-btn justify-center" onClick={onClaim}>
              <MessageCircle size={20} />
              CLAIM YOUR GIFT
            </button>
          )}
          {(onSpinAgain || isTryAgain) && (
            <button 
              className={isTryAgain ? "primary-btn justify-center" : "secondary-btn justify-center"} 
              onClick={onSpinAgain || onClose}
            >
              SPIN AGAIN
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function ClaimForm({ prize, onClose, onPrepared }) {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validateClaim(form), [form]);
  const selectedCountry = countries.find((country) => country.name === form.country);
  const regionOptions = selectedCountry ? regionsByCountry[selectedCountry.code] : null;
  const canSubmit = Object.keys(errors).length === 0;
  const Icon = prize.icon;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value, ...(field === 'country' ? { region: '' } : {}) }));
  }

  function submit(event) {
    event.preventDefault();
    setTouched(Object.fromEntries(Object.keys(initialForm).map((key) => [key, true])));
    if (!canSubmit) return;
    onPrepared(buildWhatsAppUrl({ prize, form }));
  }

  return (
    <Modal onClose={onClose} labelledBy="claim-title" wide>
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-amber-200/20 bg-amber-200/10 p-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-amber-300 text-slate-950">
          <Icon size={28} />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-200">Your Prize</p>
          <h2 id="claim-title" className="text-2xl font-black text-white">{prize.name}</h2>
        </div>
      </div>
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name" error={touched.fullName && errors.fullName}>
            <input value={form.fullName} onBlur={() => setTouched({ ...touched, fullName: true })} onChange={(e) => update('fullName', e.target.value)} placeholder="Enter your full name" />
          </Field>
          <Field label="Age" error={touched.age && errors.age}>
            <input value={form.age} onBlur={() => setTouched({ ...touched, age: true })} onChange={(e) => update('age', e.target.value)} placeholder="Enter your age" inputMode="numeric" />
          </Field>
          <Field label="Phone Number" error={touched.phone && errors.phone}>
            <input value={form.phone} onBlur={() => setTouched({ ...touched, phone: true })} onChange={(e) => update('phone', e.target.value)} placeholder="Enter your phone number" inputMode="tel" />
          </Field>
          <Field label="Email Address" error={touched.email && errors.email}>
            <input value={form.email} onBlur={() => setTouched({ ...touched, email: true })} onChange={(e) => update('email', e.target.value)} placeholder="Enter your email address" inputMode="email" />
          </Field>
          <Field label="Country" error={touched.country && errors.country}>
            <input
              list="country-list"
              value={form.country}
              onBlur={() => setTouched({ ...touched, country: true })}
              onChange={(e) => update('country', e.target.value)}
              placeholder="Search and select country"
            />
            <datalist id="country-list">
              {countries.map((country) => <option key={country.code} value={country.name} />)}
            </datalist>
          </Field>
          <Field label={selectedCountry?.regionLabel || 'State / Province / Region'} error={touched.region && errors.region}>
            {regionOptions ? (
              <select value={form.region} onBlur={() => setTouched({ ...touched, region: true })} onChange={(e) => update('region', e.target.value)}>
                <option value="">Select location</option>
                {regionOptions.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
            ) : (
              <input value={form.region} onBlur={() => setTouched({ ...touched, region: true })} onChange={(e) => update('region', e.target.value)} placeholder="Enter your region" />
            )}
          </Field>
          <Field label="City" error={touched.city && errors.city}>
            <input value={form.city} onBlur={() => setTouched({ ...touched, city: true })} onChange={(e) => update('city', e.target.value)} placeholder="Enter your city" />
          </Field>
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/[.75]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-amber-300"
            checked={form.confirmed}
            onChange={(e) => update('confirmed', e.target.checked)}
          />
          <span>
            I confirm that the information I provided is accurate.
            {touched.confirmed && errors.confirmed && <span className="block pt-1 text-rose-300">{errors.confirmed}</span>}
          </span>
        </label>
        <p className="rounded-lg border border-cyan-200/15 bg-cyan-200/[.08] p-3 text-sm text-cyan-50/75">
          Privacy notice: your name, age, phone, email, country, location, and city will be used to process this claim securely in accordance with our Privacy Policy.
        </p>
        <button type="submit" className="primary-btn justify-center disabled:opacity-45" disabled={!canSubmit}>
          <MessageCircle size={20} />
          CONTINUE TO WHATSAPP
        </button>
      </form>
    </Modal>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/[.84]">
      {label}
      {children}
      {error && <span className="text-xs font-semibold text-rose-300">{error}</span>}
    </label>
  );
}

function ClaimSuccess({ prize, whatsappUrl, onClose }) {
  return (
    <Modal onClose={onClose} labelledBy="success-title">
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-emerald-300" size={62} />
        <h2 id="success-title" className="mt-4 text-3xl font-black">Your claim is ready!</h2>
        <p className="mt-3 text-white/[.68]">Your prize: <strong className="text-amber-200">{prize.name}</strong></p>
        <p className="mt-2 text-white/[.62]">Your information has been prepared for WhatsApp. Please send the prepared message there to complete your claim.</p>
        <a className="primary-btn mt-7 justify-center" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={20} />
          OPEN WHATSAPP
        </a>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose, labelledBy, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className={`modal-panel ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
        <button className="icon-btn absolute right-4 top-4" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    ['01', 'SPIN', 'Click Spin Now and watch the bottle spin.', Sparkles],
    ['02', 'WIN', 'See which prize the bottle lands on.', Gift],
    ['03', 'CLAIM', 'Enter your information to claim your prize.', CheckCircle2],
    ['04', 'CONTACT', 'Continue to WhatsApp to complete the claim process.', MessageCircle],
  ];
  return (
    <section id="how-it-works" className="section">
      <SectionTitle eyebrow="Simple journey" title="HOW IT WORKS" />
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map(([number, title, copy, Icon]) => (
          <article key={title} className="premium-card">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-white/20">{number}</span>
              <Icon className="text-amber-200" size={26} />
            </div>
            <h3 className="mt-6 text-xl font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/[.62]">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PrizeSection() {
  const categories = [...new Set(prizes.map((p) => p.category))].filter(
    (category) => category !== 'Consolation'
  );

  return (
    <section id="prizes" className="section">
      <SectionTitle eyebrow="Prize pool" title="AVAILABLE PRIZES" />
      <div className="mt-8 grid gap-8">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-4 text-lg font-bold text-amber-200 border-b border-white/10 pb-2">{category}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {prizes
                .filter((prize) => prize.category === category)
                .map((prize) => {
                  const Icon = prize.icon;
                  return (
                    <article key={prize.id} className="premium-card !p-4 flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/10 text-amber-200">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold leading-tight">{prize.name}</h4>
                        <p className="mt-1 text-[13px] leading-5 text-white/[.62]">{prize.description}</p>
                        <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${prize.available ? 'bg-emerald-300/15 text-emerald-200' : 'bg-rose-300/15 text-rose-200'}`}>
                          {prize.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


function TermsSection() {
  const terms = [
    'Age 18+ Only',
    'One Spin Per User',
    'Prizes Subject to Availability',
    'Claim via WhatsApp',
    'Your Data is Secure',
    'Fair Play & Anti-Fraud',
  ];

  return (
    <section id="terms" className="section pb-20">
      <SectionTitle eyebrow="Important Rules" title="TERMS & CONDITIONS" />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {terms.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-sm font-bold text-white/[.82] transition hover:bg-white/[.08]">
            <ChevronRight className="shrink-0 text-amber-200" size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-black uppercase tracking-[.24em] text-amber-200">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/48">
      <p>&copy; {new Date().getFullYear()} {gameConfig.brandName}. All rights reserved.</p>
    </footer>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] mx-auto h-64 max-w-4xl overflow-hidden">
      {Array.from({ length: 38 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-3 w-2 animate-confetti-fall rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 10}%`,
            '--x': `${Math.random() * 160 - 80}px`,
            animationDelay: `${Math.random() * 0.7}s`,
            backgroundColor: ['#facc15', '#67e8f9', '#fb7185', '#86efac', '#ffffff'][index % 5],
          }}
        />
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070711] text-white">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-2xl animate-pulse" />
        <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-amber-300 text-slate-950 shadow-glow animate-bounce">
          <Sparkles size={42} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-amber-200 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-amber-200 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-amber-200"></div>
      </div>
    </div>
  );
}

