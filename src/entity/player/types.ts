import BN from 'bn.js';

export type Player = {
  name: string;
  tgId: number;
  maxScore: number;
  pubkey: string;
};

export type PlayerPdaData = {
  name: string;
  tgId: BN;
  maxScore: BN;
  pubkey: import('@solana/web3.js').PublicKey;
};
