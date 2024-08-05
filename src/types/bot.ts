export type IBotType = {
  _id: string;
  username: string;
  name: string;
  language: 'ENGLISH' | 'SPANISH';
  endpointing: number;
  daylightSavings: boolean;
  interruptable: boolean;
  promptInstructions: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  voice: {
    provider: string;
    voiceId: string;
  };
};
