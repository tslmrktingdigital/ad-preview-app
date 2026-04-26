import type { ScheduleEntry } from '@wft/shared';

type ParsedEntry = Omit<ScheduleEntry, 'id' | 'truckId' | 'scrapedAt'>;

// Known Wilmington-area locations food trucks frequent (sourced from Port City Daily tracker)
const KNOWN_LOCATIONS: Array<{ pattern: RegExp; name: string; address: string }> = [
  // Parks & outdoors
  { pattern: /greenfield\s*lake/i,           name: 'Greenfield Lake Park',             address: '4100 S 16th St, Wilmington, NC 28401' },
  { pattern: /ogden\s*park/i,                name: 'Ogden Park',                       address: '615 Ogden Park Dr., Wilmington, NC 28411' },
  { pattern: /ocean\s*front\s*park/i,        name: 'Ocean Front Park & Pavilion',      address: '105 Atlantic Ave., Kure Beach, NC 28449' },
  { pattern: /veterans\s*park/i,             name: 'Veterans Park',                    address: '835 Halyburton Memorial Pkwy, Wilmington, NC 28412' },
  // Breweries & taprooms
  { pattern: /flytrap\s*brew/i,              name: 'Flytrap Brewing',                  address: '319 Walnut St., Wilmington, NC 28401' },
  { pattern: /mad\s*mole/i,                  name: 'Mad Mole Brewing',                 address: '6309 Boathouse Rd., Wilmington, NC 28405' },
  { pattern: /flying\s*machine/i,            name: 'Flying Machine Brewing Company',   address: '3130 Randall Pkwy., Wilmington, NC 28403' },
  { pattern: /wilmington\s*brew/i,           name: 'Wilmington Brewing Company',       address: '824 S. Kerr Ave., Wilmington, NC 28403' },
  { pattern: /waterline\s*brew/i,            name: 'Waterline Brewing Company',        address: '721 Surry St., Wilmington, NC 28401' },
  { pattern: /wrightsville\s*beach\s*brew/i, name: 'Wrightsville Beach Brewery',       address: '6201 Oleander Dr., Wilmington, NC 28403' },
  { pattern: /leland\s*brew/i,               name: 'Leland Brewing Co.',               address: '133 Fayetteville Rd., Leland, NC 28451' },
  { pattern: /salty\s*turtle/i,              name: 'Salty Turtle Beer Company',        address: '103 Triton Ln., Surf City, NC 28445' },
  { pattern: /sandpiper\s*brew/i,            name: 'Sandpiper Brewing Company',        address: '624 E. Ocean Rd., Holly Ridge, NC 28445' },
  { pattern: /scapegoat/i,                   name: 'The Scapegoat Taproom',            address: '2789 Compass Pointe South Wynd NE, Leland, NC 28451' },
  { pattern: /lbc\s*bottle/i,               name: 'LBC Bottle Shop',                   address: '4628 Oleander Dr., Wilmington, NC 28403' },
  { pattern: /edward\s*teach/i,              name: 'Edward Teach Brewing',             address: '604 N. 4th St., Wilmington, NC 28401' },
  // Food truck parks & markets
  { pattern: /chow\s*town/i,                 name: 'Chow Town Food Truck Park',        address: '1101 N. 4th St., Wilmington, NC 28401' },
  { pattern: /riverlights/i,                 name: 'Riverlights',                      address: '810 Cupola Dr., Wilmington, NC 28412' },
  { pattern: /cargo\s*district/i,            name: 'The Cargo District',               address: '110 Cargo District, Wilmington, NC 28403' },
  // Schools & institutions
  { pattern: /cfcc\s*north|cape\s*fear\s*community\s*college\s*north/i, name: 'Cape Fear Community College North Campus', address: '4500 Blue Clay Rd., Castle Hayne, NC 28429' },
  { pattern: /cfcc|cape\s*fear\s*community\s*college(?!\s*north)/i,     name: 'Cape Fear Community College Wilmington',  address: '411 N. Front St., Wilmington, NC 28401' },
  { pattern: /\buncw\b|unc\s*wilmington/i,   name: 'UNC Wilmington',                   address: '601 S. College Rd., Wilmington, NC 28403' },
  // Shopping & retail
  { pattern: /mayfaire/i,                    name: 'Mayfaire Town Center',             address: '900 Inspiration Dr., Wilmington, NC 28405' },
  { pattern: /independence\s*mall/i,         name: 'Independence Mall',                address: '3500 Oleander Dr., Wilmington, NC 28403' },
  // Other frequent spots
  { pattern: /eagle\s*island/i,              name: 'Eagle Island Fruit & Seafood',     address: '2500 US-421, Wilmington, NC 28401' },
  { pattern: /hudson.?s\s*hardware/i,        name: "Hudson's Hardware",                address: '6301 Castle Hayne Rd., Castle Hayne, NC 28429' },
  { pattern: /wrightsville\s*beach/i,        name: 'Wrightsville Beach',               address: 'Wrightsville Beach, NC 28480' },
  { pattern: /greenfield\s*lake/i,           name: 'Greenfield Lake Park',             address: '4100 S 16th St., Wilmington, NC 28401' },
  { pattern: /brooklyn\s*arts/i,             name: 'Brooklyn Arts Center',             address: '516 N. 4th St., Wilmington, NC 28401' },
  { pattern: /soda\s*pop/i,                  name: 'Soda Pops',                        address: '2029 S 17th St., Wilmington, NC 28401' },
  { pattern: /wave\s*transit/i,              name: 'Wave Transit Station',             address: '505 Cando St., Wilmington, NC 28405' },
];

