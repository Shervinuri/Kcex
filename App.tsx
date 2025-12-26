
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Globe, 
  UserCheck, 
  ExternalLink, 
  Download, 
  Gem, 
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { REFERRAL_LINK, TELEGRAM_LINK, APP_DOWNLOAD_LINK } from './constants';

const LOGO_URL = "https://support.kcexhelp.com/hc/theming_assets/01JFFN7DSFET3NRCS6NNS46M68";
const INTRO_SUBTEXT = "Exclusive SHΞN™ Strategies";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

interface GatherParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  accel: number;
  friction: number;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [step, setStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTabOpen, setIsTabOpen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introCanvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const gatherParticles = useRef<GatherParticle[]>([]);
  const requestRef = useRef<number>(0);
  const introRequestRef = useRef<number>(0);
  const lastY = useRef<number>(0);
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const logoAlpha = useRef(0);
  const typewriterProgress = useRef(0);
  const revealTriggered = useRef(false);
  const finalTransitionStarted = useRef(false);

  const initIntro = () => {
    const canvas = introCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = LOGO_URL;
    img.onload = () => {
      logoImageRef.current = img;
      const w = 180;
      const h = (img.height / img.width) * w;
      const startX = (canvas.width - w) / 2;
      const startY = (canvas.height - h) / 2 - 80; // کمی بالاتر برای جا شدن متن زیرش

      ctx.drawImage(img, startX, startY, w, h);
      const imageData = ctx.getImageData(startX, startY, w, h).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gap = 2; 
      gatherParticles.current = [];
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const index = (y * w + x) * 4;
          if (imageData[index + 3] > 128) {
            gatherParticles.current.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              targetX: startX + x,
              targetY: startY + y,
              vx: (Math.random() - 0.5) * 20,
              vy: (Math.random() - 0.5) * 20,
              size: Math.random() * 1.2 + 0.3,
              color: `rgba(229, 181, 163, ${Math.random() * 0.4 + 0.6})`, 
              accel: Math.random() * 0.04 + 0.02,
              friction: 0.9
            });
          }
        }
      }
      animateIntro();
    };
  };

  const animateIntro = () => {
    const canvas = introCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allSettled = true;

    // ۱. انیمیشن ذرات لوگو
    gatherParticles.current.forEach(p => {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0.15) {
        p.vx += dx * p.accel;
        p.vy += dy * p.accel;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;
        allSettled = false;
      } else {
        p.x = p.targetX;
        p.y = p.targetY;
      }

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // ۲. ظاهر شدن لوگوی واقعی و متن تایپی
    if (allSettled || logoAlpha.current > 0) {
      if (logoImageRef.current) {
        const img = logoImageRef.current;
        const w = 180;
        const h = (img.height / img.width) * w;
        const startX = (canvas.width - w) / 2;
        const startY = (canvas.height - h) / 2 - 80;
        
        ctx.save();
        ctx.globalAlpha = logoAlpha.current;
        ctx.drawImage(img, startX, startY, w, h);
        ctx.restore();

        if (logoAlpha.current < 1) {
          logoAlpha.current += 0.03;
        } else {
          // ۳. شروع افکت تایپ بعد از لود کامل لوگو
          if (typewriterProgress.current < INTRO_SUBTEXT.length) {
            typewriterProgress.current += 0.25; // سرعت تایپ
          } else if (!finalTransitionStarted.current) {
            // ۴. اتمام تایپ و شروع ترنزیشن نهایی
            finalTransitionStarted.current = true;
            setTimeout(() => {
              setIsFadingOut(true);
              setTimeout(() => setLoading(false), 1000);
            }, 1500);
          }

          // رسم متن تایپی
          const currentText = INTRO_SUBTEXT.substring(0, Math.floor(typewriterProgress.current));
          ctx.font = 'bold 15px Arimo, sans-serif';
          ctx.fillStyle = 'rgba(229, 181, 163, 0.8)';
          ctx.textAlign = 'center';
          ctx.letterSpacing = "2px";
          ctx.fillText(currentText, canvas.width / 2, startY + h + 40);
        }
      }
    }
    introRequestRef.current = requestAnimationFrame(animateIntro);
  };

  const animateScrollParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.current.length; i++) {
      const p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      p.size *= 0.96;

      if (p.life <= 0) {
        particles.current.splice(i, 1);
        i--;
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestRef.current = requestAnimationFrame(animateScrollParticles);
  };

  const createParticles = (y: number) => {
    const scrollDelta = y - lastY.current;
    if (Math.abs(scrollDelta) < 0.5) return;

    for (let i = 0; i < 4; i++) {
      particles.current.push({
        x: isTabOpen ? 35 : 10, 
        y: y + 45 + (Math.random() - 0.5) * 15,
        vx: -Math.random() * 2,
        vy: -scrollDelta * 0.25 + (Math.random() - 0.5) * 0.8, 
        life: 1.0,
        size: Math.random() * 2.5 + 0.5,
        color: Math.random() > 0.4 ? '#E5B5A3' : '#FFF0E8' 
      });
    }
    lastY.current = y;
  };

  useEffect(() => {
    if (loading) {
      const resizeIntro = () => {
        if (introCanvasRef.current) {
          introCanvasRef.current.width = window.innerWidth;
          introCanvasRef.current.height = window.innerHeight;
          initIntro();
        }
      };
      window.addEventListener('resize', resizeIntro);
      resizeIntro();
      return () => {
        window.removeEventListener('resize', resizeIntro);
        cancelAnimationFrame(introRequestRef.current);
      };
    } else {
      const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        setScrollProgress(progress);
        
        const handleHeight = 90;
        const currentY = (progress / 100) * (window.innerHeight - handleHeight);
        createParticles(currentY);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      requestRef.current = requestAnimationFrame(animateScrollParticles);

      const resizeCanvas = () => {
        if (canvasRef.current) {
          canvasRef.current.width = 120; 
          canvasRef.current.height = window.innerHeight;
        }
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] transition-opacity duration-1000 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <canvas ref={introCanvasRef} className="absolute inset-0" />
      </div>
    );
  }

  const handleStepNext = () => setStep(prev => prev + 1);

  return (
    <div className="min-h-screen bg-black flex flex-col selection:bg-[#E5B5A3]/20 relative overflow-x-hidden">
      
      <canvas 
        ref={canvasRef}
        className="fixed left-0 top-0 z-[55] pointer-events-none opacity-80"
      />

      {/* SHΞЯVIN™ Unified Floating Side Panel */}
      <div className="fixed left-0 top-0 h-full w-2 z-[60] pointer-events-none">
        <div 
          onClick={() => setIsTabOpen(!isTabOpen)}
          className={`pointer-events-auto absolute left-0 flex items-stretch transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) cursor-pointer group rounded-r-xl overflow-hidden shadow-[4px_0_25px_rgba(0,0,0,0.6)] border-r border-y border-[#E5B5A3]/30 ${isTabOpen ? 'w-48' : 'w-4'}`}
          style={{ 
            top: `calc(${scrollProgress}% - ((${scrollProgress} / 100) * 90px))`,
            height: '90px',
            marginTop: '10px'
          }}
        >
          <div className="absolute inset-0 gold-gradient-button opacity-100 z-0"></div>
          
          <div className={`relative z-10 flex-shrink-0 w-4 h-full flex items-center justify-center transition-all duration-300 ${isTabOpen ? 'bg-black/10' : ''}`}>
            <span 
              className="font-black text-[5px] uppercase tracking-[0.4em] text-black/80" 
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              SHΞЯVIN™
            </span>
          </div>

          <div className={`relative z-10 flex-grow flex items-center justify-center transition-all duration-500 ${isTabOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <a 
              href={TELEGRAM_LINK} 
              target="_blank" 
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-black/5 transition-all"
            >
              <div className="p-2 bg-black/10 rounded-full text-black/70">
                <MessageCircle size={20} />
              </div>
              <span className="text-[9px] font-black text-black/80 uppercase tracking-widest">Connect Support</span>
            </a>
          </div>

          {!isTabOpen && (
            <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10 group-hover:bg-white/20"></div>
          )}
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <img src={LOGO_URL} alt="KCEX" className="h-7 object-contain ml-8 brightness-110" />
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] hidden sm:block">Official Partner</span>
            <div className="w-2 h-2 rounded-full bg-[#E5B5A3] shadow-[0_0_8px_#E5B5A3] animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6 sm:pl-14">
          
          <section className="min-h-[70vh] flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
            
            {step === 1 && (
              <div className="fade-in w-full text-center space-y-10">
                <h1 className="text-4xl md:text-7xl font-black leading-tight flex flex-col items-center">
                  <img src={LOGO_URL} alt="KCEX" className="h-16 md:h-24 object-contain mb-6 brightness-125" />
                  <span className="text-lg md:text-2xl text-zinc-500 font-medium block px-2">این صرافی رو هـمـه ی ایرانی‌ها می‌شناسند!</span>
                </h1>
                
                <div className="glass-panel p-6 md:p-14 rounded-3xl shadow-2xl space-y-8 max-w-2xl mx-auto">
                  <p className="text-zinc-300 text-sm md:text-xl leading-loose font-medium px-4">
                    ثبت‌نام ۵ دقیقه‌ای بدون تحریم با پذیرش <span className="gold-gradient-text font-black px-1">کارت ملی معتبر ایرانی</span>.
                    <br className="hidden md:block" />
                    دریافت وام ارز معاملاتی بدون پرداخت یک ریال هزینه!
                  </p>
                  <button 
                    onClick={handleStepNext}
                    className="w-full md:w-auto px-10 py-5 gold-gradient-button text-black font-black text-lg rounded-2xl transition-all flex items-center justify-center mx-auto"
                  >
                    خوب که چی !؟؟
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="fade-in w-full text-center max-w-2xl mx-auto px-2">
                <div className="glass-panel p-8 md:p-16 rounded-3xl space-y-12">
                  <div className="space-y-4">
                    <span className="gold-gradient-text text-3xl md:text-5xl font-black block leading-tight no-underline">دلار شده ۱۳۲ هزار تومان!</span>
                  </div>

                  <div className="space-y-10">
                    <p className="text-zinc-300 text-sm md:text-lg leading-loose text-center px-6">
                      این صرافی با طی چند مرحله ساده نزدیک به <span className="gold-gradient-text font-black text-xl px-1">۲۰۰ دلار</span> به شما ارز برای معامله میده. 
                    </p>
                    
                    <p className="text-zinc-300 text-sm md:text-lg leading-loose text-center px-6">
                      اگر تو معامله از بین بره، اتفاق خاصی نمی‌افته و ضرری نخواهید کرد! 
                    </p>
                    
                    <p className="text-zinc-300 text-sm md:text-lg leading-loose text-center px-6">
                      و نهایتا شما صاحب یک حساب معتبر ارزی با کارمزدهای <span className="text-white font-bold px-1"> ۰٪ واقعی</span> میشی. 
                      اما با یکم تجربه و ایرانی بازی راحت با این مبلغ میتونی <span className="gold-gradient-text font-black px-1">۴ الی ۵ برابر</span> سود استخراج کنید!
                    </p>
                  </div>

                  <button 
                    onClick={handleStepNext}
                    className="w-full py-5 gold-gradient-button text-black font-black text-lg rounded-2xl transition-all active:scale-95"
                  >
                    حالا چکار کنم ؟
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="fade-in w-full max-w-4xl mx-auto space-y-12">
                <div className="glass-panel p-8 md:p-16 rounded-3xl text-center space-y-12">
                  <div className="flex flex-col items-center gap-6">
                    <Gem className="text-[#E5B5A3]" size={48} />
                    <h2 className="text-2xl md:text-5xl font-black gold-gradient-text leading-tight uppercase px-6">
                      حالا معامله‌‌مون نشه!؟
                    </h2>
                  </div>
                  
                  <div className="space-y-12">
                    <p className="text-zinc-400 text-sm md:text-lg leading-loose max-w-2xl mx-auto px-6">
                      اگر تا الان ثبت‌نام نکردی یا با ترید آشنایی نداری، مشکلی نیست. شما اگر فقط ثبت‌نام و احراز هویت اولیه رو هم انجام بدی، چون صرافی برای ثبت نامت به حساب من پورسانت اختصاص میده!
                    </p>

                    <div className="p-8 md:p-12 bg-black/50 rounded-2xl border border-[#E5B5A3]/10 text-zinc-300 leading-loose text-xs md:text-base text-right relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-[#E5B5A3]/30"></div>
                      <div className="space-y-8">
                        <p className="px-4">
                          من می‌تونم در قبالش بهت کمک کنم تا اعتبار دریافتی بونس دلاری خودت رو از بین نبری ! بدون دخالت در اکانتت، تنها از طریق تلگرام راهنماییت می‌کنم که چه معامله‌ای انجام بدی. 
                        </p>
                        <p className="px-4 font-bold text-zinc-400 border-r border-zinc-800">
                         ... کلا داستان ترغیب شما هم همینه! من نه عاشق چشم و ابروتم نه بنگاه خیره دارم و نه کسب درآمد شما مستقیماً برای من اهمیتی داره؛ بحث معامله ی دوسر سوده ، در قبال پورسانتی که از صرافی دریافت می‌کنم بهتون کمک می‌کنم خره که از پل رد شد ولت نمیکنم بونس‌ت رو با دست خودت برات نقد میکنم هم یچیز یاد بگیری هم تعامل خیر ش ۲طرفه با !
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <a 
                      href={REFERRAL_LINK} 
                      target="_blank"
                      className="flex flex-col items-center justify-center p-8 gold-gradient-button text-black rounded-2xl transition-all font-black no-underline"
                    >
                      <span className="text-xl">ثبت‌نام با دعوتنامه</span>
                      <span className="text-[10px] uppercase tracking-widest mt-2 opacity-70">Exclusive Access</span>
                    </a>
                    <a 
                      href={REFERRAL_LINK} 
                      target="_blank"
                      className="flex flex-col items-center justify-center p-8 bg-zinc-900 text-white rounded-2xl border border-white/5 hover:bg-zinc-800 transition-colors font-bold no-underline"
                    >
                      ورود مستقل بی دعوت !
                      <span className="text-[10px] uppercase tracking-widest mt-2 text-zinc-500">Official Portal</span>
                    </a>
                  </div>

                  <button 
                    onClick={() => {
                      setShowTutorial(true);
                      setTimeout(() => {
                        document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="inline-flex items-center gap-3 text-[#E5B5A3] text-[10px] font-black uppercase tracking-[0.4em] hover:text-[#FFDFD3] transition-colors bg-[#E5B5A3]/5 px-10 py-5 rounded-full border border-[#E5B5A3]/10 mx-auto"
                  >
                    <TrendingUp size={18} /> مشاهده آموزش و ابزارها
                  </button>
                </div>
              </div>
            )}

          </section>

          {showTutorial && (
            <div id="roadmap" className="fade-in space-y-24 md:space-y-32 py-20 md:py-32 max-w-6xl mx-auto px-4">
              
              <div className="text-center space-y-6">
                <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight">نقشه راه ۵ دقیقه‌ای</h3>
                <div className="w-20 h-1.5 bg-[#C28E7D] mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[
                  { icon: <Zap size={20} />, t: "ثبت‌نام اولیه", d: "ابتدا از طریق لینک‌های موجود در همین صفحه ثبت‌نام خود را در وب‌سایت انجام دهید." },
                  { icon: <Smartphone size={20} />, t: "نصب اپلیکیشن", d: "اپلیکیشن رسمی KCEX را دانلود کرده و با شماره موبایل ایران یا ایمیل خود وارد شوید." },
                  { icon: <ShieldCheck size={20} />, t: "شروع احراز هویت", d: "از منوی پروفایل، وارد بخش Verify شده و گزینه ID Card را انتخاب کنید." },
                  { icon: <Globe size={20} />, t: "انتخاب منطقه", d: "در مرحله انتخاب کشور، گزینه Other Countries را تیک بزنید." },
                  { icon: <UserCheck size={20} />, t: "آپلود مدارک", d: "تصویر کارت ملی هوشمند خود را به ترتیب پشت و رو با گوشی ثبت و ارسال کنید." },
                  { icon: <ExternalLink size={20} />, t: "اسکن چهره", d: "سلفی به صورت خودکار چهره شما را اسکن می‌کند. حالا منتظر تایید بمانید." }
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-10 rounded-3xl hover:border-[#E5B5A3]/30 transition-all flex flex-col items-center text-center group border border-white/5">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#C28E7D]/20 flex items-center justify-center text-[#E5B5A3] mb-8 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-xl md:text-2xl font-black text-white mb-4">{item.t}</h4>
                    <p className="text-zinc-500 text-sm leading-loose px-4">{item.d}</p>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-[3rem] p-10 md:p-20 space-y-20 border border-white/5">
                <h3 className="text-xs md:text-xl font-black text-zinc-600 text-center uppercase tracking-[0.5em]">Essential Ecosystem Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  
                  <div className="bg-black/50 p-10 rounded-3xl border border-white/5 flex flex-col items-center text-center group">
                    <ShieldCheck className="text-[#C28E7D] mb-8" size={48} />
                    <h4 className="text-xl md:text-2xl font-black mb-3">Google Authenticator</h4>
                    <p className="text-zinc-500 text-xs mb-10 leading-loose px-6">امنیت فوق پیشرفته ۲ مرحله‌ای برای برداشت و مدیریت وجه</p>
                    <div className="flex gap-6 w-full justify-center">
                      <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" className="px-8 py-3 bg-zinc-800 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors no-underline">iOS Store</a>
                      <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" className="px-8 py-3 bg-zinc-800 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors no-underline">Play Store</a>
                    </div>
                  </div>

                  <div className="bg-black/50 p-10 rounded-3xl border border-white/5 flex flex-col items-center text-center group">
                    <Download className="text-[#E5B5A3] mb-8" size={48} />
                    <h4 className="text-xl md:text-2xl font-black mb-3">KCEX Official App</h4>
                    <p className="text-zinc-500 text-xs mb-10 leading-loose px-6">تجربه ترید حرفه‌ای بدون تاخیر و محدودیت در پلتفرم موبایل</p>
                    <a href={APP_DOWNLOAD_LINK} className="w-full py-5 gold-gradient-button text-black rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all max-w-sm mx-auto no-underline">Download Global App</a>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <footer className="py-24 border-t border-white/5 bg-black text-center space-y-16">
        <div>
          <a 
            href={TELEGRAM_LINK} 
            target="_blank" 
            className="shen-footer-gradient text-4xl md:text-7xl font-black tracking-tighter hover:brightness-125 transition-all inline-block px-8 no-underline"
          >
            Exclusive SHΞN™ made
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 px-8">
          {["Security Guaranteed", "No VPN Required", "Official Referral", "Zero Fees"].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-[10px] text-zinc-600 font-black tracking-[0.4em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#8C6A5C]"></span>
              {text}
            </div>
          ))}
        </div>

        <p className="text-[10px] text-zinc-800 uppercase tracking-[0.6em] font-black opacity-30 px-8">
          DESIGNED FOR THE NEXT GENERATION OF IRANIAN TRADERS • SHΞЯVIN™ ECOSYSTEM 2024
        </p>
      </footer>
    </div>
  );
};

export default App;
