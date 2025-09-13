import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMiddleware } from '@tanstack/react-start';
import * as anchor from '@coral-xyz/anchor';
import { Runner } from 'target/types/runner';
import idl from '../idl/runner.json';

let provider: anchor.AnchorProvider;
let program: anchor.Program<Runner>;
let connection: Connection;
let sponsor: Keypair;
let leaderboardPDA: PublicKey;

export const solanaMiddleware = createMiddleware({ type: 'function' }).server(
  ({ next }) => {
    if (!sponsor) {
      sponsor = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.SPONSOR_WALLET!) ?? [])
      );
    }

    if (!connection) {
      connection = new Connection(process.env.RPC_URL!, 'confirmed');
    }

    if (!provider) {
      provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(sponsor),
        {}
      );
      anchor.setProvider(provider);
    }

    if (!program) {
      program = new anchor.Program(idl as anchor.Idl);
    }

    if (!leaderboardPDA) {
      [leaderboardPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('leaderboard'), sponsor.publicKey.toBuffer()],
        program.programId
      );
    }

    return next({
      context: {
        solana: {
          connection,
          program,
          provider,
          sponsor,
          leaderboardPDA,
        },
      },
    });
  }
);
