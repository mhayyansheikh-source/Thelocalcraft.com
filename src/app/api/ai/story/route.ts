import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const deepseek = createOpenAICompatible({
  name: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://opencode.ai/zen/v1',
});

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const { text } = await generateText({
      model: deepseek('deepseek-v4-flash'),
      system: `You are the Heritage Copywriter for The Local Craft. Your job is to transform rough voice transcripts from master artisans into beautiful, sensory-rich product descriptions. Keep it authentic, highlight the generations of technique, and avoid generic marketing speak. Keep it under 2 paragraphs.`,
      prompt: `Here is the artisan's voice transcript: "${transcript}"`,
    });

    return NextResponse.json({ story: text });
  } catch (error) {
    console.error('AI Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
