export type IFunctionItem = {
  _id: string;
  functionName: string;
  functionDescription?: string;
  functionAction: IFunctionAction;
  functionParameters: IFunctionParameterType[];
};

export type IFunctionParameterType = {
  parameterIsRequired: boolean;
  parameterName: string;
  parameterType: number | string | boolean;
  parameterDescription: string;
};

export type IFunctionAction =
  | {
      type: 'webhook';
      data: {
        linkedWebhook: string;
        path: string;
        responseInstructions: string;
        payloadData: any;
      };
    }
  | {
      type: 'transfer';
      data: null;
    }
  | {
      type: 'hangup';
      data: null;
    };
