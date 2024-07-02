/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/degenerator.json`.
 */
export type Degenerator = {
  "address": "4Lzn7k1Z3QBfadkXNaKD2Rp8JNHXEgttZrzg7vLK9gkn",
  "metadata": {
    "name": "degenerator",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createAmm",
      "discriminator": [
        242,
        91,
        21,
        170,
        5,
        68,
        125,
        64
      ],
      "accounts": [
        {
          "name": "amm",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "admin",
          "docs": [
            "The admin of the AMM"
          ]
        },
        {
          "name": "payer",
          "docs": [
            "The account paying for all rents"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana ecosystem accounts"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "pubkey"
        },
        {
          "name": "fee",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createAssociatedTokenAccount",
      "discriminator": [
        112,
        83,
        122,
        159,
        174,
        104,
        244,
        19
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "createPool",
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "amm",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "amm.id",
                "account": "amm"
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              },
              {
                "kind": "const",
                "value": [
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
          "name": "mintLiquidity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              },
              {
                "kind": "const",
                "value": [
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
          "name": "mintA"
        },
        {
          "name": "mintB"
        },
        {
          "name": "poolAccountA",
          "writable": true
        },
        {
          "name": "poolAccountB",
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The account paying for all rents"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana ecosystem accounts"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "emit",
      "discriminator": [
        252,
        45,
        156,
        110,
        150,
        14,
        45,
        99
      ],
      "accounts": [
        {
          "name": "mintAccount"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mintAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "tokenMetadataArgs"
            }
          }
        },
        {
          "name": "tokenDecimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "mintToken",
      "discriminator": [
        172,
        137,
        183,
        14,
        207,
        110,
        234,
        56
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "receiver",
          "writable": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeKey",
      "discriminator": [
        210,
        40,
        193,
        233,
        8,
        77,
        176,
        144
      ],
      "accounts": [
        {
          "name": "updateAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "key",
          "type": "string"
        }
      ]
    },
    {
      "name": "revokeFreezeAuthority",
      "discriminator": [
        84,
        177,
        206,
        249,
        25,
        1,
        237,
        159
      ],
      "accounts": [
        {
          "name": "currentAuthority",
          "signer": true
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "revokeMintAuthority",
      "discriminator": [
        140,
        52,
        61,
        238,
        209,
        157,
        189,
        32
      ],
      "accounts": [
        {
          "name": "currentAuthority",
          "signer": true
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateAuthority",
      "discriminator": [
        32,
        46,
        64,
        28,
        149,
        75,
        243,
        88
      ],
      "accounts": [
        {
          "name": "currentAuthority",
          "signer": true
        },
        {
          "name": "newAuthority",
          "optional": true
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateField",
      "discriminator": [
        164,
        49,
        117,
        6,
        187,
        205,
        13,
        217
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateFieldArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "amm",
      "discriminator": [
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
      "name": "pool",
      "discriminator": [
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
  "errors": [
    {
      "code": 6000,
      "name": "invalidFee",
      "msg": "Invalid fee value"
    },
    {
      "code": 6001,
      "name": "invalidMint",
      "msg": "Invalid mint for the pool"
    },
    {
      "code": 6002,
      "name": "depositTooSmall",
      "msg": "Depositing too little liquidity"
    },
    {
      "code": 6003,
      "name": "outputTooSmall",
      "msg": "Output is below the minimum expected"
    },
    {
      "code": 6004,
      "name": "invariantViolated",
      "msg": "Invariant does not hold"
    }
  ],
  "types": [
    {
      "name": "amm",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "The primary key of the AMM"
            ],
            "type": "pubkey"
          },
          {
            "name": "admin",
            "docs": [
              "Account that has admin authority over the AMM"
            ],
            "type": "pubkey"
          },
          {
            "name": "fee",
            "docs": [
              "The LP fee taken on each trade, in basis points"
            ],
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "anchorField",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "name"
          },
          {
            "name": "symbol"
          },
          {
            "name": "uri"
          },
          {
            "name": "key",
            "fields": [
              "string"
            ]
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amm",
            "docs": [
              "Primary key of the AMM"
            ],
            "type": "pubkey"
          },
          {
            "name": "mintA",
            "docs": [
              "Mint of token A"
            ],
            "type": "pubkey"
          },
          {
            "name": "mintB",
            "docs": [
              "Mint of token B"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "tokenMetadataArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "updateFieldArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "field",
            "docs": [
              "Field to update in the metadata"
            ],
            "type": {
              "defined": {
                "name": "anchorField"
              }
            }
          },
          {
            "name": "value",
            "docs": [
              "Value to write for the field"
            ],
            "type": "string"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "authoritySeed",
      "type": "bytes",
      "value": "[97, 117, 116, 104, 111, 114, 105, 116, 121]"
    },
    {
      "name": "liquiditySeed",
      "type": "bytes",
      "value": "[108, 105, 113, 117, 105, 100, 105, 116, 121]"
    },
    {
      "name": "minimumLiquidity",
      "type": "u64",
      "value": "100"
    }
  ]
};
