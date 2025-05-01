import { Censorly } from "censorly";

const moderateText = async (text: string): Promise<boolean> => {
  try {
    const apiKey = process.env.CENSORLY_API_KEY || "";
    if (!apiKey) return false;
    
    const censorly = new Censorly(apiKey);
    const result = await censorly.analyzeMessage(text);
    return result.flagged && result.confidence > 0.7;
  } catch (error) {
    console.error('Error moderating text:', error);
    return false;
  }
};