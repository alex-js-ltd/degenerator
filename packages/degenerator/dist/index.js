// src/index.ts
import { BN } from "@coral-xyz/anchor";
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
  address: "EvWUsdbUMvo7ZEykj4Hpo1rPsuaTHpqezJ7sj2u2fk6R",
  metadata: {
    name: "degenerator",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  instructions: [
    {
      name: "create_amm",
      discriminator: [
        242,
        91,
        21,
        170,
        5,
        68,
        125,
        64
      ],
      accounts: [
        {
          name: "amm",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "arg",
                path: "id"
              }
            ]
          }
        },
        {
          name: "admin",
          docs: [
            "The admin of the AMM"
          ]
        },
        {
          name: "payer",
          docs: [
            "The account paying for all rents"
          ],
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          docs: [
            "Solana ecosystem accounts"
          ],
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "id",
          type: "pubkey"
        },
        {
          name: "fee",
          type: "u16"
        }
      ]
    },
    {
      name: "create_associated_token_account",
      discriminator: [
        112,
        83,
        122,
        159,
        174,
        104,
        244,
        19
      ],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true
        },
        {
          name: "mint"
        },
        {
          name: "token_account",
          writable: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      args: []
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
          name: "amm",
          pda: {
            seeds: [
              {
                kind: "account",
                path: "amm.id",
                account: "Amm"
              }
            ]
          }
        },
        {
          name: "pool",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "amm"
              },
              {
                kind: "account",
                path: "mint_a"
              },
              {
                kind: "account",
                path: "mint_b"
              }
            ]
          }
        },
        {
          name: "pool_authority",
          pda: {
            seeds: [
              {
                kind: "account",
                path: "amm"
              },
              {
                kind: "account",
                path: "mint_a"
              },
              {
                kind: "account",
                path: "mint_b"
              },
              {
                kind: "const",
                value: [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          name: "mint_liquidity",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "amm"
              },
              {
                kind: "account",
                path: "mint_a"
              },
              {
                kind: "account",
                path: "mint_b"
              },
              {
                kind: "const",
                value: [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          name: "mint_a"
        },
        {
          name: "mint_b"
        },
        {
          name: "pool_account_a",
          writable: true
        },
        {
          name: "pool_account_b",
          writable: true
        },
        {
          name: "payer",
          docs: [
            "The account paying for all rents"
          ],
          writable: true,
          signer: true
        },
        {
          name: "token_program",
          docs: [
            "Solana ecosystem accounts"
          ],
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "emit",
      discriminator: [
        252,
        45,
        156,
        110,
        150,
        14,
        45,
        99
      ],
      accounts: [
        {
          name: "mint_account"
        },
        {
          name: "token_program",
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      args: []
    },
    {
      name: "initialize",
      discriminator: [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true
        },
        {
          name: "mint_account",
          writable: true,
          signer: true
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
      args: [
        {
          name: "token_decimals",
          type: "u8"
        },
        {
          name: "args",
          type: {
            defined: {
              name: "TokenMetadataArgs"
            }
          }
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
      name: "remove_key",
      discriminator: [
        210,
        40,
        193,
        233,
        8,
        77,
        176,
        144
      ],
      accounts: [
        {
          name: "update_authority",
          writable: true,
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
      args: [
        {
          name: "key",
          type: "string"
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
      name: "update_authority",
      discriminator: [
        32,
        46,
        64,
        28,
        149,
        75,
        243,
        88
      ],
      accounts: [
        {
          name: "current_authority",
          signer: true
        },
        {
          name: "new_authority",
          optional: true
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
      name: "update_field",
      discriminator: [
        164,
        49,
        117,
        6,
        187,
        205,
        13,
        217
      ],
      accounts: [
        {
          name: "authority",
          writable: true,
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
      args: [
        {
          name: "args",
          type: {
            defined: {
              name: "UpdateFieldArgs"
            }
          }
        }
      ]
    }
  ],
  accounts: [
    {
      name: "Amm",
      discriminator: [
        143,
        245,
        200,
        17,
        74,
        214,
        196,
        135
      ]
    },
    {
      name: "Pool",
      discriminator: [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    }
  ],
  errors: [
    {
      code: 6e3,
      name: "InvalidFee",
      msg: "Invalid fee value"
    },
    {
      code: 6001,
      name: "InvalidMint",
      msg: "Invalid mint for the pool"
    },
    {
      code: 6002,
      name: "DepositTooSmall",
      msg: "Depositing too little liquidity"
    },
    {
      code: 6003,
      name: "OutputTooSmall",
      msg: "Output is below the minimum expected"
    },
    {
      code: 6004,
      name: "InvariantViolated",
      msg: "Invariant does not hold"
    }
  ],
  types: [
    {
      name: "Amm",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            docs: [
              "The primary key of the AMM"
            ],
            type: "pubkey"
          },
          {
            name: "admin",
            docs: [
              "Account that has admin authority over the AMM"
            ],
            type: "pubkey"
          },
          {
            name: "fee",
            docs: [
              "The LP fee taken on each trade, in basis points"
            ],
            type: "u16"
          }
        ]
      }
    },
    {
      name: "AnchorField",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Name"
          },
          {
            name: "Symbol"
          },
          {
            name: "Uri"
          },
          {
            name: "Key",
            fields: [
              "string"
            ]
          }
        ]
      }
    },
    {
      name: "Pool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "amm",
            docs: [
              "Primary key of the AMM"
            ],
            type: "pubkey"
          },
          {
            name: "mint_a",
            docs: [
              "Mint of token A"
            ],
            type: "pubkey"
          },
          {
            name: "mint_b",
            docs: [
              "Mint of token B"
            ],
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "TokenMetadataArgs",
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
      name: "UpdateFieldArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "field",
            docs: [
              "Field to update in the metadata"
            ],
            type: {
              defined: {
                name: "AnchorField"
              }
            }
          },
          {
            name: "value",
            docs: [
              "Value to write for the field"
            ],
            type: "string"
          }
        ]
      }
    }
  ],
  constants: [
    {
      name: "AUTHORITY_SEED",
      type: "bytes",
      value: "[97, 117, 116, 104, 111, 114, 105, 116, 121]"
    },
    {
      name: "LIQUIDITY_SEED",
      type: "bytes",
      value: "[108, 105, 113, 117, 105, 100, 105, 116, 121]"
    },
    {
      name: "MINIMUM_LIQUIDITY",
      type: "u64",
      value: "100"
    }
  ]
};

// src/index.ts
async function airDrop({
  payer,
  connection
}) {
  const blocks = connection.getLatestBlockhash();
  const airDrop2 = connection.requestAirdrop(payer.publicKey, 1e10);
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
async function getMintInstructions({
  program,
  payer,
  mint,
  metadata,
  decimals,
  supply
}) {
  const tokenAccount = getAssociatedAddress({
    mint,
    owner: payer
  });
  const init = await program.methods.initialize(decimals, metadata).accounts({
    mintAccount: mint,
    payer
  }).instruction();
  const createAta = await program.methods.createAssociatedTokenAccount().accounts({
    tokenAccount,
    mint,
    signer: payer,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  }).instruction();
  const mintToken = await program.methods.mintToken(new BN(supply)).accounts({
    mint,
    signer: payer,
    receiver: tokenAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  }).instruction();
  return [init, createAta, mintToken];
}
export {
  degenerator_default as IDL,
  airDrop,
  buildTransaction,
  getAssociatedAddress,
  getMintInstructions,
  sendAndConfirm
};
