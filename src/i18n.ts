import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: { features: "Features", pricing: "Pricing", testimonials: "Testimonials", login: "Login", getStarted: "Get Started" },
      hero: { title: "Trade Interactive Crypto!", subtitle: "Support Encrypted Trade with quick helpful response" }
    }
  },
  es: {
    translation: {
      nav: { features: "Características", pricing: "Precios", testimonials: "Testimonios", login: "Iniciar Sesión", getStarted: "Empezar" },
      hero: { title: "¡Comercio de Criptomonedas Interactivo!", subtitle: "Soporte para comercio cifrado con respuesta rápida y útil" }
    }
  },
  fr: {
    translation: {
      nav: { features: "Fonctionnalités", pricing: "Tarifs", testimonials: "Témoignages", login: "Connexion", getStarted: "Commencer" },
      hero: { title: "Tradez des cryptos en mode interactif !", subtitle: "Support de trading crypté avec assistance rapide" }
    }
  },
  ar: {
    translation: {
      nav: { features: "المميزات", pricing: "الأسعار", testimonials: "آراء العملاء", login: "تسجيل الدخول", getStarted: "ابدأ الان" },
      hero: { title: "تداول العملات الرقمية تفاعلياً!", subtitle: "دعم التداول المشفر مع استجابة سريعة ومفيدة" }
    }
  },
  pt: {
    translation: {
      nav: { features: "Recursos", pricing: "Preços", testimonials: "Depoimentos", login: "Entrar", getStarted: "Começar" },
      hero: { title: "Negocie Cripto Interativo!", subtitle: "Suporte a negociação criptografada com resposta rápida" }
    }
  },
  zh: {
    translation: {
      nav: { features: "功能", pricing: "价格", testimonials: "客户评价", login: "登录", getStarted: "开始使用" },
      hero: { title: "互动加密货币交易！", subtitle: "支持加密交易，提供快速实用的响应" }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app_lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
