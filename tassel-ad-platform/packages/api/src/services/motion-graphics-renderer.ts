/**
 * Motion graphics video renderer — matches the "Excellence Academy" style:
 *
 *  ┌──────────────────────────────────┐
 *  │  School photo (top ~58%)         │  ← with blue tint overlay
 *  │  + large serif headline text     │
 *  ├──────────────────────────────────┤
 *  │  Deep navy panel (bottom ~42%)   │  ← school name + logo area + CTA
 *  └──────────────────────────────────┘
 *
 * Output: 5-second 1080×1080 MP4, fade-in from blue gradient, hold, fade-out.
 * Uses: sharp (image compositing) + ffmpeg (video encoding + animation).
 */

import sharp from 'sharp';
import axios from 'axios';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

const SIZE = 1080;                        // Square 1:1
const PHOTO_HEIGHT = Math.round(SIZE * 0.585);  // ~631px — matches reference
const PANEL_HEIGHT = SIZE - PHOTO_HEIGHT; // ~449px

// Brand palette (sampled from reference frames)
const NAVY       = '#162580';  // deep navy panel
const BLUE_TINT  = '#1B3285';  // overlay on photo  (hex → rgba below)
const SKY_BLUE   = '#5BBEF5';  // accent / intro gradient top
const WHITE      = '#FFFFFF';
const LIGHT_BLUE = '#87CEEB';  // dates / subtext

// Uploads directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads/videos');

function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ── SVG helpers ───────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Wrap text at maxChars per line, return array of lines (max 3). */
function wrapText(text: string, maxChars = 22): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
    if (lines.length === 2 && current) { lines.push(current.trim()); break; }
  }
  if (current && lines.length < 3) lines.push(current.trim());
  return lines;
}

// ── Image compositing ─────────────────────────────────────────────────────────

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15_000 });
    return Buffer.from(res.data);
  } catch {
    return null;
  }
}

async function buildCompositeFrame(params: {
  headline: string;
  subtext: string;        // event date+time, CTA label, etc.
  schoolName: string;
  photoUrl?: string;
  template: 'event' | 'tour';
}): Promise<Buffer> {
  const { headline, subtext, schoolName, photoUrl, template } = params;

  // ── 1. Background: full-frame deep navy ─────────────────────────────────────
  let base = sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: NAVY },
  });

  const layers: sharp.OverlayOptions[] = [];

  // ── 2. Photo panel (top portion) ────────────────────────────────────────────
  if (photoUrl) {
    const rawBuf = await fetchImageBuffer(photoUrl);
    if (rawBuf) {
      // Resize + crop to fill the top area
      const photoBuf = await sharp(rawBuf)
        .resize(SIZE, PHOTO_HEIGHT, { fit: 'cover', position: 'centre' })
        .toBuffer();

      layers.push({ input: photoBuf, top: 0, left: 0 });

      // Blue tint overlay on photo (55% opacity, matches reference)
      const tintSvg = `<svg width="${SIZE}" height="${PHOTO_HEIGHT}">
        <rect width="${SIZE}" height="${PHOTO_HEIGHT}" fill="${BLUE_TINT}" opacity="0.55"/>
      </svg>`;
      layers.push({ input: Buffer.from(tintSvg), top: 0, left: 0 });
    }
  } else {
    // No photo → gradient-only background (matches intro frames from example videos)
    const gradSvg = `<svg width="${SIZE}" height="${SIZE}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${SKY_BLUE}"/>
          <stop offset="100%" stop-color="${NAVY}"/>
        </linearGradient>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>
    </svg>`;
    layers.push({ input: Buffer.from(gradSvg), top: 0, left: 0 });
  }

  // ── 3. Headline text on photo area ──────────────────────────────────────────
  // Tour template: large centered headline in the photo area (like "See the difference in person.")
  // Event template: event name in upper-left area
  const headlineLines = wrapText(headline, template === 'tour' ? 20 : 24);
  const headlineFontSize = template === 'tour' ? 62 : 52;
  const lineHeight = headlineFontSize * 1.25;

  if (template === 'tour') {
    // Centered, white, large serif — positioned in middle of photo area
    const totalTextH = headlineLines.length * lineHeight;
    const textY = (PHOTO_HEIGHT - totalTextH) / 2 + headlineFontSize;
    const headlineSvg = `<svg width="${SIZE}" height="${PHOTO_HEIGHT}">
      ${headlineLines.map((line, i) => `
        <text
          x="${SIZE / 2}"
          y="${textY + i * lineHeight}"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="${headlineFontSize}"
          font-weight="bold"
          fill="${WHITE}"
          text-anchor="middle"
          dominant-baseline="auto"
        >${escapeXml(line)}</text>
      `).join('')}
    </svg>`;
    layers.push({ input: Buffer.from(headlineSvg), top: 0, left: 0 });
  }

  // ── 4. Navy bottom panel (already the base background, add divider) ─────────
  const dividerSvg = `<svg width="${SIZE}" height="${SIZE - PHOTO_HEIGHT}">
    <rect width="${SIZE}" height="${SIZE - PHOTO_HEIGHT}" fill="${NAVY}"/>
  </svg>`;
  layers.push({ input: Buffer.from(dividerSvg), top: PHOTO_HEIGHT, left: 0 });

  // ── 5. Event panel content: event name banner + school name + details ────────
  if (template === 'event') {
    // Light blue banner with event title (like Open House 2 "Open House" bar)
    const bannerH = 100;
    const bannerY = PHOTO_HEIGHT - bannerH - 40;

    const bannerSvg = `<svg width="${SIZE * 0.65}" height="${bannerH + 20}">
      <rect width="${SIZE * 0.65}" height="${bannerH}" fill="${SKY_BLUE}" rx="0"/>
      <text
        x="40"
        y="${bannerH * 0.72}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="52"
        font-weight="bold"
        fill="${WHITE}"
      >${escapeXml(headline)}</text>
    </svg>`;
    layers.push({ input: Buffer.from(bannerSvg), top: bannerY, left: 0 });
  }

  // ── 6. Bottom panel: school name + subtext ──────────────────────────────────
  const panelPadX = 60;
  const panelCenterY = PHOTO_HEIGHT + (PANEL_HEIGHT / 2);

  const bottomSvg = `<svg width="${SIZE}" height="${PANEL_HEIGHT}">
    <!-- School name -->
    <text
      x="${panelPadX}"
      y="${PANEL_HEIGHT * 0.38}"
      font-family="Arial, Helvetica, sans-serif"
      font-size="38"
      font-weight="bold"
      fill="${WHITE}"
    >${escapeXml(schoolName)}</text>

    ${template === 'event' ? `
      <!-- Event subtext (date / time) -->
      <text
        x="${SIZE - panelPadX}"
        y="${PANEL_HEIGHT * 0.36}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="32"
        fill="${LIGHT_BLUE}"
        text-anchor="end"
      >${escapeXml(subtext.split('\n')[0] ?? subtext)}</text>
      ${subtext.includes('\n') ? `
      <text
        x="${SIZE - panelPadX}"
        y="${PANEL_HEIGHT * 0.58}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="32"
        fill="${LIGHT_BLUE}"
        text-anchor="end"
      >${escapeXml(subtext.split('\n')[1])}</text>
      ` : ''}
    ` : `
      <!-- CTA button pill (like "Schedule Your Tour") -->
      <rect
        x="${SIZE - panelPadX - 300}"
        y="${PANEL_HEIGHT * 0.45}"
        width="300" height="60"
        rx="30"
        fill="none"
        stroke="${LIGHT_BLUE}"
        stroke-width="2.5"
      />
      <text
        x="${SIZE - panelPadX - 150}"
        y="${PANEL_HEIGHT * 0.45 + 38}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="26"
        fill="${LIGHT_BLUE}"
        text-anchor="middle"
      >${escapeXml(subtext)}</text>
    `}
  </svg>`;
  layers.push({ input: Buffer.from(bottomSvg), top: PHOTO_HEIGHT, left: 0 });

  // ── Composite all layers ────────────────────────────────────────────────────
  const compositeBuf = await base.composite(layers).jpeg({ quality: 95 }).toBuffer();
  return compositeBuf;
}

