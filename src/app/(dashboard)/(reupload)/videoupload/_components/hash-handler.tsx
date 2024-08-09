import { SHA256 } from 'crypto-js';

export const generateHash = (data: string) => SHA256(data).toString();

export const storeData = (data: any) => {
  const hash = generateHash(JSON.stringify(data));
  localStorage.setItem(hash, JSON.stringify(data));
  return hash;
};

export const retrieveData = (hash: string) => {
  const data = localStorage.getItem(hash);
  return data ? JSON.parse(data) : null;
};
