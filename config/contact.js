export const WHATSAPP_NUMBER = "237656156546";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const whatsappLink = (message) => {
  const text = encodeURIComponent(
    message ||
      "Bonjour David, je souhaite échanger avec vous sur un projet ou une collaboration."
  );
  return `${WHATSAPP_URL}?text=${text}`;
};

export const EMAIL = "metomo442@gmail.com";

export const PHONE_DISPLAY = "+237 656 156 546";
