export type IBotType = {
  _id: string;
  username: string;
  botName: string;
  botIntroduction: string;
  botLanguage: 'en' | 'es';
  endpointing: number;
  daylightSavings: boolean;
  botIsInterruptable: boolean;
  botInstructions: string;
  botTimezone: string;
  botKnowledgeBase: string;
  createdAt: string;
  updatedAt: string;
  botVoiceId: string;
};