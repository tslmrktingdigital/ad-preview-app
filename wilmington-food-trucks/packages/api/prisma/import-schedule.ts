/**
 * One-time import of Port City Daily Food Truck Tracker — Apr 24–May 1, 2026
 * Run: npx tsx prisma/import-schedule.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Full location address map from Port City Daily
const LOCATIONS: Record<string, { name: string; address: string }> = {
  'leland-brewing':       { name: 'Leland Brewing Co.',                   address: '133 Fayetteville Rd., Leland, NC 28451' },
  'eagle-island':         { name: 'Eagle Island Fruit & Seafood',          address: '2500 US-421, Wilmington, NC 28401' },
  'mad-mole':             { name: 'Mad Mole Brewing',                       address: '6309 Boathouse Rd., Wilmington, NC 28405' },
  'riverlights':          { name: 'Riverlights',                            address: '810 Cupola Dr., Wilmington, NC 28412' },
  'scapegoat':            { name: 'The Scapegoat Taproom',                  address: '2789 Compass Pointe South Wynd NE, Leland, NC 28451' },
  'sandpiper':            { name: 'Sandpiper Brewing Company',              address: '624 E. Ocean Rd., Holly Ridge, NC 28445' },
  'salty-turtle':         { name: 'Salty Turtle Beer Company',              address: '103 Triton Ln., Surf City, NC 28445' },
  'cfcc-north':           { name: 'Cape Fear Community College North Campus', address: '4500 Blue Clay Rd., Castle Hayne, NC 28429' },
  'cfcc-wilmington':      { name: 'Cape Fear Community College Wilmington',  address: '411 N. Front St., Wilmington, NC 28401' },
  'flying-machine':       { name: 'Flying Machine Brewing Company',          address: '3130 Randall Pkwy., Wilmington, NC 28403' },
  'flytrap':              { name: 'Flytrap Brewing',                         address: '319 Walnut St., Wilmington, NC 28401' },
  'wilmington-brewing':   { name: 'Wilmington Brewing Company',              address: '824 S. Kerr Ave., Wilmington, NC 28403' },
  'lbc-bottle':           { name: 'LBC Bottle Shop',                         address: '4628 Oleander Dr., Wilmington, NC 28403' },
  'hudsons-hardware':     { name: "Hudson's Hardware",                        address: '6301 Castle Hayne Rd., Castle Hayne, NC 28429' },
  'chow-town':            { name: 'Chow Town Food Truck Park',               address: '1101 N. 4th St., Wilmington, NC 28401' },
  'uncw':                 { name: 'UNC Wilmington',                          address: '601 S. College Rd., Wilmington, NC 28403' },
  'ocean-front-kure':     { name: 'Ocean Front Park & Pavilion',             address: '105 Atlantic Ave., Kure Beach, NC 28449' },
  'coffee-haven':         { name: 'Coffee Haven',                            address: '113 Silversands Dr., Sneads Ferry, NC 28460' },
  'blair-elementary':     { name: 'Blair Elementary School',                 address: '6510 Market St., Wilmington, NC 28405' },
  'ogden-park':           { name: 'Ogden Park',                              address: '615 Ogden Park Dr., Wilmington, NC 28411' },
  'wyndwater':            { name: 'Wyndwater',                               address: '33 W. Craftsman Wy., Hampstead, NC 28443' },
};

type ScheduleRow = {
  truckSlug: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM 24h
  endTime: string;    // HH:MM 24h
  locationKey: string;
  notes?: string;
};

const schedule: ScheduleRow[] = [
  // 2 BROS COASTAL CUISINE
  { truckSlug: '2-bros-coastal-cuisine',   date: '2026-04-25', startTime: '17:00', endTime: '20:00', locationKey: 'leland-brewing' },
  { truckSlug: '2-bros-coastal-cuisine',   date: '2026-04-27', startTime: '11:00', endTime: '14:00', locationKey: 'eagle-island' },

  // BIRRIERIA LA ROSITA
  { truckSlug: 'birrieria-la-rosita',      date: '2026-04-25', startTime: '13:00', endTime: '16:00', locationKey: 'mad-mole' },

  // BRIGHTER DAYS COFFEE
  { truckSlug: 'brighter-days-coffee',     date: '2026-04-25', startTime: '11:00', endTime: '15:00', locationKey: 'riverlights' },

  // CAPE FEAR SMASH
  { truckSlug: 'cape-fear-smash',          date: '2026-04-24', startTime: '17:00', endTime: '20:00', locationKey: 'scapegoat' },
  { truckSlug: 'cape-fear-smash',          date: '2026-04-25', startTime: '13:00', endTime: '17:00', locationKey: 'leland-brewing' },

  // CHEF DRIVEN
  { truckSlug: 'chef-driven',              date: '2026-04-25', startTime: '11:00', endTime: '15:00', locationKey: 'riverlights' },

  // DONUT BUS
  { truckSlug: 'donut-bus',                date: '2026-04-24', startTime: '17:00', endTime: '19:00', locationKey: 'blair-elementary' },
  { truckSlug: 'donut-bus',                date: '2026-04-25', startTime: '11:00', endTime: '15:00', locationKey: 'ocean-front-kure' },
  { truckSlug: 'donut-bus',                date: '2026-04-26', startTime: '12:00', endTime: '17:00', locationKey: 'ogden-park' },

  // EASTSIDE
  { truckSlug: 'eastside',                 date: '2026-04-25', startTime: '11:00', endTime: '14:00', locationKey: 'riverlights' },
  { truckSlug: 'eastside',                 date: '2026-04-25', startTime: '17:00', endTime: '20:00', locationKey: 'mad-mole' },
  { truckSlug: 'eastside',                 date: '2026-04-29', startTime: '17:00', endTime: '20:00', locationKey: 'mad-mole' },
  { truckSlug: 'eastside',                 date: '2026-04-30', startTime: '17:00', endTime: '20:00', locationKey: 'flytrap' },

  // FUSION FRIES
  { truckSlug: 'fusion-fries',             date: '2026-04-25', startTime: '11:00', endTime: '15:00', locationKey: 'riverlights' },

  // KIMCHI TACO
  { truckSlug: 'kimchi-taco',              date: '2026-04-26', startTime: '15:00', endTime: '18:00', locationKey: 'flytrap' },
  { truckSlug: 'kimchi-taco',              date: '2026-04-28', startTime: '17:00', endTime: '20:00', locationKey: 'flying-machine' },
  { truckSlug: 'kimchi-taco',              date: '2026-04-29', startTime: '17:00', endTime: '20:00', locationKey: 'wilmington-brewing' },

  // MADE IN VENEZUELA
  { truckSlug: 'made-in-venezuela',        date: '2026-04-24', startTime: '17:00', endTime: '20:00', locationKey: 'sandpiper' },
  { truckSlug: 'made-in-venezuela',        date: '2026-04-25', startTime: '10:00', endTime: '15:00', locationKey: 'coffee-haven' },
  { truckSlug: 'made-in-venezuela',        date: '2026-04-25', startTime: '16:30', endTime: '19:30', locationKey: 'sandpiper' },
  { truckSlug: 'made-in-venezuela',        date: '2026-04-28', startTime: '17:00', endTime: '20:00', locationKey: 'salty-turtle' },
  { truckSlug: 'made-in-venezuela',        date: '2026-04-30', startTime: '11:00', endTime: '14:00', locationKey: 'uncw' },
  { truckSlug: 'made-in-venezuela',        date: '2026-04-30', startTime: '17:30', endTime: '19:30', locationKey: 'wyndwater' },

  // PEPE'S TACO TRUCK
  { truckSlug: 'pepes-taco-truck',         date: '2026-04-24', startTime: '18:00', endTime: '22:00', locationKey: 'flytrap' },
  { truckSlug: 'pepes-taco-truck',         date: '2026-04-28', startTime: '11:00', endTime: '13:30', locationKey: 'eagle-island' },
  { truckSlug: 'pepes-taco-truck',         date: '2026-05-01', startTime: '18:00', endTime: '22:00', locationKey: 'flytrap' },

  // POOR PIGGY'S BBQ
  { truckSlug: 'poor-piggys-bbq',          date: '2026-04-27', startTime: '11:00', endTime: '14:00', locationKey: 'cfcc-north' },
  { truckSlug: 'poor-piggys-bbq',          date: '2026-04-30', startTime: '11:00', endTime: '14:00', locationKey: 'cfcc-north' },

  // PORT CITY PLATES
  { truckSlug: 'port-city-plates',         date: '2026-04-29', startTime: '11:00', endTime: '13:30', locationKey: 'cfcc-wilmington' },

  // PORT CITY QUE
  { truckSlug: 'port-city-que',            date: '2026-04-24', startTime: '11:00', endTime: '14:00', locationKey: 'hudsons-hardware' },
  { truckSlug: 'port-city-que',            date: '2026-04-25', startTime: '11:00', endTime: '14:30', locationKey: 'hudsons-hardware' },

  // SMOOTHIE STAR
  { truckSlug: 'smoothie-star',            date: '2026-04-25', startTime: '11:00', endTime: '15:00', locationKey: 'ocean-front-kure' },
  { truckSlug: 'smoothie-star',            date: '2026-04-30', startTime: '11:00', endTime: '14:00', locationKey: 'uncw' },

  // WELL-FED ED
  { truckSlug: 'well-fed-ed',              date: '2026-04-25', startTime: '17:00', endTime: '20:00', locationKey: 'flytrap' },
  { truckSlug: 'well-fed-ed',              date: '2026-04-28', startTime: '11:00', endTime: '13:00', locationKey: 'cfcc-wilmington' },
  { truckSlug: 'well-fed-ed',              date: '2026-04-29', startTime: '11:00', endTime: '14:00', locationKey: 'uncw' },

  // WHEELZ GOURMET PIZZA
  { truckSlug: 'wheelz-gourmet-pizza',     date: '2026-04-27', startTime: '17:00', endTime: '20:00', locationKey: 'flytrap' },

  // WILMYWOODIE
  { truckSlug: 'wilmywoodie',              date: '2026-04-24', startTime: '16:00', endTime: '22:00', locationKey: 'lbc-bottle' },
  { truckSlug: 'wilmywoodie',              date: '2026-04-25', startTime: '12:00', endTime: '22:00', locationKey: 'lbc-bottle' },
  { truckSlug: 'wilmywoodie',              date: '2026-04-26', startTime: '12:00', endTime: '20:00', locationKey: 'lbc-bottle' },
  { truckSlug: 'wilmywoodie',              date: '2026-04-29', startTime: '16:00', endTime: '21:00', locationKey: 'lbc-bottle' },
  { truckSlug: 'wilmywoodie',              date: '2026-04-30', startTime: '16:00', endTime: '21:00', locationKey: 'lbc-bottle' },
  { truckSlug: 'wilmywoodie',              date: '2026-05-01', startTime: '16:00', endTime: '22:00', locationKey: 'lbc-bottle' },
];

async function main() {
  let added = 0;
  let skipped = 0;

  for (const row of schedule) {
    const truck = await prisma.foodTruck.findUnique({ where: { slug: row.truckSlug } });
    if (!truck) {
      console.warn(`  ⚠ Truck not found: ${row.truckSlug}`);
      skipped++;
      continue;
    }

    const loc = LOCATIONS[row.locationKey];
    if (!loc) {
      console.warn(`  ⚠ Location not found: ${row.locationKey}`);
      skipped++;
      continue;
    }

    const id = `${truck.id}-${row.date}-${row.locationKey}`;
    await prisma.scheduleEntry.upsert({
      where: { id },
      update: {
        startTime: row.startTime,
        endTime: row.endTime,
        locationName: loc.name,
        address: loc.address,
        notes: row.notes,
        sourceUrl: 'https://portcitydaily.com/food-truck-tracker/',
        scrapedAt: new Date(),
      },
      create: {
        id,
        truckId: truck.id,
        date: new Date(row.date),
        startTime: row.startTime,
        endTime: row.endTime,
        locationName: loc.name,
        address: loc.address,
        notes: row.notes,
        sourceUrl: 'https://portcitydaily.com/food-truck-tracker/',
        scrapedAt: new Date(),
      },
    });
    console.log(`  ✓ ${truck.name} → ${loc.name} on ${row.date}`);
    added++;
  }

  console.log(`\nDone: ${added} schedule entries added, ${skipped} skipped.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
