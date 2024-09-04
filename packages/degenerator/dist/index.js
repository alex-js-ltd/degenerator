// src/index.ts
import { BN, web3, utils } from "@coral-xyz/anchor";
import {
  PublicKey as PublicKey2,
  TransactionMessage,
  VersionedTransaction
} from "@solana/web3.js";

// ../../node_modules/.pnpm/@solana+spl-token@0.4.8_@solana+web3.js@1.95.3_fastestsmallesttextencoderdecoder@1.0.22_typescript@5.5.4/node_modules/@solana/spl-token/lib/esm/constants.js
import { PublicKey } from "@solana/web3.js";
var TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
var TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
var ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
var NATIVE_MINT = new PublicKey("So11111111111111111111111111111111111111112");
var NATIVE_MINT_2022 = new PublicKey("9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP");

// target/idl/degenerator.json
var degenerator_default = {
  address: "E2uLXz1ovgb9idrbqADFQeQBiFEjcA7Qs4bVKC381znL",
  metadata: {
    name: "degenerator",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  instructions: [
    {
      name: "buy_token",
      discriminator: [
        138,
        127,
        14,
        91,
        38,
        87,
        115,
        105
      ],
      accounts: [
        {
          name: "signer",
          docs: [
            "The payer of the transaction and the signer"
          ],
          writable: true,
          signer: true
        },
        {
          name: "pool_authority",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                kind: "account",
                path: "mint"
              }
            ]
          }
        },
        {
          name: "pool_ata",
          docs: [
            "Token account from which the tokens will be transferred"
          ],
          writable: true
        },
        {
          name: "payer_ata",
          docs: [
            "Token account to which the tokens will be transferred (created if needed)"
          ],
          writable: true
        },
        {
          name: "mint",
          docs: [
            "Mint associated with the token"
          ],
          writable: true
        },
        {
          name: "token_program",
          docs: [
            "Token program"
          ]
        },
        {
          name: "system_program",
          docs: [
            "System program"
          ],
          address: "11111111111111111111111111111111"
        },
        {
          name: "associated_token_program",
          docs: [
            "Associated token program"
          ],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "create_mint_account",
      discriminator: [
        76,
        184,
        50,
        62,
        162,
        141,
        47,
        103
      ],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true
        },
        {
          name: "authority",
          writable: true,
          signer: true
        },
        {
          name: "receiver"
        },
        {
          name: "mint",
          writable: true,
          signer: true
        },
        {
          name: "mint_token_account",
          writable: true
        },
        {
          name: "extra_metas_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                kind: "account",
                path: "mint"
              }
            ]
          }
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "token_program",
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      args: [
        {
          name: "token_decimals",
          type: "u8"
        },
        {
          name: "args",
          type: {
            defined: {
              name: "CreateMintAccountArgs"
            }
          }
        }
      ]
    },
    {
      name: "create_pool",
      discriminator: [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      accounts: [
        {
          name: "payer",
          docs: [
            "The payer for the transaction"
          ],
          writable: true,
          signer: true
        },
        {
          name: "pool_authority",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                kind: "account",
                path: "mint"
              }
            ]
          }
        },
        {
          name: "mint",
          docs: [
            "The Mint for which the ATA is being created"
          ]
        },
        {
          name: "pool_ata",
          docs: [
            "The ATA that will be created"
          ],
          writable: true
        },
        {
          name: "payer_ata",
          writable: true
        },
        {
          name: "token_program",
          docs: [
            "Spl token program or token program 2022"
          ]
        },
        {
          name: "associated_token_program",
          docs: [
            "Associated Token Program"
          ],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "system_program",
          docs: [
            "System Program"
          ],
          address: "11111111111111111111111111111111"
        },
        {
          name: "rent",
          docs: [
            "Sysvar for program account"
          ],
          address: "SysvarRent111111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "mint_token",
      discriminator: [
        172,
        137,
        183,
        14,
        207,
        110,
        234,
        56
      ],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true
        },
        {
          name: "mint",
          writable: true
        },
        {
          name: "receiver",
          writable: true
        },
        {
          name: "token_program"
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "revoke_freeze_authority",
      discriminator: [
        84,
        177,
        206,
        249,
        25,
        1,
        237,
        159
      ],
      accounts: [
        {
          name: "current_authority",
          signer: true
        },
        {
          name: "mint_account",
          writable: true
        },
        {
          name: "token_program",
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "revoke_mint_authority",
      discriminator: [
        140,
        52,
        61,
        238,
        209,
        157,
        189,
        32
      ],
      accounts: [
        {
          name: "current_authority",
          signer: true
        },
        {
          name: "mint_account",
          writable: true
        },
        {
          name: "token_program",
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "sell_token",
      discriminator: [
        109,
        61,
        40,
        187,
        230,
        176,
        135,
        174
      ],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true
        },
        {
          name: "payer_ata",
          writable: true
        },
        {
          name: "pool_authority",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                kind: "account",
                path: "mint"
              }
            ]
          }
        },
        {
          name: "pool_ata",
          writable: true
        },
        {
          name: "mint",
          writable: true
        },
        {
          name: "token_program"
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    }
  ],
  errors: [
    {
      code: 6e3,
      name: "InsufficientTokens",
      msg: "Insufficient tokens in the pool."
    }
  ],
  types: [
    {
      name: "CreateMintAccountArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string"
          },
          {
            name: "symbol",
            type: "string"
          },
          {
            name: "uri",
            type: "string"
          }
        ]
      }
    }
  ]
};

