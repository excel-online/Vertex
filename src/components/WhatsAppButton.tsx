import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "15742384154";
    const message = encodeURIComponent("Hello! I would like to inquire about Vellumtrade investment plans.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      data-whatsapp-button="true"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-3 gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all hover:scale-105"
    >
      <MessageCircle className="w-6 h-6 shrink-0" />
      <span className="hidden md:inline font-bold text-sm">WhatsApp</span>
    </button>
  );
};

export default WhatsAppButton;
