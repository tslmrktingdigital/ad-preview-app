import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trucks = [
  {
    name: 'Old Town Smoke',
    slug: 'old-town-smoke',
    description: 'Low-and-slow BBQ — brisket, pulled pork, and smoked wings out of Wilmington.',
    cuisineTypes: ['bbq', 'american'],
    facebookUrl: 'https://www.facebook.com/oldtownsmokewilmington',
    instagramUrl: 'https://www.instagram.com/oldtownsmokewilmington',
  },
  {
    name: 'Dos Amigos Tacos',
    slug: 'dos-amigos-tacos',
    description: 'Authentic street tacos, burritos, and elotes in Wilmington, NC.',
    cuisineTypes: ['mexican'],
    facebookUrl: 'https://www.facebook.com/dosamigostacoswnc',
    instagramUrl: 'https://www.instagram.com/dosamigostacoswnc',
  },
  {
    name: 'Surf City Sliders',
    slug: 'surf-city-sliders',
    description: 'Smashed burgers and loaded fries, coastal style.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/surfcitysliderswnc',
    instagramUrl: 'https://www.instagram.com/surfcitysliderswnc',
  },
  {
    name: 'Cape Fear Crepes',
    slug: 'cape-fear-crepes',
    description: 'Sweet and savory crepes made fresh at events and markets.',
    cuisineTypes: ['desserts', 'american'],
    facebookUrl: 'https://www.facebook.com/capefearcrepes',
    instagramUrl: 'https://www.instagram.com/capefearcrepes',
  },
  {
    name: 'Port City Poke',
    slug: 'port-city-poke',
    description: 'Build-your-own poke bowls with fresh Atlantic seafood.',
    cuisineTypes: ['seafood', 'asian'],
    facebookUrl: 'https://www.facebook.com/portcitypoke',
    instagramUrl: 'https://www.instagram.com/portcitypoke',
  },
  {
    name: 'The Rolling Pin',
    slug: 'the-rolling-pin',
    description: 'Scratch-made empanadas and pan dulce from a Wilmington family kitchen.',
    cuisineTypes: ['mexican', 'desserts'],
    facebookUrl: 'https://www.facebook.com/therollingpinnc',
    instagramUrl: 'https://www.instagram.com/therollingpinnc',
  },
  {
    name: 'Wilmington Wing Co.',
    slug: 'wilmington-wing-co',
    description: 'Wings, tenders, and sauces made in-house. 20+ flavors.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/wilmingtonwingco',
    instagramUrl: 'https://www.instagram.com/wilmingtonwingco',
    twitterUrl: 'https://twitter.com/wilmwingco',
  },
  {
    name: 'Island Vibe Kitchen',
    slug: 'island-vibe-kitchen',
    description: 'Jamaican jerk, rice and peas, plantains, and curry from the islands.',
    cuisineTypes: ['caribbean'],
    facebookUrl: 'https://www.facebook.com/islandvibekitchenwnc',
    instagramUrl: 'https://www.instagram.com/islandvibekitchenwnc',
  },
  {
    name: 'The Gyro Guys',
    slug: 'the-gyro-guys',
    description: 'Traditional gyros, falafel, hummus, and Mediterranean plates.',
    cuisineTypes: ['mediterranean'],
    facebookUrl: 'https://www.facebook.com/thegyroguysnc',
    instagramUrl: 'https://www.instagram.com/thegyroguysnc',
  },
  {
    name: 'Green Wheels',
    slug: 'green-wheels',
    description: '100% plant-based comfort food — burgers, bowls, and loaded nachos.',
    cuisineTypes: ['vegan', 'american'],
    facebookUrl: 'https://www.facebook.com/greenwheelsnc',
    instagramUrl: 'https://www.instagram.com/greenwheelsnc',
  },
  {
    name: 'Coastal Coffee Co.',
    slug: 'coastal-coffee-co',
    description: 'Specialty coffee, cold brew, and pastries at markets and events.',
    cuisineTypes: ['coffee', 'desserts'],
    facebookUrl: 'https://www.facebook.com/coastalcoffeencwilmington',
    instagramUrl: 'https://www.instagram.com/coastalcoffeencwilmington',
  },
  {
    name: 'Shrimpin\' Ain\'t Easy',
    slug: 'shrimpin-aint-easy',
    description: 'NC shrimp po\'boys, shrimp tacos, and fried seafood baskets.',
    cuisineTypes: ['seafood', 'american'],
    facebookUrl: 'https://www.facebook.com/shrimpinainteasywnc',
    instagramUrl: 'https://www.instagram.com/shrimpinainteasywnc',
  },
];

async function main() {
  console.log('Seeding food trucks...');

  for (const truck of trucks) {
    await prisma.foodTruck.upsert({
      where: { slug: truck.slug },
      update: truck,
      create: truck,
    });
    console.log(`  ✓ ${truck.name}`);
  }

  console.log(`\nSeeded ${trucks.length} trucks.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