// Day-of-week patterns
const DAY_PATTERNS: Array<{ pattern: RegExp; dayOffset: number }> = [
  { pattern: /\btoday\b/i, dayOffset: 0 },
  { pattern: /\btomorrow\b/i, dayOffset: 1 },
  { pattern: /\bmonday\b/i, dayOffset: -1 },   // resolved at match time
  { pattern: /\btuesday\b/i, dayOffset: -1 },
  { pattern: /\bwednesday\b/i, dayOffset: -1 },
  { pattern: /\bthursday\b/i, dayOffset: -1 },
  { pattern: /\bfriday\b/i, dayOffset: -1 },
  { pattern: /\bsaturday\b/i, dayOffset: -1 },
  { pattern: /\bsunday\b/i, dayOffset: -1 },
];

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function nextOccurrenceOfDay(dayName: string): Date {
  const today = new Date();
  const targetDay = DAY_NAMES.indexOf(dayName.toLowerCase());
  if (targetDay === -1) return today;
  const current = today.getDay();
  const diff = (targetDay - current + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + (diff === 0 ? 0 : diff));
  return result;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]!;
}

const TIME_REGEX = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi;

function parseTimeRange(text: string): { startTime: string; endTime: string } | null {
  const matches = [...text.matchAll(TIME_REGEX)];
  if (matches.length < 1) return null;

  function toHHMM(m: RegExpMatchArray): string {
    let h = parseInt(m[1]!, 10);
    const min = m[2] ?? '00';
    const period = m[3]!.toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${min}`;
  }

  const startTime = toHHMM(matches[0]!);
  const endTime = matches[1] ? toHHMM(matches[1]) : `${String(parseInt(startTime.split(':')[0]!) + 3).padStart(2, '0')}:00`;
  return { startTime, endTime };
}

export function parseScheduleText(text: string, sourceUrl: string): ParsedEntry[] {
  const results: ParsedEntry[] = [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Check if this line mentions a known Wilmington location
    const location = KNOWN_LOCATIONS.find((loc) => loc.pattern.test(line));
    if (!location) continue;

    // Try to extract a date from the line or surrounding context
    let date = formatDate(new Date()); // default to today
    const todayMatch = /\btoday\b/i.test(line);
    const tomorrowMatch = /\btomorrow\b/i.test(line);
    const dayMatch = DAY_NAMES.find((d) => new RegExp(`\\b${d}\\b`, 'i').test(line));

    if (tomorrowMatch) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      date = formatDate(d);
    } else if (dayMatch && !todayMatch) {
      date = formatDate(nextOccurrenceOfDay(dayMatch));
    }

    // Try ISO date in the line
    const isoMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) date = isoMatch[1]!;

    // Try MM/DD/YYYY or MM/DD
    const shortDateMatch = line.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
    if (shortDateMatch) {
      const year = shortDateMatch[3] ?? new Date().getFullYear().toString();
      const d = new Date(`${year}-${shortDateMatch[1]!.padStart(2, '0')}-${shortDateMatch[2]!.padStart(2, '0')}`);
      if (!isNaN(d.getTime())) date = formatDate(d);
    }

    const timeRange = parseTimeRange(line);

    results.push({
      date,
      startTime: timeRange?.startTime ?? '11:00',
      endTime: timeRange?.endTime ?? '14:00',
      locationName: location.name,
      address: location.address,
      notes: line.length < 200 ? line : undefined,
      sourceUrl,
    });
  }

  return results;
}
