/*
 * Casa Wong content settings.
 * Add verified details and locally hosted official photos here before publishing.
 * Photo paths can look like '/images/locale.webp'. Never add stock imagery.
 */
export const siteContent = {
  instagramUrl: 'https://www.instagram.com/casa.wong/',
  address: 'Via Maria Gaetana Agnesi 20/D, Bologna',
  hours: 'Mar–Sab 18:00–21:30 · Dom chiuso',
  contact: null,
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Maria+Gaetana+Agnesi+20%2FD%2C+Bologna',
  mapEmbedUrl: 'https://www.google.com/maps?q=Via+Maria+Gaetana+Agnesi+20%2FD%2C+Bologna&output=embed',
  bookingUrl: null,
  orderUrl: null,
  fullMenuUrl: null,
  photos: {
    hero: '/images/instagram/empanadas.jpg',
    story: '/images/instagram/rosi-casa-wong.jpg',
    dish: '/images/instagram/ceviche.jpg',
    gallery1: '/images/instagram/locale-esterno.jpg',
    gallery2: '/images/instagram/murale.jpg',
    gallery3: '/images/instagram/piatto-e-yuca.jpg',
    reservation: '/images/instagram/wong-ton.jpg',
  },
  menuCategories: [
    { name: 'Empanadas', dishName: 'Empanadas', description: 'Ripieni di formaggio, pollo e verdure speziate o manzo e chimichurri.', price: 'da € 2,50', image: '/images/instagram/empanadas.jpg' },
    { name: 'Ceviche', dishName: 'Ceviche de camarones', description: 'Gamberi marinati al limone con chips di platano.', price: '€ 12,00', image: '/images/instagram/ceviche.jpg' },
    { name: 'Wong-Ton', dishName: 'Wong-Ton', description: 'Ravioli croccanti di gamberi con salsa Wong all’ananas.', price: '€ 7,50', image: '/images/instagram/wong-ton.jpg' },
  ],
};
