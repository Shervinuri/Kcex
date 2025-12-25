
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
  TrendingUp 
} from 'lucide-react';
import { REFERRAL_LINK, TELEGRAM_LINK, APP_DOWNLOAD_LINK } from './constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const lastY = useRef<number>(0);

  // Particle System Logic
  const animate = () => {
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
    requestRef.current = requestAnimationFrame(animate);
  };

  const createParticles = (y: number) => {
    const diff = Math.abs(y - lastY.current);
    if (diff < 1) return;

    for (let i = 0; i < 4; i++) {
      particles.current.push({
        x: 10 + (Math.random() - 0.5) * 6,
        y: y + 40 + (Math.random() - 0.5) * 30,
        vx: -Math.random() * 1.2,
        vy: (Math.random() - 0.5) * 0.8,
        life: 1.0,
        size: Math.random() * 2.5 + 0.5,
        color: Math.random() > 0.4 ? '#fbbf24' : '#fff7ed'
      });
    }
    lastY.current = y;
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      
      const handleHeight = 80;
      const currentY = (progress / 100) * (window.innerHeight - handleHeight);
      createParticles(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestRef.current = requestAnimationFrame(animate);

    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = 40;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[999]">
        <h1 className="text-4xl font-black gold-gradient-text tracking-[0.5em] uppercase">KCEX</h1>
        <p className="mt-4 text-zinc-700 text-[10px] tracking-[0.8em] uppercase font-bold">SHΞN™ Exclusive</p>
      </div>
    );
  }

  const handleStepNext = () => setStep(prev => prev + 1);

  return (
    <div className="min-h-screen bg-black flex flex-col selection:bg-amber-500/20 relative">
      
      {/* SHΞЯVIN™ Particle Trail Canvas */}
      <canvas 
        ref={canvasRef}
        className="fixed left-0 top-0 z-[55] pointer-events-none opacity-80"
      />

      {/* SHΞЯVIN™ Vertical Custom Scrollbar Handle */}
      <div 
        className="fixed left-0 top-0 h-full w-5 z-[60] pointer-events-none border-r border-white/5 bg-white/2"
      >
        <a 
          href={REFERRAL_LINK} 
          target="_blank" 
          className="pointer-events-auto absolute left-0 w-full bg-amber-500/90 text-black py-4 rounded-r-md font-black text-[7px] uppercase shadow-[2px_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400 transition-all flex items-center justify-center group"
          style={{ 
            top: `calc(${scrollProgress}% - ((${scrollProgress} / 100) * 80px))`,
            writingMode: 'vertical-rl', 
            textOrientation: 'mixed',
            height: '80px',
            marginTop: '10px'
          }}
        >
          <span className="group-hover:scale-105 transition-transform tracking-[0.2em] whitespace-nowrap opacity-90">
            ☬ SHΞЯVIN™
          </span>
        </a>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <span className="text-2xl font-black gold-gradient-text tracking-tighter ml-8">KCEX</span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] hidden sm:block">Official Partner</span>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6 pl-12">
          
          {/* Step System */}
          <section className="min-h-[70vh] flex flex-col items-center justify-center max-w-4xl mx-auto">
            
            {step === 1 && (
              <div className="fade-in w-full text-center space-y-10">
                <h1 className="text-4xl md:text-7xl font-black leading-tight">
                  <span className="gold-gradient-text block mb-2">KCEX</span>
                  <span className="text-lg md:text-2xl text-zinc-500 font-medium block">این صرافی رو همه ی ایرانی‌ها می‌شناسند!</span>
                </h1>
                
                <div className="glass-panel p-8 md:p-14 rounded-3xl shadow-2xl space-y-8 max-w-2xl mx-auto">
                  <p className="text-zinc-300 text-base md:text-xl leading-relaxed font-medium">
                    ثبت‌نام ۵ دقیقه‌ای با پذیرش <span className="text-amber-500 font-bold">کارت ملی معتبر ایران</span>.
                    <br className="hidden md:block" />
                    دریافت ارز معاملاتی بدون پرداخت یک ریال هزینه!
                  </p>
                  <button 
                    onClick={handleStepNext}
                    className="w-full md:w-auto px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-amber-500 font-black text-lg rounded-2xl border border-white/5 transition-all flex items-center justify-center mx-auto"
                  >
                    خوب که چی !؟؟
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="fade-in w-full text-center max-w-2xl mx-auto">
                <div className="glass-panel p-10 md:p-16 rounded-3xl space-y-8">
                  <div className="space-y-2">
                    <span className="gold-gradient-text text-3xl md:text-5xl font-black block">دلار شده ۱۳۲ هزار تومان!</span>
                    <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
                  </div>

                  <p className="text-zinc-300 text-base md:text-lg leading-relaxed text-center">
                    این صرافی با طی چند مرحله ساده نزدیک به <span className="text-amber-500 font-black text-xl px-1">۲۰۰ دلار</span> به شما ارز برای معامله میده. 
                    اگر تو معامله از بین بره، اتفاق خاصی نمی‌افته و ضرری نخواهید کرد! 
                    <br /><br />
                    صاحب یک حساب معتبر با کارمزدهای <span className="text-white font-bold underline decoration-amber-500 underline-offset-4">۰٪ واقعی</span> شوید. 
                    با این مبلغ به راحتی می‌توانید <span className="text-amber-400 font-bold">۴ الی ۵ برابر</span> سود استخراج کنید!
                  </p>

                  <button 
                    onClick={handleStepNext}
                    className="w-full py-5 bg-amber-500 text-black font-black text-lg rounded-2xl shadow-xl hover:brightness-110 transition-all active:scale-95"
                  >
                    حالا چکار کنم ؟
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="fade-in w-full max-w-4xl mx-auto space-y-12">
                <div className="glass-panel p-10 md:p-16 rounded-3xl text-center space-y-10">
                  <Gem className="mx-auto text-amber-500" size={40} />
                  <h2 className="text-3xl md:text-5xl font-black gold-gradient-text leading-tight uppercase">
                    معامله مون نشه !؟
                  </h2>
                  
                  <div className="space-y-8">
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                      اگر تا الان ثبت‌نام نکردی یا با ترید آشنایی نداری، مشکلی نیست. حتی اگر فقط ثبت‌نام و احراز هویت اولیه رو هم انجام بدی (البته از طریق این درگاه)، چون صرافی برای ورودت به حساب من پورسانت تعلق میده!
                    </p>

                    <div className="p-8 bg-black/40 rounded-2xl border border-amber-500/10 text-zinc-300 leading-relaxed text-sm md:text-base text-right relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500/30"></div>
                      من می‌تونم در قبالش بهت کمک کنم تا اعتبار دریافتی خودت رو از بین نبری. بدون دخالت در اکانتت، تنها از طریق تلگرام راهنماییت می‌کنم که چه معامله‌ای انجام بدی. علت ترغیب شما همینه! من نه عاشق چشم و ابروی شمام و نه کسب درآمد شما مستقیماً برای من اهمیتی داره؛ فقط در قبال پورسانتی که دریافت می‌کنم بهتون کمک می‌کنم تا این تعامل برکت دو سویه داشته باشه و داستان حلال شه!
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href={REFERRAL_LINK} 
                      target="_blank"
                      className="flex flex-col items-center justify-center p-8 bg-amber-500 text-black rounded-2xl hover:scale-[1.01] transition-transform font-black"
                    >
                      <span className="text-xl">ثبت‌نام با دعوتنامه</span>
                      <span className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Support Access</span>
                    </a>
                    <a 
                      href={REFERRAL_LINK} 
                      target="_blank"
                      className="flex flex-col items-center justify-center p-8 bg-zinc-900 text-white rounded-2xl border border-white/5 hover:bg-zinc-800 transition-colors font-bold"
                    >
                      ورود مستقل
                      <span className="text-[10px] uppercase tracking-widest mt-1 text-zinc-500">Official Portal</span>
                    </a>
                  </div>

                  <button 
                    onClick={() => {
                      setShowTutorial(true);
                      setTimeout(() => {
                        document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="inline-flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-amber-400 transition-colors bg-amber-500/5 px-6 py-3 rounded-full border border-amber-500/10"
                  >
                    <TrendingUp size={14} /> مشاهده آموزش و ابزارها
                  </button>
                </div>
              </div>
            )}

          </section>

          {/* Tutorial Section */}
          {showTutorial && (
            <div id="roadmap" className="fade-in space-y-24 py-32 max-w-6xl mx-auto">
              
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase">نقشه راه ۵ دقیقه‌ای</h3>
                <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: <Zap size={22} />, t: "ثبت‌نام اولیه", d: "ابتدا از طریق لینک‌های موجود در همین صفحه ثبت‌نام خود را در وب‌سایت انجام دهید." },
                  { icon: <Smartphone size={22} />, t: "نصب اپلیکیشن", d: "اپلیکیشن رسمی KCEX را دانلود کرده و با شماره موبایل ایران یا ایمیل خود وارد شوید." },
                  { icon: <ShieldCheck size={22} />, t: "شروع احراز هویت", d: "از منوی پروفایل، وارد بخش Verify شده و گزینه ID Card را انتخاب کنید." },
                  { icon: <Globe size={22} />, t: "انتخاب منطقه", d: "در مرحله انتخاب کشور، گزینه Other Countries را تیک بزنید." },
                  { icon: <UserCheck size={22} />, t: "آپلود مدارک", d: "تصویر کارت ملی هوشمند خود را به ترتیب پشت و رو با گوشی ثبت و ارسال کنید." },
                  { icon: <ExternalLink size={22} />, t: "اسکن چهره", d: "سلفی به صورت خودکار چهره شما را اسکن می‌کند. حالا منتظر تایید بمانید." }
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-8 rounded-2xl hover:border-amber-500/20 transition-all flex flex-col items-center text-center group">
                    <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{item.t}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>

              {/* Tools Section */}
              <div className="glass-panel rounded-3xl p-8 md:p-16 space-y-16">
                <h3 className="text-xl font-black text-zinc-600 text-center uppercase tracking-[0.4em]">Essential Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="bg-black/40 p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center group">
                    <ShieldCheck className="text-amber-600 mb-6" size={40} />
                    <h4 className="text-xl font-bold mb-2">Google Authenticator</h4>
                    <p className="text-zinc-500 text-xs mb-8 leading-relaxed">امنیت ۲ مرحله‌ای برای برداشت وجه</p>
                    <div className="flex gap-3">
                      <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" className="px-5 py-2 bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-wider">iOS</a>
                      <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" className="px-5 py-2 bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-wider">Android</a>
                    </div>
                  </div>

                  <div className="bg-black/40 p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center group">
                    <Download className="text-amber-500 mb-6" size={40} />
                    <h4 className="text-xl font-bold mb-2">KCEX Official App</h4>
                    <p className="text-zinc-500 text-xs mb-8 leading-relaxed">ترید حرفه‌ای بدون محدودیت</p>
                    <a href={APP_DOWNLOAD_LINK} className="w-full py-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">Download Mobile</a>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* SHΞN™ Signature Footer */}
      <footer className="py-20 border-t border-white/5 bg-black text-center space-y-12">
        <div>
          <a 
            href={TELEGRAM_LINK} 
            target="_blank" 
            className="shen-footer-gradient text-3xl md:text-6xl font-black tracking-tighter hover:brightness-125 transition-all inline-block"
          >
            Exclusive SHΞN™ made
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 px-6">
          {["Security Guaranteed", "No VPN Required", "Official Referral", "Zero Fees"].map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px] text-zinc-600 font-black tracking-[0.3em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-900"></span>
              {text}
            </div>
          ))}
        </div>

        <p className="text-[8px] text-zinc-800 uppercase tracking-[0.5em] font-black opacity-30">
          DESIGNED FOR THE NEXT GENERATION OF IRANIAN TRADERS • 2024
        </p>
      </footer>
    </div>
  );
};

export default App;
