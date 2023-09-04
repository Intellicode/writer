declare module "*.css";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electronAPI: any;
  }
}
export {};
