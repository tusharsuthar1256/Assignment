export const wallets: Record<string, number> = {};
export const ledger: any[] = [];
export const orders: Record<string, any> = {};
export const locks: Record<string, boolean> = {};

export const acquireLock = async (client_id: string) => {
  while (locks[client_id]) {
    await new Promise((res) => setTimeout(res, 10));
  }
  locks[client_id] = true;
};

export const releaseLock = (client_id: string) => {
  locks[client_id] = false;
};

export const generateId = () =>
  Math.random().toString(36).substring(2, 10);