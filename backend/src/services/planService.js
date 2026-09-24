import { Plan } from '../models/Plan.js';

/**
 * Service Layer: Laundry Plans & Services
 * Pure business logic decoupled from Express controllers.
 */

const DEFAULT_PLANS = [
  {
    name: 'Wash & Fold',
    slug: 'wash-fold',
    tagline: 'Everyday casuals, t-shirts, jeans & gym wear',
    price: 79,
    unit: 'per kg',
    turnaround: '24-48 Hours',
    popular: true,
    isActive: true,
    displayOrder: 1,
    features: [
      'Gentle machine wash with premium liquid detergent',
      'Antiseptic hygienic rinse',
      'Tumble dried at optimal temperature',
      'Neatly folded & vacuum packed',
    ],
  },
  {
    name: 'Wash & Steam Iron',
    slug: 'wash-iron',
    tagline: 'Office shirts, trousers, kurtas & dresses',
    price: 119,
    unit: 'per kg',
    turnaround: '24-48 Hours',
    popular: false,
    isActive: true,
    displayOrder: 2,
    features: [
      'Fabric-softened wash cycle',
      'High-pressure steam pressing',
      'Wrinkle-free hanger or fold pack',
      'Collar & cuff detailing',
    ],
  },
  {
    name: 'Premium Dry Cleaning',
    slug: 'dry-clean',
    tagline: 'Blazers, silk sarees, lehengas & suits',
    price: 199,
    unit: 'per piece',
    turnaround: '48-72 Hours',
    popular: false,
    isActive: true,
    displayOrder: 3,
    features: [
      'Eco-friendly solvent dry cleaning',
      'Individual spot & stain treatment',
      'Custom fabric care treatment',
      'Delivered in breathable dust covers',
    ],
  },
  {
    name: 'Duvets & Bedding Care',
    slug: 'heavy-bedding',
    tagline: 'Heavy blankets, quilts, curtains & linens',
    price: 349,
    unit: 'per piece',
    turnaround: '48 Hours',
    popular: false,
    isActive: true,
    displayOrder: 4,
    features: [
      'Deep dust-mite & allergen removal',
      'Heavy-duty drum wash & sanitize',
      'Fluffed drying with fresh scent',
      'Moisture-resistant bag packaging',
    ],
  },
  {
    name: 'Express 24h Turnaround',
    slug: 'express-24h',
    tagline: 'Urgent laundry returned crisp in under 24 hours',
    price: 149,
    unit: 'per kg',
    turnaround: 'Same / Next Day',
    popular: false,
    isActive: true,
    displayOrder: 5,
    features: [
      'Priority queue processing',
      'Dedicated express wash & iron batch',
      'Real-time SMS/WhatsApp updates',
      'Guaranteed doorstep return by next evening',
    ],
  },
  {
    name: 'Shoe & Sneaker Spa',
    slug: 'shoe-spa',
    tagline: 'Sneakers, sports shoes, canvas & suede care',
    price: 299,
    unit: 'per pair',
    turnaround: '48-72 Hours',
    popular: false,
    isActive: true,
    displayOrder: 6,
    features: [
      'Deep sole scrub & upper stain removal',
      'Lace washing & deodorization',
      'Antibacterial UV sanitization',
      'Color restoration touch-up',
    ],
  },
];

/**
 * Seed initial default plans if collection is empty
 */
export async function seedInitialPlansIfEmpty() {
  try {
    const count = await Plan.countDocuments();
    if (count === 0) {
      await Plan.insertMany(DEFAULT_PLANS);
      console.log('🧺 Initial laundry service plans seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial plans:', error.message);
  }
}

/**
 * Generate a unique URL slug from a name
 */
async function generateUniqueSlug(name, excludeId = null) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const found = await Plan.findOne(query).lean();
    if (!found) {
      exists = false;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}

/**
 * Get all active plans for public display
 */
export async function getActivePlans() {
  // Check if seeding is needed
  const count = await Plan.countDocuments();
  if (count === 0) {
    await seedInitialPlansIfEmpty();
  }

  return await Plan.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean({ virtuals: true });
}

/**
 * Get all plans (active & inactive) for admin management
 */
export async function getAllPlans() {
  return await Plan.find()
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean({ virtuals: true });
}

/**
 * Create a new plan
 */
export async function createPlan(data) {
  if (!data.name || data.name.trim().length < 2) {
    const err = new Error('Plan name must be at least 2 characters');
    err.status = 400;
    throw err;
  }

  const price = Number(data.price);
  if (isNaN(price) || price < 0) {
    const err = new Error('A valid non-negative price in INR is required');
    err.status = 400;
    throw err;
  }

  const slug = await generateUniqueSlug(data.name);

  // Normalize features
  let features = [];
  if (Array.isArray(data.features)) {
    features = data.features.filter((f) => typeof f === 'string' && f.trim().length > 0);
  } else if (typeof data.features === 'string') {
    features = data.features
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  }

  const newPlan = await Plan.create({
    name: data.name.trim(),
    slug,
    tagline: (data.tagline || '').trim(),
    price,
    unit: data.unit || 'per kg',
    turnaround: (data.turnaround || '24-48 Hours').trim(),
    features,
    popular: Boolean(data.popular),
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    displayOrder: Number(data.displayOrder) || 0,
  });

  return newPlan;
}

/**
 * Update an existing plan
 * IMPORTANT: Editing a plan updates future pricing and details.
 * Past bookings remain unaltered as they hold static snapshots.
 */
export async function updatePlan(id, data) {
  const plan = await Plan.findById(id);
  if (!plan) {
    const err = new Error('Plan not found');
    err.status = 404;
    throw err;
  }

  if (data.name && data.name.trim() !== plan.name) {
    plan.name = data.name.trim();
    plan.slug = await generateUniqueSlug(plan.name, id);
  }

  if (data.price !== undefined) {
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      const err = new Error('Price must be a non-negative number');
      err.status = 400;
      throw err;
    }
    plan.price = price;
  }

  if (data.tagline !== undefined) plan.tagline = data.tagline.trim();
  if (data.unit !== undefined) plan.unit = data.unit;
  if (data.turnaround !== undefined) plan.turnaround = data.turnaround.trim();
  if (data.popular !== undefined) plan.popular = Boolean(data.popular);
  if (data.isActive !== undefined) plan.isActive = Boolean(data.isActive);
  if (data.displayOrder !== undefined) plan.displayOrder = Number(data.displayOrder) || 0;

  if (data.features !== undefined) {
    if (Array.isArray(data.features)) {
      plan.features = data.features.filter((f) => typeof f === 'string' && f.trim().length > 0);
    } else if (typeof data.features === 'string') {
      plan.features = data.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
    }
  }

  await plan.save();
  return plan;
}

/**
 * Toggle plan active / inactive status
 */
export async function togglePlanStatus(id) {
  const plan = await Plan.findById(id);
  if (!plan) {
    const err = new Error('Plan not found');
    err.status = 404;
    throw err;
  }

  plan.isActive = !plan.isActive;
  await plan.save();
  return plan;
}

/**
 * Delete a plan
 * Does NOT impact existing orders because Order documents store snapshot values.
 */
export async function deletePlan(id) {
  const plan = await Plan.findByIdAndDelete(id);
  if (!plan) {
    const err = new Error('Plan not found');
    err.status = 404;
    throw err;
  }
  return { message: `Plan "${plan.name}" deleted successfully` };
}
