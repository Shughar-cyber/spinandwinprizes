import { gameConfig } from '../config/gameConfig';

export function buildWhatsAppMessage({ prize, form }) {
  return [
    'Hello, I just won a prize from the Spin & Win promotion and I would like to claim it.',
    '',
    `Prize: ${prize.name}`,
    '',
    `Full Name: ${form.fullName}`,
    `Age: ${form.age}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email}`,
    `Country: ${form.country}`,
    `State/Province/Region: ${form.region}`,
    `City: ${form.city}`,
    '',
    'Please assist me with claiming my prize.',
  ].join('\n');
}

export function buildWhatsAppUrl(payload) {
  const message = encodeURIComponent(buildWhatsAppMessage(payload));
  return `https://wa.me/${gameConfig.whatsappNumber}?text=${message}`;
}
