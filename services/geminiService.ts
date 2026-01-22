
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export const generateAIImage = async (
  prompt: string, 
  aspectRatio: AspectRatio, 
  styleSuffix: string,
  modelName: string = 'gemini-2.5-flash-image'
): Promise<string> => {
  const fullPrompt = `${prompt}${styleSuffix}`;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    let imageUrl = '';
    
    // Iterasi melalui bagian respons untuk mencari data gambar
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64Data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("Tidak ada gambar yang dihasilkan oleh AI.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Kesalahan saat menghasilkan gambar:", error);
    throw error;
  }
};
