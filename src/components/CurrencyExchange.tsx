import { useEffect, useRef } from 'react';

const CurrencyExchange = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en",
      "currencies": [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY"
      ],
      "backgroundColor": "#090D16",
      "width": "100%",
      "height": 500
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#090D16] overflow-hidden font-sans text-sm relative">
      <div ref={containerRef} className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/markets/currencies/forex-heat-map/"
            rel="noopener nofollow"
            target="_blank"
            className="text-gold hover:underline"
          >
            <span>Forex Heat Map</span>
          </a>
          <span className="text-muted-foreground"> by TradingView</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExchange;
