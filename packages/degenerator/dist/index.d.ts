import { Program, web3 } from '@coral-xyz/anchor';
import { PublicKey, Connection, Signer, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/degenerator.json`.
 */
type Degenerator = {
    "address": "9UFqJxvAX4Tkk9TgaJTXcnCNLjdZgsb5VBHye1maKUY8";
    "metadata": {
        "name": "degenerator";
        "version": "0.1.0";
        "spec": "0.1.0";
        "description": "Created with Anchor";
    };
    "instructions": [
        {
            "name": "buyToken";
            "discriminator": [
                138,
                127,
                14,
                91,
                38,
                87,
                115,
                105
            ];
            "accounts": [
                {
                    "name": "signer";
                    "docs": [
                        "The payer of the transaction and the signer"
                    ];
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "poolAuthority";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "mint";
                            }
                        ];
                    };
                },
                {
                    "name": "poolAta";
                    "docs": [
                        "Token account from which the tokens will be transferred"
                    ];
                    "writable": true;
                },
                {
                    "name": "payerAta";
                    "docs": [
                        "Token account to which the tokens will be transferred (created if needed)"
                    ];
                    "writable": true;
                },
                {
                    "name": "mint";
                    "docs": [
                        "Mint associated with the token"
                    ];
                    "writable": true;
                },
                {
                    "name": "tokenProgram";
                    "docs": [
                        "Token program"
                    ];
                },
                {
                    "name": "systemProgram";
                    "docs": [
                        "System program"
                    ];
                    "address": "11111111111111111111111111111111";
                },
                {
                    "name": "associatedTokenProgram";
                    "docs": [
                        "Associated token program"
                    ];
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "createMintAccount";
            "discriminator": [
                76,
                184,
                50,
                62,
                162,
                141,
                47,
                103
            ];
            "accounts": [
                {
                    "name": "payer";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "receiver";
                },
                {
                    "name": "mint";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "mintTokenAccount";
                    "writable": true;
                },
                {
                    "name": "extraMetasAccount";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
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
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "mint";
                            }
                        ];
                    };
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                },
                {
                    "name": "associatedTokenProgram";
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
                },
                {
                    "name": "tokenProgram";
                    "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
                }
            ];
            "args": [
                {
                    "name": "tokenDecimals";
                    "type": "u8";
                },
                {
                    "name": "args";
                    "type": {
                        "defined": {
                            "name": "createMintAccountArgs";
                        };
                    };
                }
            ];
        },
        {
            "name": "createPool";
            "discriminator": [
                233,
                146,
                209,
                142,
                207,
                104,
                64,
                188
            ];
            "accounts": [
                {
                    "name": "payer";
                    "docs": [
                        "The payer for the transaction"
                    ];
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "poolAuthority";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "mint";
                            }
                        ];
                    };
                },
                {
                    "name": "mint";
                    "docs": [
                        "The Mint for which the ATA is being created"
                    ];
                },
                {
                    "name": "poolAta";
                    "docs": [
                        "The ATA that will be created"
                    ];
                    "writable": true;
                },
                {
                    "name": "payerAta";
                    "writable": true;
                },
                {
                    "name": "tokenProgram";
                    "docs": [
                        "Spl token program or token program 2022"
                    ];
                },
                {
                    "name": "associatedTokenProgram";
                    "docs": [
                        "Associated Token Program"
                    ];
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
                },
                {
                    "name": "systemProgram";
                    "docs": [
                        "System Program"
                    ];
                    "address": "11111111111111111111111111111111";
                },
                {
                    "name": "rent";
                    "docs": [
                        "Sysvar for program account"
                    ];
                    "address": "SysvarRent111111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "mintToken";
            "discriminator": [
                172,
                137,
                183,
                14,
                207,
                110,
                234,
                56
            ];
            "accounts": [
                {
                    "name": "signer";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "mint";
                    "writable": true;
                },
                {
                    "name": "receiver";
                    "writable": true;
                },
                {
                    "name": "tokenProgram";
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "revokeFreezeAuthority";
            "discriminator": [
                84,
                177,
                206,
                249,
                25,
                1,
                237,
                159
            ];
            "accounts": [
                {
                    "name": "currentAuthority";
                    "signer": true;
                },
                {
                    "name": "mintAccount";
                    "writable": true;
                },
                {
                    "name": "tokenProgram";
                    "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [];
        },
        {
            "name": "revokeMintAuthority";
            "discriminator": [
                140,
                52,
                61,
                238,
                209,
                157,
                189,
                32
            ];
            "accounts": [
                {
                    "name": "currentAuthority";
                    "signer": true;
                },
                {
                    "name": "mintAccount";
                    "writable": true;
                },
                {
                    "name": "tokenProgram";
                    "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [];
        },
        {
            "name": "sellToken";
            "discriminator": [
                109,
                61,
                40,
                187,
                230,
                176,
                135,
                174
            ];
            "accounts": [
                {
                    "name": "signer";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "payerAta";
                    "writable": true;
                },
                {
                    "name": "poolAuthority";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "mint";
                            }
                        ];
                    };
                },
                {
                    "name": "poolAta";
                    "writable": true;
                },
                {
                    "name": "mint";
                    "writable": true;
                },
                {
                    "name": "tokenProgram";
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                },
                {
                    "name": "associatedTokenProgram";
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "insufficientTokens";
            "msg": "Insufficient tokens in the pool.";
        }
    ];
    "types": [
        {
            "name": "createMintAccountArgs";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "name";
                        "type": "string";
                    },
                    {
                        "name": "symbol";
                        "type": "string";
                    },
                    {
                        "name": "uri";
                        "type": "string";
                    }
                ];
            };
        }
    ];
};

var address = "9UFqJxvAX4Tkk9TgaJTXcnCNLjdZgsb5VBHye1maKUY8";
var metadata = {
	name: "degenerator",
	version: "0.1.0",
	spec: "0.1.0",
	description: "Created with Anchor"
};
var instructions = [
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
		args: [
		]
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
		args: [
		]
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
];
var errors = [
	{
		code: 6000,
		name: "InsufficientTokens",
		msg: "Insufficient tokens in the pool."
	}
];
var types = [
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
];
var degenerator = {
	address: address,
	metadata: metadata,
	instructions: instructions,
	errors: errors,
	types: types
};

declare function airDrop({ account, connection, }: {
    account: PublicKey;
    connection: Connection;
}): Promise<void>;
declare function getAssociatedAddress({ mint, owner, }: {
    mint: PublicKey;
    owner: PublicKey;
}): PublicKey;
declare function getPoolPda({ program, mint, }: {
    program: Program<Degenerator>;
    mint: PublicKey;
}): PublicKey;
declare function buildTransaction({ connection, payer, signers, instructions, }: {
    connection: Connection;
    payer: PublicKey;
    signers: Signer[];
    instructions: TransactionInstruction[];
}): Promise<VersionedTransaction>;
declare function sendAndConfirm({ connection, tx, }: {
    connection: Connection;
    tx: VersionedTransaction;
}): Promise<string>;
declare function getTokenAmount({ connection, address, }: {
    connection: Connection;
    address: PublicKey;
}): Promise<string>;
declare function getBalance({ connection, address, }: {
    connection: Connection;
    address: PublicKey;
}): Promise<number>;
interface GetMintInstructionsParams {
    program: Program<Degenerator>;
    payer: PublicKey;
    mint: PublicKey;
    metadata: {
        name: string;
        symbol: string;
        uri: string;
    };
    decimals: number;
    supply: number;
}
declare function getMintInstructions({ program, payer, mint, metadata, decimals, supply, }: GetMintInstructionsParams): Promise<web3.TransactionInstruction[]>;
interface SwapTokenInstructionParams {
    program: Program<Degenerator>;
    payer: PublicKey;
    mint: PublicKey;
    amount: number;
}
declare function getBuyTokenInstruction({ program, payer, mint, amount, }: SwapTokenInstructionParams): Promise<web3.TransactionInstruction>;
declare function getSellTokenInstruction({ program, payer, mint, amount, }: SwapTokenInstructionParams): Promise<web3.TransactionInstruction>;

export { type Degenerator, degenerator as IDL, airDrop, buildTransaction, getAssociatedAddress, getBalance, getBuyTokenInstruction, getMintInstructions, getPoolPda, getSellTokenInstruction, getTokenAmount, sendAndConfirm };
