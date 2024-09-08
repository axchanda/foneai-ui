export type IFunctionItem = {
  _id: string;
  functionName: string;
  functionDescription?: string;
  functionAction: IFunctionAction;
  parameters: IFunctionParameterType[];
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
        slug: string;
        responseInstructions: string;
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