// src/index.ts
async function airDrop({
  account,
  connection
}) {
  const blocks = connection.getLatestBlockhash();
  const airDrop2 = connection.requestAirdrop(account, 1e10);
  const [latestBlockhash, signature] = await Promise.all([blocks, airDrop2]);
  await connection.confirmTransaction(
    {
      ...latestBlockhash,
      signature
    },
    "confirmed"
  );
}
function getAssociatedAddress({
  mint,
  owner
}) {
  return PublicKey2.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];
}
function getPoolPda({
  program,
  mint
}) {
  return PublicKey2.findProgramAddressSync(
    [Buffer.from("pool"), mint.toBuffer()],
    program.programId
  )[0];
}
async function buildTransaction({
  connection,
  payer,
  signers,
  instructions
}) {
  const { blockhash } = await connection.getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions
  }).compileToV0Message();
  const tx = new VersionedTransaction(messageV0);
  signers.forEach((s) => tx.sign([s]));
  return tx;
}
async function sendAndConfirm({
  connection,
  tx
}) {
  const blocks = connection.getLatestBlockhash();
  const send = connection.sendTransaction(tx);
  const [latestBlockhash, signature] = await Promise.all([blocks, send]);
  await connection.confirmTransaction(
    {
      ...latestBlockhash,
      signature
    },
    "confirmed"
  );
  return signature;
}
async function getTokenAmount({
  connection,
  address
}) {
  const res = await connection.getTokenAccountBalance(address);
  return res.value.amount;
}
async function getBalance({
  connection,
  address
}) {
  const res = await connection.getBalance(address);
  return res;
}
async function getMintInstructions({
  program,
  payer,
  mint,
  metadata,
  decimals,
  supply
}) {
  const supplyBN = new BN(supply);
  const transferAmount = supplyBN.mul(new BN(90)).div(new BN(100));
  const payerATA = getAssociatedAddress({
    mint,
    owner: payer
  });
  const pda = getPoolPda({ program, mint });
  const poolATA = getAssociatedAddress({
    mint,
    owner: pda
  });
  const [extraMetasAccount] = PublicKey2.findProgramAddressSync(
    [utils.bytes.utf8.encode("extra-account-metas"), mint.toBuffer()],
    program.programId
  );
  const init = await program.methods.createMintAccount(decimals, metadata).accountsStrict({
    payer,
    authority: payer,
    receiver: payer,
    mint,
    mintTokenAccount: payerATA,
    extraMetasAccount,
    systemProgram: web3.SystemProgram.programId,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  }).instruction();
  const mintToken = await program.methods.mintToken(supplyBN).accounts({
    mint,
    signer: payer,
    receiver: payerATA,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  }).instruction();
  const revokeMint = await program.methods.revokeMintAuthority().accounts({
    currentAuthority: payer,
    mintAccount: mint
  }).instruction();
  const revokeFreeze = await program.methods.revokeFreezeAuthority().accounts({
    currentAuthority: payer,
    mintAccount: mint
  }).instruction();
  const createPool = await program.methods.createPool(transferAmount).accounts({
    payer,
    poolAta: poolATA,
    mint,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    payerAta: payerATA
  }).instruction();
  return [init, mintToken, revokeMint, revokeFreeze, createPool];
}
async function getBuyTokenInstruction({
  program,
  payer,
  mint,
  amount
}) {
  const payerATA = getAssociatedAddress({
    mint,
    owner: payer
  });
  const pda = getPoolPda({ program, mint });
  const poolATA = getAssociatedAddress({
    mint,
    owner: pda
  });
  const amountBN = new BN(amount);
  const buy = await program.methods.buyToken(amountBN).accounts({
    mint,
    signer: payer,
    poolAta: poolATA,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    payerAta: payerATA
  }).instruction();
  return buy;
}
async function getSellTokenInstruction({
  program,
  payer,
  mint,
  amount
}) {
  const payerATA = getAssociatedAddress({
    mint,
    owner: payer
  });
  const pda = getPoolPda({ program, mint });
  const poolATA = getAssociatedAddress({
    mint,
    owner: pda
  });
  const amountBN = new BN(amount);
  const sell = await program.methods.sellToken(amountBN).accounts({
    mint,
    signer: payer,
    payerAta: payerATA,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    poolAta: poolATA
  }).instruction();
  return sell;
}
export {
  degenerator_default as IDL,
  airDrop,
  buildTransaction,
  getAssociatedAddress,
  getBalance,
  getBuyTokenInstruction,
  getMintInstructions,
  getPoolPda,
  getSellTokenInstruction,
  getTokenAmount,
  sendAndConfirm
};
