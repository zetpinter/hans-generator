
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface AIStyle {
  id: string;
  name: string;
  image: string;
  promptSuffix: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  style: string;
}

export enum AppState {
  IDLE = "IDLE",
  GENERATING = "GENERATING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS"
}
