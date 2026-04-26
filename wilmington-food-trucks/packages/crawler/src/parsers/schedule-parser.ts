import type { ScheduleEntry } from '@wft/shared';

type ParsedEntry = Omit<ScheduleEntry, 'id' | 'truckId' | 'scrapedAt'>;

// Known Wilmington, NC locations food trucks frequent
const KNOWN_LOCATIONS: Array<{ pattern: RegExp; name: string; address: string }> = [
  { pattern: /greenfield\s*lake/i, name: 'Greenfield Lake Park', address: '4100 S 16th St, Wilmington, NC 28401' },
  { pattern: /wrightsville\s*beach/i, name: 'Wrightsville Beach', address: 'Wrightsville Beach, NC 28480' },
  { pattern: /cargo\s*district/i, name: 'The Cargo District', address: '110 Cargo District, Wilmington, NC 28403' },
  { pattern: /soda\s*pop(s)?/i, name: 'Soda Pops', address: '2029 S 17th St, Wilmington, NC 28401' },
  { pattern: /mayfaire/i, name: 'Mayfaire Town Center', address: '900 Inspiration Dr, Wilmington, NC 28405' },
  { pattern: /brooklyn\s*arts\s*center/i, name: 'Brooklyn Arts Center', address: '516 N 4th St, Wilmington, NC 28401' },
  { pattern: /riverfront/i, name: 'Wilmington Riverfront', address: '1 Estell Lee Pl, Wilmington, NC 28401' },
  { pattern: /castle\s*hayne/i, name: 'Castle Hayne', address: 'Castle Hayne, NC 28429' },
  { pattern: /ogden\s*park/i, name: 'Ogden Park', address: '3102 16th St Ext, Wilmington, NC 28411' },
  { pattern: /independence\s*mall/i, name: 'Independence Mall', address: '3500 Oleander Dr, Wilmington, NC 28403' },
  { pattern: /wave\s*transit/i, name: 'Wave Transit Station', address: '505 Cando St, Wilmington, NC 28405' },
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
