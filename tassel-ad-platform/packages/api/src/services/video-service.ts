import LumaAI from 'lumaai';

// Luma AI Ray-2 client — lazy-initialised so missing key doesn't crash the boot
let _client: LumaAI | null = null;
function getClient(): LumaAI {
  if (!_client) {
    if (!process.env.LUMA_API_KEY) {
      throw new Error('LUMA_API_KEY is not set. Add it to your .env file.');
    }
    _client = new LumaAI({ authToken: process.env.LUMA_API_KEY });
  }
  return _client;
}

// ── Prompt builder ─────────────────────────────────────────────────────────────

function buildVideoPrompt(params: {
  imageBrief: string;
  headline: string;
  schoolName: string;
  campaignGoal: string;
}): string {
  const goalHint =
    params.campaignGoal.toLowerCase().includes('enroll') ||
    params.campaignGoal.toLowerCase().includes('admiss')
      ? 'warm enrollment season atmosphere, parents and children excited about school'
      : params.campaignGoal.toLowerCase().includes('faith') ||
          params.campaignGoal.toLowerCase().includes('christi')
        ? 'faith-filled, community atmosphere, wholesome and aspirational'
        : 'aspirational, community-focused, welcoming school environment';

  return [
    `Cinematic 5-second social media video advertisement for ${params.schoolName}, a private school.`,
    `Scene: ${params.imageBrief}`,
    `Mood: ${goalHint}.`,
    `Style: warm natural lighting, gentle cinematic camera movement (slow push-in or pan),`,
    `professional color grade, authentic and heartfelt. Real students and families.`,
    `No text overlays, no graphics. Suitable for Facebook and Instagram paid ads.`,
    `High production value, like a premium school brand video.`,
  ].join(' ');
}

// ── Public API ─────────────────────────────────────────────────────────────────

export interface StartVideoGenerationResult {
  generationId: string;
}

/**
 * Kicks off a Luma AI video generation and returns the generation ID immediately.
 * Pass referenceImageUrl (a screenshot from an example video, or any school photo)
 * to anchor the visual style — Luma will use it as the first keyframe.
 */
export async function startVideoGeneration(params: {
  imageBrief: string;
  headline: string;
  schoolName: string;
  campaignGoal: string;
  referenceImageUrl?: string; // optional "example video" style anchor
}): Promise<StartVideoGenerationResult> {
  const client = getClient();
  const prompt = buildVideoPrompt(params);

  const generationParams: Parameters<typeof client.generations.create>[0] = {
    prompt,
    model: 'ray-2' as any,
    duration: '5s' as any,
    aspect_ratio: '16:9' as any,
  };

  // If a reference image is provided, use it as the first keyframe
  // This is the "based off example videos" feature — paste a frame from the
  // video you want to mimic and Luma will match its visual style.
  if (params.referenceImageUrl) {
    (generationParams as any).keyframes = {
      frame0: {
        type: 'image',
        url: params.referenceImageUrl,
      },
    };
  }

  const generation = await client.generations.create(generationParams);
  return { generationId: generation.id! };
}

export interface VideoGenerationStatus {
  state: 'queued' | 'dreaming' | 'completed' | 'failed';
  videoUrl?: string;
  errorMessage?: string;
}

/**
 * Polls the current status of a Luma AI generation.
 * Call this periodically (every ~5s) until state is 'completed' or 'failed'.
 */
export async function getVideoGenerationStatus(
  generationId: string,
): Promise<VideoGenerationStatus> {
  const client = getClient();
  const generation = await client.generations.get(generationId);

  const state = generation.state as string;

  if (state === 'completed') {
    const videoUrl = (generation as any).assets?.video as string | undefined;
    return { state: 'completed', videoUrl };
  }

  if (state === 'failed') {
    return {
      state: 'failed',
      errorMessage: (generation as any).failure_reason ?? 'Generation failed',
    };
  }

  // 'queued' | 'dreaming' (in-progress)
  return { state: state === 'dreaming' ? 'dreaming' : 'queued' };
}
