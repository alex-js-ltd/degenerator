export type Degenerator = {
  "version": "0.1.0",
  "name": "degenerator",
  "instructions": [
    {
      "name": "createBondingCurve",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The payer for the transaction"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondingCurveState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "pda to store bonding curve state"
          ]
        },
        {
          "name": "burnAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "ata to burn tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated Token Program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System Program"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The payer of the transaction and the signer"
          ]
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondingCurveState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account to which the tokens will be transferred (created if needed)"
          ]
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Mint associated with the token"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL token program or token program 2022"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated token program"
          ]
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
      "name": "sellToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondingCurveState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Mint associated with the token"
          ]
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account the tokens will be transferred from"
          ]
        },
        {
          "name": "burnAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "ata to burn tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated token program"
          ]
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
      "name": "wrapSol",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nativeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
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
      "name": "proxyInitialize",
      "accounts": [
        {
          "name": "cpSwapProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Which config the pool belongs to."
          ]
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_0 mint, the key must smaller then token_1 mint."
          ]
        },
        {
          "name": "token1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_1 mint, the key must grater then token_0 mint."
          ]
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorToken0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "payer token0 account"
          ]
        },
        {
          "name": "creatorToken1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "creator token1 account"
          ]
        },
        {
          "name": "creatorLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "createPoolFee",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "create pool fee account"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "token0Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "token1Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "To create a new program account"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        }
      ],
      "args": [
        {
          "name": "initAmount0",
          "type": "u64"
        },
        {
          "name": "initAmount1",
          "type": "u64"
        },
        {
          "name": "openTime",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bondingCurveState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyPrice",
            "type": "u64"
          },
          {
            "name": "sellPrice",
            "type": "u64"
          },
          {
            "name": "currentSupply",
            "type": "u64"
          },
          {
            "name": "progress",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientUserSupply",
      "msg": "Insufficient tokens in user's wallet"
    }
  ]
};

export const IDL: Degenerator = {
  "version": "0.1.0",
  "name": "degenerator",
  "instructions": [
    {
      "name": "createBondingCurve",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The payer for the transaction"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondingCurveState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "pda to store bonding curve state"
          ]
        },
        {
          "name": "burnAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "ata to burn tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated Token Program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System Program"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The payer of the transaction and the signer"
          ]
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondingCurveState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account to which the tokens will be transferred (created if needed)"
          ]
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Mint associated with the token"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL token program or token program 2022"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated token program"
          ]
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
      "name": "sellToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondingCurveState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Mint associated with the token"
          ]
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account the tokens will be transferred from"
          ]
        },
        {
          "name": "burnAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "ata to burn tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated token program"
          ]
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
      "name": "wrapSol",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nativeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Associated token program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
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
      "name": "proxyInitialize",
      "accounts": [
        {
          "name": "cpSwapProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Which config the pool belongs to."
          ]
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_0 mint, the key must smaller then token_1 mint."
          ]
        },
        {
          "name": "token1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_1 mint, the key must grater then token_0 mint."
          ]
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorToken0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "payer token0 account"
          ]
        },
        {
          "name": "creatorToken1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "creator token1 account"
          ]
        },
        {
          "name": "creatorLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "createPoolFee",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "create pool fee account"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "token0Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "token1Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "To create a new program account"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        }
      ],
      "args": [
        {
          "name": "initAmount0",
          "type": "u64"
        },
        {
          "name": "initAmount1",
          "type": "u64"
        },
        {
          "name": "openTime",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bondingCurveState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyPrice",
            "type": "u64"
          },
          {
            "name": "sellPrice",
            "type": "u64"
          },
          {
            "name": "currentSupply",
            "type": "u64"
          },
          {
            "name": "progress",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientUserSupply",
      "msg": "Insufficient tokens in user's wallet"
    }
  ]
};
