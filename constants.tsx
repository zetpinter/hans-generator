
import { AIStyle, AspectRatio } from './types';

export const AI_STYLES: AIStyle[] = [
  { id: 'none', name: 'Tanpa Gaya', image: 'https://picsum.photos/seed/style0/200', promptSuffix: '' },
  { id: 'anime', name: 'Anime', image: 'https://picsum.photos/seed/anime/200', promptSuffix: ', style of modern high quality anime, vibrant colors, detailed eyes, Makoto Shinkai style' },
  { id: 'realistic', name: 'Realistik', image: 'https://picsum.photos/seed/realistic/200', promptSuffix: ', hyper-realistic, 8k resolution, highly detailed, cinematic lighting, photography, professional shot' },
  { id: 'cyberpunk', name: 'Cyberpunk', image: 'https://picsum.photos/seed/cyber/200', promptSuffix: ', cyberpunk aesthetic, neon lights, futuristic city, night, glowing elements, dark atmosphere' },
  { id: 'oil-painting', name: 'Lukisan Cat Minyak', image: 'https://picsum.photos/seed/oil/200', promptSuffix: ', oil painting style, visible brush strokes, rich textures, classic masterpiece aesthetic' },
  { id: 'pixel-art', name: 'Pixel Art', image: 'https://picsum.photos/seed/pixel/200', promptSuffix: ', 16-bit pixel art, retro gaming aesthetic, clean pixel lines' },
  { id: '3d-render', name: '3D Render', image: 'https://picsum.photos/seed/3d/200', promptSuffix: ', 3D isometric render, Unreal Engine 5, Octane render, soft lighting, cute stylized character' },
  { id: 'sketch', name: 'Sketsa', image: 'https://picsum.photos/seed/sketch/200', promptSuffix: ', charcoal pencil sketch, hand drawn, artistic, white background, detailed line art' },
];

export const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: '1:1', value: '1:1' },
  { label: '3:4', value: '3:4' },
  { label: '4:3', value: '4:3' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' },
];
