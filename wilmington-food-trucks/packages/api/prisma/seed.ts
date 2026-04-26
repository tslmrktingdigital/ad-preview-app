import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trucks = [
  // ── Verified via Port City Daily Food Truck Tracker (Apr 24 – May 1, 2026) ──
  {
    name: '2 Bros Coastal Cuisine',
    slug: '2-bros-coastal-cuisine',
    description: 'Made-to-order sandwiches and wraps with a coastal flair.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/2broscoastalcuisine',
    instagramUrl: 'https://www.instagram.com/2broscoastalcuisine',
  },
  {
    name: 'Birrieria La Rosita',
    slug: 'birrieria-la-rosita',
    description: 'Rocky Point-based source for authentic slow-cooked birria tacos and consommé.',
    cuisineTypes: ['mexican'],
    facebookUrl: 'https://www.facebook.com/birrieralarosita',
    instagramUrl: 'https://www.instagram.com/birrieralarosita',
  },
  {
    name: 'Brighter Days Coffee',
    slug: 'brighter-days-coffee',
    description: '100% woman-powered mobile coffee truck serving good vibes and great coffee all around Wilmington.',
    cuisineTypes: ['coffee'],
    facebookUrl: 'https://www.facebook.com/brighterdayscoffee',
    instagramUrl: 'https://www.instagram.com/brighterdayscoffee',
  },
  {
    name: 'Cape Fear Smash',
    slug: 'cape-fear-smash',
    description: 'Built from the ground up in Cape Fear with family at the core and smash burgers on the grill.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/capefearsmashnc',
    instagramUrl: 'https://www.instagram.com/capefearsmashnc',
  },
  {
    name: 'Chef Driven',
    slug: 'chef-driven',
    description: 'Chef Steven Winters serves meals on-the-go using local, homemade, and high-quality ingredients.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/ChefDrivenFoodTruck',
    instagramUrl: 'https://www.instagram.com/chefdrivenfoodtruck',
  },
  {
    name: 'Donut Bus',
    slug: 'donut-bus',
    description: 'Hot, fresh mini donuts made to order with 15+ glazes, sugars, and fruit toppings.',
    cuisineTypes: ['desserts'],
    facebookUrl: 'https://www.facebook.com/donutbuswilmington',
    instagramUrl: 'https://www.instagram.com/donutbuswilmington',
  },
  {
    name: 'Eastside',
    slug: 'eastside',
    description: 'Subs made from scratch using organic, all-natural products.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/eastsidesubswilmington',
    instagramUrl: 'https://www.instagram.com/eastsidesubswilmington',
  },
  {
    name: 'Fusion Fries',
    slug: 'fusion-fries',
    description: 'Fresh-cut potatoes and loaded fry creations served to the Wilmington area.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/fusionfries',
    instagramUrl: 'https://www.instagram.com/fusionfries',
  },
  {
    name: 'Kimchi Taco',
    slug: 'kimchi-taco',
    description: 'Where east meets south — Korean bulgogi tacos, The Koreadilla, and Korean corn dogs.',
    cuisineTypes: ['asian', 'mexican'],
    facebookUrl: 'https://www.facebook.com/kimchitaco',
    instagramUrl: 'https://www.instagram.com/kimchitaconc',
  },
  {
    name: 'Made in Venezuela',
    slug: 'made-in-venezuela',
    description: 'Arepas, empanadas, and other Venezuelan specialties made with love.',
    cuisineTypes: ['other'],
    facebookUrl: 'https://www.facebook.com/madeinvenezuelawilmington',
    instagramUrl: 'https://www.instagram.com/madeinvenezuelawilmington',
  },
  {
    name: "Pepe's Taco Truck",
    slug: 'pepes-taco-truck',
    description: 'Authentic tacos, tortas, quesadillas, and burritos for New Hanover and Pender counties.',
    cuisineTypes: ['mexican'],
    facebookUrl: 'https://www.facebook.com/pepestacotruck',
    instagramUrl: 'https://www.instagram.com/pepestacotruck',
  },
  {
    name: "Poor Piggy's BBQ",
    slug: 'poor-piggys-bbq',
    description: 'Traditional NC-style BBQ and Southern food — three trucks in the Wilmington area. The Goin\' Ham truck serves burgers.',
    cuisineTypes: ['bbq', 'american'],
    facebookUrl: 'https://www.facebook.com/poorpiggysbbq',
    instagramUrl: 'https://www.instagram.com/poorpiggysbbq',
  },
  {
    name: 'Port City Plates',
    slug: 'port-city-plates',
    description: 'Rochester, NY-style trash plates brought to the Wilmington area.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/portcityplates',
    instagramUrl: 'https://www.instagram.com/portcityplates',
  },
  {
    name: 'Port City Que',
    slug: 'port-city-que',
    description: 'Brisket, ribs, pulled pork, and serious BBQ classics. Based in Rocky Point, spotted all over Wilmington.',
    cuisineTypes: ['bbq'],
    facebookUrl: 'https://www.facebook.com/portcityque',
    instagramUrl: 'https://www.instagram.com/portcityque',
  },
  {
    name: 'Restored Coffee',
    slug: 'restored-coffee',
    description: 'A 1957 vintage camper serving specialty coffee to Surf City and surrounding areas.',
    cuisineTypes: ['coffee'],
    facebookUrl: 'https://www.facebook.com/restoredcoffee',
    instagramUrl: 'https://www.instagram.com/restoredcoffee',
  },
  {
    name: 'Smoothie Star',
    slug: 'smoothie-star',
    description: 'Sister truck to Well-Fed Ed. Smoothies and wellness shots made from real, whole foods.',
    cuisineTypes: ['vegan', 'other'],
    facebookUrl: 'https://www.facebook.com/smoothiestar',
    instagramUrl: 'https://www.instagram.com/smoothiestar',
  },
  {
    name: 'Well-Fed Ed',
    slug: 'well-fed-ed',
    description: 'Simple, vibrant, and delicious dishes for the Wilmington area.',
    cuisineTypes: ['american', 'vegan'],
    facebookUrl: 'https://www.facebook.com/wellfededwilmington',
    instagramUrl: 'https://www.instagram.com/wellfedednc',
  },
  {
    name: 'Wheelz Gourmet Pizza',
    slug: 'wheelz-gourmet-pizza',
    description: 'Your neighborhood food truck — gourmet Neapolitan-Brooklyn-style sourdough pizza.',
    cuisineTypes: ['italian'],
    facebookUrl: 'https://www.facebook.com/wheelzpizza',
    instagramUrl: 'https://www.instagram.com/wheelzpizza',
    websiteUrl: 'https://midtownwilmington.wheelzpizza.com/wilmington-wheelz-pizza-midtown-wilmington-food-truck',
  },
  {
    name: 'WilmyWoodie',
    slug: 'wilmywoodie',
    description: "Wilmington's first and only wood-fired pizza truck — unique creations and classics from a Forno Piombo brick oven.",
    cuisineTypes: ['italian'],
    facebookUrl: 'https://www.facebook.com/wilmywoodie',
    instagramUrl: 'https://www.instagram.com/wilmywoodie',
  },
  // ── Additional trucks from Roaming Hunger / local sources ──
  {
    name: 'Block Taco',
    slug: 'block-taco',
    description: 'Street tacos and Mexican bites with a Wilmington flair.',
    cuisineTypes: ['mexican'],
    facebookUrl: 'https://www.facebook.com/blocktacoilm',
    instagramUrl: 'https://www.instagram.com/blocktacoilm',
  },
  {
    name: 'The First Bite Food Truck',
    slug: 'the-first-bite',
    description: 'Breakfast all day — burritos, chicken & waffles, and breakfast nachos.',
    cuisineTypes: ['american'],
    instagramUrl: 'https://www.instagram.com/thefirstbitefoodtruck',
    facebookUrl: 'https://www.facebook.com/thefirstbitefoodtruck',
  },
  {
    name: "A & M's Red Food Truck",
    slug: 'a-and-ms-red-food-truck',
    description: 'Classic comfort food from a Wilmington staple. Look for the red truck.',
    cuisineTypes: ['american'],
    facebookUrl: 'https://www.facebook.com/aandmsrft',
  },
  {
    name: 'Lobster Dogs Food Truck',
    slug: 'lobster-dogs',
    description: 'Fresh lobster rolls, crab rolls, shrimp rolls, stuffed avocados, and seared tuna.',
    cuisineTypes: ['seafood', 'american'],
    facebookUrl: 'https://www.facebook.com/lobsterdogsfoodtruckwilmington',
  },
  {
    name: "Webo's Food Truck & Catering",
    slug: 'webos-food-truck',
    description: 'Soul food and BBQ by professionally trained Chef Hardie Ballard.',
    cuisineTypes: ['american', 'bbq'],
    facebookUrl: 'https://www.facebook.com/webocatering',
  },
  {
    name: 'YehMon51',
    slug: 'yehmon51',
    description: 'Caribbean-inspired flavors — jerk chicken, plantains, and island sides.',
    cuisineTypes: ['caribbean'],
    facebookUrl: 'https://www.facebook.com/yehmon51',
    instagramUrl: 'https://www.instagram.com/yehmon51',
  },
  {
    name: "Get'n Rolled",
    slug: 'getn-rolled',
    description: 'Thai-style rolled ice cream and creative frozen desserts made fresh to order.',
    cuisineTypes: ['desserts', 'asian'],
    facebookUrl: 'https://www.facebook.com/getnrolled',
    instagramUrl: 'https://www.instagram.com/getnrolled',
  },
  {
    name: 'Taqueria La Villita',
    slug: 'taqueria-la-villita',
    description: 'Authentic, affordable Mexican — tacos, burritos, tortas, and nachos made from scratch.',
    cuisineTypes: ['mexican'],
    facebookUrl: 'https://www.facebook.com/taquerialavilitawilmington',
    instagramUrl: 'https://www.instagram.com/taquerialavilitawilmington',
  },
  {
    name: 'Kimchi Taco',
    slug: 'kimchi-taco',
    description: 'Where east meets south — Korean bulgogi tacos, The Koreadilla, and Korean corn dogs.',
    cuisineTypes: ['asian', 'mexican'],
    facebookUrl: 'https://www.facebook.com/kimchitaco',
    instagramUrl: 'https://www.instagram.com/kimchitaconc',
  },
  // ── Additional trucks from Yelp (batch 2) ──
  {
    name: 'Banh Sai',
    slug: 'banh-sai',
    description: 'Asian fusion food truck with a unique rotating menu drawing crowds across Wilmington.',
    cuisineTypes: ['asian'],
    instagramUrl: 'https://www.instagram.com/banhsaifoodtruck',
  },
  {
    name: 'Langos',
    slug: 'langos',
    description: 'Hungarian langos — deep-fried flatbread topped with sour cream, cheese, and sweet or savory options.',
    cuisineTypes: ['other'],
  },
  {
    name: 'Holy Smokes',
    slug: 'holy-smokes',
    description: 'Delicious tacos and street food at reasonable prices — a hit at events across Wilmington.',
    cuisineTypes: ['mexican'],
  },
  {
    name: 'Soulful Twist',
    slug: 'soulful-twist',
    description: 'Seafood-focused comfort food featuring shrimp burgers and Southern-style bites.',
    cuisineTypes: ['seafood', 'american'],
  },
  {
    name: 'Halal Express',
    slug: 'halal-express',
    description: 'Late-night halal food truck serving the Wilmington area until the early morning hours.',
    cuisineTypes: ['other'],
  },
  {
    name: 'Simply Barbecue',
    slug: 'simply-barbecue',
    description: 'North Carolina-style pulled pork, ribs, and crunchy coleslaw from Lockwood Folly.',
    cuisineTypes: ['bbq'],
  },
  {
    name: "Franchy's",
    slug: 'franchys',
    description: 'Bakery-quality baked goods from a food truck — worth tracking down when spotted around town.',
    cuisineTypes: ['other'],
  },
  // ── Additional trucks from Yelp (batch 3) ──
  {
    name: 'Kitchen Ahimsa',
    slug: 'kitchen-ahimsa',
    description: 'Plant-based and vegan snacks — kale chips and more at Wilmington\'s Riverfront Farmers\' Market.',
    cuisineTypes: ['vegan'],
  },
  {
    name: 'Port City Pops Ice Cream Truck',
    slug: 'port-city-pops',
    description: 'Ice cream and frozen treats on wheels all around Wilmington.',
    cuisineTypes: ['desserts'],
  },
  {
    name: 'Astro Dogs',
    slug: 'astro-dogs',
    description: 'Creative hot dogs with Korean-inspired toppings — a surprisingly addictive Wilmington find.',
    cuisineTypes: ['asian', 'american'],
  },
  {
    name: "Pepe's Tacos",
    slug: 'pepes-tacos',
    description: 'Mexican street tacos and classics served around Wilmington.',
    cuisineTypes: ['mexican'],
  },
  {
    name: 'Tackle Box Kitchen',
    slug: 'tackle-box-kitchen',
    description: 'Seafood tacos and coastal bites from a Wilmington food truck.',
    cuisineTypes: ['seafood', 'mexican'],
  },
  {
    name: 'Kono Pizza',
    slug: 'kono-pizza',
    description: 'Franchise food truck serving pizza in a cone — spotted at Broomtail Brewery and events.',
    cuisineTypes: ['italian'],
  },
  {
    name: 'CBT Burger',
    slug: 'cbt-burger',
    description: 'Unique and original burgers with bold flavor combinations.',
    cuisineTypes: ['american'],
  },
  {
    name: 'Rude Bwoys Jerk Grill Food Truck',
    slug: 'rude-bwoys-jerk-grill',
    description: 'Caribbean jerk BBQ truck — a favorite at the Alcove Beer Garden in The Cargo District.',
    cuisineTypes: ['caribbean', 'bbq'],
  },
  {
    name: 'Los Compas Taco Zone',
    slug: 'los-compas-taco-zone',
    description: 'Authentic Mexican tacos with a 5-star reputation in Wilmington.',
    cuisineTypes: ['mexican'],
  },
];

// De-duplicate by slug (last one wins for dupes in the array)
const deduped = [...new Map(trucks.map((t) => [t.slug, t])).values()];

async function main() {
  console.log('Seeding food trucks...');
  for (const truck of deduped) {
    await prisma.foodTruck.upsert({
      where: { slug: truck.slug },
      update: truck,
      create: truck,
    });
    console.log(`  ✓ ${truck.name}`);
  }
  console.log(`\nSeeded ${deduped.length} trucks.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
