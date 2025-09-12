import { Player, PlayerPdaData } from './types';

export const processPlayerPda = (playerData: PlayerPdaData): Player => ({
  name: playerData.name,
  tgId: playerData.tgId.toNumber(),
  maxScore: playerData.maxScore.toNumber(),
  pubkey: playerData.pubkey.toBase58(),
});
