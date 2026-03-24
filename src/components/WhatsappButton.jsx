import { MessageCircle } from "lucide-react";

function WhatsAppButton({ phone }) {
    const message = encodeURIComponent("Bonjour, je suis intéressé par votre trajet.");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        <MessageCircle className="inline mr-2" />
        Contacter sur WhatsApp
      </button>
    </a>
  );
}

export default WhatsAppButton;
