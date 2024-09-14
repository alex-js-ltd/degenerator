// src/index.ts
import { BN, web3, utils } from "@coral-xyz/anchor";
import {
  PublicKey as PublicKey2,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL
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
  address: "6v1d6gShsbYiTrpeVL3MsgaGs79pRyu2DaZiRndD9eAc",
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
          name: "current_price",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  112,
                  114,
                  105,
                  99,
                  101
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
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "signer"
              },
              {
                kind: "const",
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                kind: "account",
                path: "mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
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
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "receiver"
              },
              {
                kind: "account",
                path: "token_program"
              },
              {
                kind: "account",
                path: "mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
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
          name: "current_price",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  112,
                  114,
                  105,
                  99,
                  101
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
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_authority"
              },
              {
                kind: "const",
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                kind: "account",
                path: "mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
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
          name: "current_price",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  112,
                  114,
                  105,
                  99,
                  101
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
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_authority"
              },
              {
                kind: "const",
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                kind: "account",
                path: "mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
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
  accounts: [
    {
      name: "Price",
      discriminator: [
        50,
        107,
        127,
        61,
        83,
        36,
        39,
        75
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
    },
    {
      name: "Price",
      type: {
        kind: "struct",
        fields: [
          {
            name: "price_per_token",
            type: "u64"
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
  const amount = 2 * LAMPORTS_PER_SOL;
  const blocks = connection.getLatestBlockhash();
  const airDrop2 = connection.requestAirdrop(account, amount);
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
function getPricePda({
  program,
  mint
}) {
  return PublicKey2.findProgramAddressSync(
    [Buffer.from("price"), mint.toBuffer()],
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
  const transferAmount = supplyBN.mul(new BN(99)).div(new BN(100));
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
  const currentPrice = getPricePda({ program, mint });
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
  const createPool = await program.methods.createPool(transferAmount).accountsStrict({
    payer,
    poolAta: poolATA,
    mint,
    poolAuthority: pda,
    currentPrice,
    payerAta: payerATA,
    systemProgram: web3.SystemProgram.programId,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    rent: web3.SYSVAR_RENT_PUBKEY
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
  const currentPrice = getPricePda({ program, mint });
  const amountBN = new BN(amount);
  const buy = await program.methods.buyToken(amountBN).accountsStrict({
    mint,
    signer: payer,
    poolAta: poolATA,
    payerAta: payerATA,
    poolAuthority: pda,
    currentPrice,
    systemProgram: web3.SystemProgram.programId,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID
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
  const currentPrice = getPricePda({ program, mint });
  const amountBN = new BN(amount);
  const sell = await program.methods.sellToken(amountBN).accountsStrict({
    mint,
    signer: payer,
    payerAta: payerATA,
    poolAta: poolATA,
    poolAuthority: pda,
    currentPrice,
    systemProgram: web3.SystemProgram.programId,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  }).instruction();
  return sell;
}
async function getPricePerToken({ program, mint }) {
  const pda = getPricePda({ program, mint });
  const data = await program.account.price.fetch(pda);
  return data;
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
  getPricePda,
  getPricePerToken,
  getSellTokenInstruction,
  sendAndConfirm
};
