declare module "bcryptjs" {
    export function compare(data: string, encrypted: string): Promise<boolean>;
    export function genSalt(rounds: number): Promise<string>;
    export function hash(data: string, salt: string): Promise<string>;
  }