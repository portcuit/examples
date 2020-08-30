declare module 'serve-handler' {
  import {IncomingMessage, ServerResponse} from "http";
  export type Config = {
    public?: string;
    cleanUrls: boolean;
    directoryListing?: boolean | string[];
    headers?: {
      source: string;
      headers: {
        key: string;
        value: string;
      }[]
    }[]
  };
  const handler: (req: IncomingMessage, res: ServerResponse, config?: Config) => Promise<any>;
  export default handler;
}