// src/components/TickerPanel.tsx
import { useEffect, useRef } from 'react';

export const TickerPanel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "market": "forex",
      "showToolbar": true,
      "defaultColumn": "overview",
      "isTransparent": false,
      "locale": "en",
      "colorTheme": "dark",
      "width": "100%",
      "height": "100%"
    });
    
    containerRef.current.appendChild(script);
    
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="fixed top-[60px] right-0 w-[380px] h-[calc(100vh-60px)] bg-[#131722] border-l border-[#2a2e39] z-50 shadow-2xl overflow-hidden">
      <div ref={containerRef} className="tradingview-widget-container w-full h-full">
        <div className="tradingview-widget-container__widget w-full h-full"></div>
        <div className="tradingview-widget-copyright absolute bottom-2 right-2 text-[10px]">
          <a href="https://www.tradingview.com/markets/currencies/" rel="noopener nofollow" target="_blank" className="text-blue-400 hover:underline">
            Forex Screener
          </a>
          <span className="text-gray-500"> by TradingView</span>
        </div>
      </div>
    </div>
  );
};