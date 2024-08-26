import { web3, Program } from '@coral-xyz/anchor';
import { Keypair, Connection, PublicKey, Signer, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/degenerator.json`.
 */
type Degenerator = {
    "address": "4dPcMAag9zD8Kj15FJiAUwRPCqrrBMk4wnyzbpKwT1wx";
    "metadata": {
        "name": "degenerator";
        "version": "0.1.0";
        "spec": "0.1.0";
        "description": "Created with Anchor";
    };
    "instructions": [
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
    "types": [
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
};

var address = "4dPcMAag9zD8Kj15FJiAUwRPCqrrBMk4wnyzbpKwT1wx";
var metadata = {
	name: "degenerator",
	version: "0.1.0",
	spec: "0.1.0",
	description: "Created with Anchor"
};
var instructions = [
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
var types = [
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
var degenerator = {
	address: address,
	metadata: metadata,
	instructions: instructions,
	types: types
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
    revoke: boolean | undefined;
}
declare function getMintInstructions({ program, payer, mint, metadata, decimals, supply, revoke, }: GetMintInstructionsParams): Promise<web3.TransactionInstruction[]>;

export { type Degenerator, degenerator as IDL, airDrop, buildTransaction, getAssociatedAddress, getMintInstructions, sendAndConfirm };
