import { Censorly } from "censorly";

const moderateText = async (text: string): Promise<boolean> => {
  const censorly = new Censorly("TODO: API KEY TO IMPORT");
  const result = await censorly.analyzeMessage(text);
  return result.flagged && result.confidence > 0.7 ? true : false;
};
