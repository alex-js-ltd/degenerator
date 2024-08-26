import { Program } from '@coral-xyz/anchor';
import { Keypair, Connection, PublicKey, Signer, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/degenerator.json`.
 */
type Degenerator = {
    "address": "EvWUsdbUMvo7ZEykj4Hpo1rPsuaTHpqezJ7sj2u2fk6R";
    "metadata": {
        "name": "degenerator";
        "version": "0.1.0";
        "spec": "0.1.0";
        "description": "Created with Anchor";
    };
    "instructions": [
        {
            "name": "createAmm";
            "discriminator": [
                242,
                91,
                21,
                170,
                5,
                68,
                125,
                64
            ];
            "accounts": [
                {
                    "name": "amm";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "arg";
                                "path": "id";
                            }
                        ];
                    };
                },
                {
                    "name": "admin";
                    "docs": [
                        "The admin of the AMM"
                    ];
                },
                {
                    "name": "payer";
                    "docs": [
                        "The account paying for all rents"
                    ];
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "systemProgram";
                    "docs": [
                        "Solana ecosystem accounts"
                    ];
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "id";
                    "type": "pubkey";
                },
                {
                    "name": "fee";
                    "type": "u16";
                }
            ];
        },
        {
            "name": "createAssociatedTokenAccount";
            "discriminator": [
                112,
                83,
                122,
                159,
                174,
                104,
                244,
                19
            ];
            "accounts": [
                {
                    "name": "signer";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "mint";
                },
                {
                    "name": "tokenAccount";
                    "writable": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                },
                {
                    "name": "tokenProgram";
                },
                {
                    "name": "associatedTokenProgram";
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
                }
            ];
            "args": [];
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
                    "name": "amm";
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account";
                                "path": "amm.id";
                                "account": "amm";
                            }
                        ];
                    };
                },
                {
                    "name": "pool";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account";
                                "path": "amm";
                            },
                            {
                                "kind": "account";
                                "path": "mintA";
                            },
                            {
                                "kind": "account";
                                "path": "mintB";
                            }
                        ];
                    };
                },
                {
                    "name": "poolAuthority";
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account";
                                "path": "amm";
                            },
                            {
                                "kind": "account";
                                "path": "mintA";
                            },
                            {
                                "kind": "account";
                                "path": "mintB";
                            },
                            {
                                "kind": "const";
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
                                ];
                            }
                        ];
                    };
                },
                {
                    "name": "mintLiquidity";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account";
                                "path": "amm";
                            },
                            {
                                "kind": "account";
                                "path": "mintA";
                            },
                            {
                                "kind": "account";
                                "path": "mintB";
                            },
                            {
                                "kind": "const";
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
                                ];
                            }
                        ];
                    };
                },
                {
                    "name": "mintA";
                },
                {
                    "name": "mintB";
                },
                {
                    "name": "poolAccountA";
                    "writable": true;
                },
                {
                    "name": "poolAccountB";
                    "writable": true;
                },
                {
                    "name": "payer";
                    "docs": [
                        "The account paying for all rents"
                    ];
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "tokenProgram";
                    "docs": [
                        "Solana ecosystem accounts"
                    ];
                    "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
                },
                {
                    "name": "associatedTokenProgram";
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [];
        },
        {
            "name": "emit";
            "discriminator": [
                252,
                45,
                156,
                110,
                150,
                14,
                45,
                99
            ];
            "accounts": [
                {
                    "name": "mintAccount";
                },
                {
                    "name": "tokenProgram";
                    "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
                }
            ];
            "args": [];
        },
        {
            "name": "initialize";
            "discriminator": [
                175,
                175,
                109,
                31,
                13,
                152,
                155,
                237
            ];
            "accounts": [
                {
                    "name": "payer";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "mintAccount";
                    "writable": true;
                    "signer": true;
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
            "args": [
                {
                    "name": "tokenDecimals";
                    "type": "u8";
                },
                {
                    "name": "args";
                    "type": {
                        "defined": {
                            "name": "tokenMetadataArgs";
                        };
                    };
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
            "name": "removeKey";
            "discriminator": [
                210,
                40,
                193,
                233,
                8,
                77,
                176,
                144
            ];
            "accounts": [
                {
                    "name": "updateAuthority";
                    "writable": true;
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
            "args": [
                {
                    "name": "key";
                    "type": "string";
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
            "name": "updateAuthority";
            "discriminator": [
                32,
                46,
                64,
                28,
                149,
                75,
                243,
                88
            ];
            "accounts": [
                {
                    "name": "currentAuthority";
                    "signer": true;
                },
                {
                    "name": "newAuthority";
                    "optional": true;
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
            "name": "updateField";
            "discriminator": [
                164,
                49,
                117,
                6,
                187,
                205,
                13,
                217
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
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
            "args": [
                {
                    "name": "args";
                    "type": {
                        "defined": {
                            "name": "updateFieldArgs";
                        };
                    };
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "amm";
            "discriminator": [
                143,
                245,
                200,
                17,
                74,
                214,
                196,
                135
            ];
        },
        {
            "name": "pool";
            "discriminator": [
                241,
                154,
                109,
                4,
                17,
                177,
                109,
                188
            ];
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "invalidFee";
            "msg": "Invalid fee value";
        },
        {
            "code": 6001;
            "name": "invalidMint";
            "msg": "Invalid mint for the pool";
        },
        {
            "code": 6002;
            "name": "depositTooSmall";
            "msg": "Depositing too little liquidity";
        },
        {
            "code": 6003;
            "name": "outputTooSmall";
            "msg": "Output is below the minimum expected";
        },
        {
            "code": 6004;
            "name": "invariantViolated";
            "msg": "Invariant does not hold";
        }
    ];
    "types": [
        {
            "name": "amm";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "id";
                        "docs": [
                            "The primary key of the AMM"
                        ];
                        "type": "pubkey";
                    },
                    {
                        "name": "admin";
                        "docs": [
                            "Account that has admin authority over the AMM"
                        ];
                        "type": "pubkey";
                    },
                    {
                        "name": "fee";
                        "docs": [
                            "The LP fee taken on each trade, in basis points"
                        ];
                        "type": "u16";
                    }
                ];
            };
        },
        {
            "name": "anchorField";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "name";
                    },
                    {
                        "name": "symbol";
                    },
                    {
                        "name": "uri";
                    },
                    {
                        "name": "key";
                        "fields": [
                            "string"
                        ];
                    }
                ];
            };
        },
        {
            "name": "pool";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "amm";
                        "docs": [
                            "Primary key of the AMM"
                        ];
                        "type": "pubkey";
                    },
                    {
                        "name": "mintA";
                        "docs": [
                            "Mint of token A"
                        ];
                        "type": "pubkey";
                    },
                    {
                        "name": "mintB";
                        "docs": [
                            "Mint of token B"
                        ];
                        "type": "pubkey";
                    }
                ];
            };
        },
        {
            "name": "tokenMetadataArgs";
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
        },
        {
            "name": "updateFieldArgs";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "field";
                        "docs": [
                            "Field to update in the metadata"
                        ];
                        "type": {
                            "defined": {
                                "name": "anchorField";
                            };
                        };
                    },
                    {
                        "name": "value";
                        "docs": [
                            "Value to write for the field"
                        ];
                        "type": "string";
                    }
                ];
            };
        }
    ];
    "constants": [
        {
            "name": "authoritySeed";
            "type": "bytes";
            "value": "[97, 117, 116, 104, 111, 114, 105, 116, 121]";
        },
        {
            "name": "liquiditySeed";
            "type": "bytes";
            "value": "[108, 105, 113, 117, 105, 100, 105, 116, 121]";
        },
        {
            "name": "minimumLiquidity";
            "type": "u64";
            "value": "100";
        }
    ];
};

var address = "EvWUsdbUMvo7ZEykj4Hpo1rPsuaTHpqezJ7sj2u2fk6R";
var metadata = {
	name: "degenerator",
	version: "0.1.0",
	spec: "0.1.0",
	description: "Created with Anchor"
};
var instructions = [
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
		args: [
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
		args: [
		]
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
		args: [
		]
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
		args: [
		]
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
];
var accounts = [
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
];
var errors = [
	{
		code: 6000,
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
];
var types = [
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
];
var constants = [
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
];
var degenerator = {
	address: address,
	metadata: metadata,
	instructions: instructions,
	accounts: accounts,
	errors: errors,
	types: types,
	constants: constants
};

declare function airDrop({ payer, connection, }: {
    payer: Keypair;
    connection: Connection;
}): Promise<void>;
declare function getAssociatedAddress({ mint, owner, }: {
    mint: PublicKey;
    owner: PublicKey;
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
declare function getMintInstructions({ program, payer, mint, metadata, decimals, supply, }: GetMintInstructionsParams): Promise<TransactionInstruction[]>;

export { type Degenerator, degenerator as IDL, airDrop, buildTransaction, getAssociatedAddress, getMintInstructions, sendAndConfirm };
