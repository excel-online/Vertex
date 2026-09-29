import { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1920&q=80',
    title: 'Advanced Asset',
    highlight: 'Management.',
    subtitle: 'High-Yield Crypto Portfolios',
    description: 'Let our professional traders maximize your market returns.',
    cta: 'Get Started'
  },
  {
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1920&q=80',
    title: 'Secure Global',
    highlight: 'Trading.',
    subtitle: 'Multi-Currency Infrastructure',
    description: 'Execute trades securely across international liquidity pools.',
    cta: 'Explore Markets'
  },
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    title: 'Real-Time Market',
    highlight: 'Analytics.',
    subtitle: 'Precision Data Tracking',
    description: 'Monitor live crypto assets and currency exchange rates instantly.',
    cta: 'View Portfolios'
  },
  {
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1920&q=80',
    title: 'Instant Automated',
    highlight: 'Payouts.',
    subtitle: '24/7 Dedicated Support',
    description: 'Enjoy fast, frictionless deposits and withdrawals anytime.',
    cta: 'Join Now'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden bg-[#060b13] pt-28">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Professional Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060b13]/95 via-[#060b13]/80 to-[#060b13]/90" />
        </div>
      ))}

      {/* Content - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${index === currentSlide ? 'block' : 'hidden'}`}
            >
              {/* Main Title */}
              <div className="overflow-hidden">
                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight transform transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  {slide.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{slide.highlight}</span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className="overflow-hidden mt-4">
                <h2
                  className={`text-lg sm:text-2xl font-bold text-red-500 uppercase tracking-widest transform transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  {slide.subtitle}
                </h2>
              </div>

              {/* Description */}
              <div className="overflow-hidden mt-3">
                <p
                  className={`text-sm sm:text-base text-slate-300 max-w-xl mx-auto transform transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  {slide.description}
                </p>
              </div>

              {/* CTA Button */}
              <div className="overflow-hidden pt-8">
                <NavLink
                  to="/register"
                  className={`inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-4 text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-blue-600/30 transition-all duration-700 transform ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  style={{ transitionDelay: '800ms' }}
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator - Right Side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50'
                : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
