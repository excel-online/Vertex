import { useState, useEffect } from 'react';
import { marketService, type CryptoCoin } from '@/services/api';

const CryptoAssetsList = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);

  // Format numbers like your video (Brazilian style: 1,32 T, 234,47 B)
  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2).replace('.', ',')} T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2).replace('.', ',')} B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2).replace('.', ',')} M`;
    }
    return `${(value / 1e3).toFixed(2).replace('.', ',')} K`;
  };

  // Format price with Brazilian style
  const formatPrice = (price: number): string => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).replace('R$', '');
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await marketService.getCryptoPrices(225);
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    // Auto-refresh every 60 seconds - STILL WORKS!
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && coins.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 h-[500px] flex items-center justify-center">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden w-full max-w-5xl mx-auto">
      {/* Header - Simple like video */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
    
            
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-gray-600">
          <div className="col-span-3">NOME <span className="text-xs text-gray-500">{coins.length} RESULTADOS</span></div>
          <div className="col-span-2 text-right">VLR DE MERC</div>
          <div className="col-span-2 text-right">VLR MRC TD</div>
          <div className="col-span-2 text-right">PREÇO</div>
          <div className="col-span-2 text-right">MOEDAS DISP.</div>
          <div className="col-span-1 text-right">VAR %</div>
        </div>
      </div>

      {/* Scrollable Table Body */}
      <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {coins.map((coin) => (
          <div 
            key={coin.id} 
            className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-gray-200 hover:bg-navy-50 transition-colors items-center text-xs"
          >
            {/* NOME */}
            <div className="col-span-3 flex items-center gap-2">
              <img 
                src={coin.image} 
                alt={coin.name}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/24?text=${coin.symbol.charAt(0).toUpperCase()}`;
                }}
              />
              <span className="font-medium text-blue-600 truncate">
                {coin.name}
              </span>
            </div>
            
            {/* VLR DE MERC */}
            <div className="col-span-2 text-right text-gray-700 truncate">
              {formatMarketCap(coin.market_cap)}
            </div>
            
            {/* VLR MRC TD */}
            <div className="col-span-2 text-right text-gray-700 truncate">
              {formatMarketCap(coin.fully_diluted_valuation || coin.market_cap)}
            </div>
            
            {/* PREÇO */}
            <div className="col-span-2 text-right text-gray-700 truncate">
              {formatPrice(coin.current_price)}
            </div>
            
            {/* MOEDAS DISP. */}
            <div className="col-span-2 text-right text-gray-700 truncate">
              {formatMarketCap(coin.circulating_supply)}
            </div>
            
            {/* VAR % */}
            <div className={`col-span-1 text-right font-medium ${
              coin.price_change_percentage_24h >= 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {coin.price_change_percentage_24h >= 0 ? '+' : ''}
              {coin.price_change_percentage_24h?.toFixed(2).replace('.', ',')}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoAssetsList;