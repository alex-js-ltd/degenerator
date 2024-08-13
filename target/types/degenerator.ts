/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/degenerator.json`.
 */
export type Degenerator = {
  "address": "4dPcMAag9zD8Kj15FJiAUwRPCqrrBMk4wnyzbpKwT1wx",
  "metadata": {
    "name": "degenerator",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
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
          "name": "tokenDecimals",
          "type": "u8"
        },
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "tokenMetadataArgs"
            }
          }
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
