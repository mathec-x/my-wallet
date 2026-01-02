export interface IPromptContext {
  confirm: (msg: string, caption: string) => Promise<boolean>;
  alert: (msg: string) => Promise<boolean>;
  loading: (msgOrState?: string | boolean) => { message: (msg: string) => void; close: () => void };
}