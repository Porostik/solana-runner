import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { BN } from 'bn.js';
import type { Runner } from '../target/types/runner';
import { expect } from 'chai';

describe('runner', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.runner as Program<Runner>;
  const name = 'Test';
  const sponsor = new Keypair();

  let rpc: Connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const batchTxs = async (groups: anchor.web3.TransactionInstruction[][]) => {
    for (const group of groups) {
      const tx = new Transaction();
      group.forEach((g) => tx.add(g));
      const { blockhash } = await rpc.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.sign(sponsor);
      const sig = await rpc.sendRawTransaction(tx.serialize());
      await rpc.confirmTransaction(sig, 'confirmed');
    }
  };

  const getCreatePlayerIx = async (playerName: string = name, tgId: bigint) => {
    return program.methods
      .initializePlayer(playerName, new BN(tgId))
      .accounts({
        sponsor: sponsor.publicKey,
      })
      .signers([sponsor])
      .instruction();
  };

  const getIncreaseScoreIx = (
    playerPDA: anchor.web3.PublicKey,
    score: number
  ) => {
    return program.methods
      .updatePlayerBestScore(new BN(score))
      .accounts({
        sponsor: sponsor.publicKey,
        player: playerPDA,
      })
      .signers([sponsor])
      .instruction();
  };

  const getCreateLeaderboardIx = () => {
    return program.methods
      .initializeLeaderboard()
      .accounts({
        sponsor: sponsor.publicKey,
      })
      .signers([sponsor])
      .instruction();
  };

  const getUpdateLeaderboard = async (
    leaderboardPDA: anchor.web3.PublicKey,
    playerPDA: anchor.web3.PublicKey
  ) => {
    return program.methods
      .updateLeaderboard()
      .accounts({
        sponsor: sponsor.publicKey,
        leaderboard: leaderboardPDA,
        player: playerPDA,
      })
      .signers([sponsor])
      .instruction();
  };

  const createPlayerPda = async (playerName: string = name, tgId: bigint) => {
    const tgIdLE = Buffer.alloc(8);
    tgIdLE.writeBigUInt64LE(tgId);

    const airdropTx = await rpc.requestAirdrop(
      sponsor.publicKey,
      10 * LAMPORTS_PER_SOL
    );
    await rpc.confirmTransaction(airdropTx);

    const [playerPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('tg'), tgIdLE],
      program.programId
    );

    const ix = await getCreatePlayerIx(playerName, tgId);

    await batchTxs([[ix]]);

    return playerPDA;
  };

  const increaseScore = async (
    newScore: number,
    playerPDA: anchor.web3.PublicKey
  ) => {
    const ix = await getIncreaseScoreIx(playerPDA, newScore);

    await batchTxs([[ix]]);
  };

  const createLeaderboard = async () => {
    const airdropTx = await rpc.requestAirdrop(
      sponsor.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await rpc.confirmTransaction(airdropTx);

    const [leaderboardPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('leaderboard'), sponsor.publicKey.toBuffer()],
      program.programId
    );

    const ix = await getCreateLeaderboardIx();

    await batchTxs([[ix]]);

    return leaderboardPDA;
  };

  const addNewPlayerToLeaderboard = async (
    leaderboardPDA: anchor.web3.PublicKey,
    playerPDA: anchor.web3.PublicKey
  ) => {
    const ix = await getUpdateLeaderboard(leaderboardPDA, playerPDA);

    await batchTxs([[ix]]);
  };

  it('Initialize player pda', async () => {
    const playerPDA = await createPlayerPda('Player', 1n);
    const accountData = await program.account.player.fetch(playerPDA);

    expect(accountData.name).to.equal('Player');
    expect(accountData.tgId.eq(new BN(1n))).to.be.true;
    expect(accountData.maxScore.isZero()).to.be.true;
  });

  it('Should increase maxScore', async () => {
    const playerPDA = await createPlayerPda('Player', 1n);
    const newScore = 1000;

    await increaseScore(newScore, playerPDA);

    const accountDataAfterUpdate = await program.account.player.fetch(
      playerPDA
    );

    expect(accountDataAfterUpdate.maxScore.eq(new BN(newScore))).to.be.true;
  });

  it('Should not increase maxScore if new score is lower', async () => {
    const playerPDA = await createPlayerPda('Player', 1n);
    const newScore = 1000;

    await increaseScore(newScore, playerPDA);

    const accountDataAfterUpdate = await program.account.player.fetch(
      playerPDA
    );

    expect(accountDataAfterUpdate.maxScore.eq(new BN(newScore))).to.be.true;

    await increaseScore(500, playerPDA);

    expect(accountDataAfterUpdate.maxScore.eq(new BN(newScore))).to.be.true;
  });

  it('Should initialize leaderboard', async () => {
    const leaderboardPDA = await createLeaderboard();
    const leaderboard = await program.account.leaderboard.fetch(leaderboardPDA);

    expect(leaderboard.topPlayers.length === 0).to.be.true;
  });

  it('Should add new player to leaderboard', async () => {
    const leaderboardPDA = await createLeaderboard();

    const playerPDA = await createPlayerPda('Player', 1n);
    await increaseScore(1000, playerPDA);

    await addNewPlayerToLeaderboard(leaderboardPDA, playerPDA);

    const leaderboard = await program.account.leaderboard.fetch(leaderboardPDA);

    expect(leaderboard.topPlayers.length === 1).to.be.true;
    expect(leaderboard.topPlayers[0].pubkey.toBase58() === playerPDA.toBase58())
      .to.be.true;
  });

  it('Should insert new player to a correct place at leaderboard', async () => {
    const leaderboardPDA = await createLeaderboard();

    const player1PDA = await createPlayerPda('Player1', 1n);
    await increaseScore(1000, player1PDA);

    await addNewPlayerToLeaderboard(leaderboardPDA, player1PDA);

    const player2PDA = await createPlayerPda('Player2', 2n);
    await increaseScore(2000, player2PDA);

    await addNewPlayerToLeaderboard(leaderboardPDA, player2PDA);

    const leaderboard = await program.account.leaderboard.fetch(leaderboardPDA);

    expect(leaderboard.topPlayers.length === 2).to.be.true;
    expect(
      leaderboard.topPlayers[0].pubkey.toBase58() === player2PDA.toBase58()
    ).to.be.true;
    expect(
      leaderboard.topPlayers[1].pubkey.toBase58() === player1PDA.toBase58()
    ).to.be.true;
  });

  it('Should insert single hight score', async () => {
    const leaderboardPDA = await createLeaderboard();

    const playerPDA = await createPlayerPda('Player', 1n);

    await increaseScore(1000, playerPDA);
    await addNewPlayerToLeaderboard(leaderboardPDA, playerPDA);
    await increaseScore(2000, playerPDA);
    await addNewPlayerToLeaderboard(leaderboardPDA, playerPDA);

    const leaderboard = await program.account.leaderboard.fetch(leaderboardPDA);

    expect(leaderboard.topPlayers.length === 1).to.be.true;
    expect(leaderboard.topPlayers[0].score.eq(new BN(2000))).to.be.true;
  });

  it('Should not insert player to leaderboard if his score not suitable', async () => {
    const leaderboardPDA = await createLeaderboard();

    const action = async (name: string, score: number, tgId: bigint) => {
      const playerPDA = await createPlayerPda(name, tgId);
      await increaseScore(score, playerPDA);
      await addNewPlayerToLeaderboard(leaderboardPDA, playerPDA);
    };

    for (let i = 0; i <= 50; i++) {
      await action(`Player-${i}`, 1000 + i, BigInt(i));
    }

    const lowerScorePlayer = await createPlayerPda('Player123', 123n);
    await increaseScore(500, lowerScorePlayer);
    await addNewPlayerToLeaderboard(leaderboardPDA, lowerScorePlayer);

    const leaderboard = await program.account.leaderboard.fetch(leaderboardPDA);

    expect(
      leaderboard.topPlayers.find(
        (player) => player.pubkey.toBase58() === lowerScorePlayer.toBase58()
      )
    ).to.be.undefined;
  });
});
