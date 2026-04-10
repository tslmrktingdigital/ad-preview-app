import { describe, it, expect } from 'vitest';
import { parseSchoolProfile } from '../src/parser.js';

describe('parseSchoolProfile', () => {
  it('extracts school name from page title', () => {
    const result = parseSchoolProfile(
      [{ url: 'https://example.com', title: 'Grace Academy | Home', bodyText: '', links: [] }],
      ''
    );
    expect(result.name).toBe('Grace Academy');
  });

  it('detects grade levels from body text', () => {
    const result = parseSchoolProfile(
      [{
        url: 'https://example.com',
        title: 'Test School',
        bodyText: 'We offer PreK through high school programs.',
        links: [],
      }],
      'Test School'
    );
    expect(result.gradeLevels).toContain('PreK');
    expect(result.gradeLevels).toContain('High School');
  });
});
