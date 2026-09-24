export const services = [
  {
    id: 'wash-fold',
    name: 'Wash & Fold',
    tagline: 'Everyday casuals, t-shirts, jeans & gym wear',
    price: 79,
    unit: 'per kg',
    priceDisplay: '₹79/kg',
    popular: true,
    turnaround: '24-48 Hours',
    features: [
      'Gentle machine wash with premium liquid detergent',
      'Antiseptic hygienic rinse',
      'Tumble dried at optimal temperature',
      'Neatly folded & vacuum packed'
    ]
  },
  {
    id: 'wash-iron',
    name: 'Wash & Steam Iron',
    tagline: 'Office shirts, trousers, kurtas & dresses',
    price: 119,
    unit: 'per kg',
    priceDisplay: '₹119/kg',
    popular: false,
    turnaround: '24-48 Hours',
    features: [
      'Fabric-softened wash cycle',
      'High-pressure steam pressing',
      'Wrinkle-free hanger or fold pack',
      'Collar & cuff detailing'
    ]
  },
  {
    id: 'dry-clean',
    name: 'Premium Dry Cleaning',
    tagline: 'Blazers, silk sarees, lehengas & suits',
    price: 199,
    unit: 'per piece',
    priceDisplay: '₹199/item',
    popular: false,
    turnaround: '48-72 Hours',
    features: [
      'Eco-friendly solvent dry cleaning',
      'Individual spot & stain treatment',
      'Custom fabric care treatment',
      'Delivered in breathable dust covers'
    ]
  },
  {
    id: 'heavy-bedding',
    name: 'Duvets & Bedding Care',
    tagline: 'Heavy blankets, quilts, curtains & linens',
    price: 349,
    unit: 'per piece',
    priceDisplay: '₹349/item',
    popular: false,
    turnaround: '48 Hours',
    features: [
      'Deep dust-mite & allergen removal',
      'Heavy-duty drum wash & sanitize',
      'Fluffed drying with fresh scent',
      'Moisture-resistant bag packaging'
    ]
  },
  {
    id: 'express-24h',
    name: 'Express 24h Turnaround',
    tagline: 'Urgent laundry returned crisp in under 24 hours',
    price: 149,
    unit: 'per kg',
    priceDisplay: '₹149/kg',
    popular: false,
    turnaround: 'Same / Next Day',
    features: [
      'Priority queue processing',
      'Dedicated express wash & iron batch',
      'Real-time SMS/WhatsApp updates',
      'Guaranteed doorstep return by next evening'
    ]
  },
  {
    id: 'shoe-spa',
    name: 'Shoe & Sneaker Spa',
    tagline: 'Sneakers, sports shoes, canvas & suede care',
    price: 299,
    unit: 'per pair',
    priceDisplay: '₹299/pair',
    popular: false,
    turnaround: '48-72 Hours',
    features: [
      'Deep sole scrub & upper stain removal',
      'Lace washing & deodorization',
      'Antibacterial UV sanitization',
      'Color restoration touch-up'
    ]
  }
];

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