// ── Video encoding via ffmpeg ─────────────────────────────────────────────────

async function buildVideo(framePath: string, outputPath: string): Promise<void> {
  // ffmpeg: loop the still frame for 5s with a fade-in (0→0.5s) and subtle fade-out (4.5→5s)
  await execFileAsync('/opt/homebrew/bin/ffmpeg', [
    '-y',
    '-loop', '1',
    '-framerate', '30',
    '-i', framePath,
    '-vf', [
      `scale=${SIZE}:${SIZE}`,
      // Fade in from blue (#1B3285) over first 20 frames (0.67s)
      `fade=type=in:start_frame=0:nb_frames=20:color=162580`,
      // Subtle fade out over last 15 frames
      `fade=type=out:start_frame=135:nb_frames=15`,
    ].join(','),
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-t', '5',
    '-an',
    outputPath,
  ]);
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface RenderVideoParams {
  adDraftId: string;
  headline: string;
  subtext: string;      // For event: "August 23 & 25\n6:00 pm" / For tour: "Schedule Your Tour"
  schoolName: string;
  photoUrl?: string;    // referenceImageUrl from Campaign
  template: 'event' | 'tour';
}

export async function renderMotionGraphicsVideo(
  params: RenderVideoParams,
): Promise<{ videoUrl: string; localPath: string }> {
  ensureUploadsDir();

  const framePath = path.join(UPLOADS_DIR, `frame-${params.adDraftId}.jpg`);
  const outputPath = path.join(UPLOADS_DIR, `${params.adDraftId}.mp4`);

  try {
    // 1. Build composite still frame
    const frameBuffer = await buildCompositeFrame({
      headline: params.headline,
      subtext: params.subtext,
      schoolName: params.schoolName,
      photoUrl: params.photoUrl,
      template: params.template,
    });

    await writeFile(framePath, frameBuffer);

    // 2. Encode to MP4 with ffmpeg animations
    await buildVideo(framePath, outputPath);

    // 3. Clean up temp frame
    await unlink(framePath).catch(() => {});

    // Return server-relative URL path (served by Express static middleware)
    const videoUrl = `/uploads/videos/${params.adDraftId}.mp4`;
    return { videoUrl, localPath: outputPath };
  } catch (err) {
    await unlink(framePath).catch(() => {});
    throw err;
  }
}

/** Infer video template from campaign goal */
export function inferTemplate(campaignGoal: string): 'event' | 'tour' {
  const lower = campaignGoal.toLowerCase();
  if (
    lower.includes('open house') ||
    lower.includes('event') ||
    lower.includes('information') ||
    lower.includes('info session')
  ) {
    return 'event';
  }
  return 'tour';
}

/** Build subtext line from campaign goal + ad copy */
export function buildSubtext(template: 'event' | 'tour', campaignGoal: string): string {
  if (template === 'tour') {
    return 'Schedule Your Tour';
  }
  // For events, try to surface the goal as a date hint, else generic
  return campaignGoal.replace(/open house/i, '').trim() || 'Register Today';
}
