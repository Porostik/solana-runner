use anchor_lang::prelude::*;

declare_id!("12nvHc5xdu43vVJVzQ9HMJTTZqa6S9e6R5hXNiyL17Yh");

#[program]
pub mod runner {
    use super::*;

    pub fn initialize_player(ctx: Context<InitializePlayer>, name: String, tg_id: u64) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.name = name;
        player.tg_id = tg_id;
        player.max_score = 0;
        Ok(())
    }

    pub fn update_player_best_score(ctx: Context<UpdateScore>, score: u64) -> Result<()> {
        let player = &mut ctx.accounts.player;
        if player.max_score < score {
            player.max_score = score;
        }
        Ok(())
    }

    pub fn initialize_leaderboard(ctx: Context<InitializeLeaderboard>) -> Result<()> {
        let leaderboard = &mut ctx.accounts.leaderboard;
        leaderboard.top_players = Vec::with_capacity(50);
        Ok(())
    }

    pub fn update_leaderboard(ctx: Context<UpdateLeaderboardBestScore>) -> Result<()> {
        let leaderboard = &mut ctx.accounts.leaderboard;
        let player = &ctx.accounts.player;
        let top_players = &mut leaderboard.top_players;
        let ts = Clock::get()?.unix_timestamp;

        let cap = 49usize;
        let len = top_players.len();

        if len == cap {
            if top_players[len - 1].score < player.max_score 
                || (top_players[len - 1].score == player.max_score && top_players[len - 1].ts <= ts) {
                    return Ok(())
                }
        }

        let new_top_player = TopPlayer { score: player.max_score, pubkey: ctx.accounts.player.key(), ts };

        if len == 0usize {
            top_players.push(new_top_player);

            return Ok(())
        }

        let insert_idx = top_players
            .iter()
            .position(|p| { p.score < player.max_score || (p.score == player.max_score && p.ts > ts) })
            .unwrap_or(len);

        top_players.insert(insert_idx, new_top_player);

        if top_players.len() > cap {
            top_players.pop();
        }
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, tg_id: u64)]
pub struct InitializePlayer<'info> {
    #[account(mut)]
    pub sponsor: Signer<'info>,

    #[account(
        init_if_needed,
        payer = sponsor,
        seeds = [b"tg", name.as_bytes(), tg_id.to_le_bytes().as_ref()],
        bump,
        space = Player::INIT_SPACE
    )]
    pub player: Account<'info, Player>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(score: u64)]
pub struct UpdateScore<'info> {
    #[account(mut)]
    pub sponsor: Signer<'info>,

    #[account(
        mut,
        owner = id(),
    )]
    pub player: Account<'info, Player>,

    pub system_program: Program<'info, System>
}

#[account]
#[derive(Default, InitSpace)]
pub struct Player {
    #[max_len(30)]
    pub name: String,
    pub tg_id: u64,
    pub max_score: u64
}

#[derive(Accounts)]
pub struct InitializeLeaderboard<'info> {
    #[account(mut)]
    pub sponsor: Signer<'info>,

    #[account(
        init_if_needed,
        payer = sponsor,
        seeds = [b"leaderboard", sponsor.key.as_ref()],
        bump,
        space = Leaderboard::INIT_SPACE
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct UpdateLeaderboardBestScore<'info> {
    #[account(mut)]
    pub sponsor: Signer<'info>,

    #[account(
        mut,
        owner = id()
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    #[account(
        owner = id()
    )]
    pub player: Account<'info, Player>,

    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct Leaderboard {
    #[max_len(50)]
    pub top_players: Vec<TopPlayer>
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, InitSpace)]
pub struct TopPlayer {
    pub score: u64,
    pub pubkey: Pubkey,
    pub ts: i64
}
