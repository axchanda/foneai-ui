import { da } from "@fullcalendar/core/internal-common";

export type ILogType = {
    _id: string;
    sessionStart: Date;
    sessionEnd: Date;
    sessionDuration: Float32Array;
    chargeableDuration: Float32Array;
    costPerMinute: any;
    totalCost: Float32Array;
    username: string;   
    botId: any;
    campaignId: any; 
    app?: string;
  };
  
  export type ISessionLogType = {
    _id: string;
    sessionLog: Array<any>;
  };

  export type ISessionLogDetailType = {
    type: string;
    message: string;
    processCounter: number;
    error: string;
  };

  export type ILogFilters = {
    id: string;
    sessionStart?: any;
    sessionEnd?: any;
  };
  