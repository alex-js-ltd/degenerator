/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/degenerator.json`.
 */
export type Degenerator = {
	address: 'B3mDtybHy54Q1dYT36eb6fKcTK5QVFyTbyi76Te9vTEz'
	metadata: {
		name: 'degenerator'
		version: '0.1.0'
		spec: '0.1.0'
		description: 'Created with Anchor'
	}
	instructions: [
		{
			name: 'createAssociatedTokenAccount'
			discriminator: [112, 83, 122, 159, 174, 104, 244, 19]
			accounts: [
				{
					name: 'signer'
					writable: true
					signer: true
				},
				{
					name: 'mint'
				},
				{
					name: 'tokenAccount'
					writable: true
				},
				{
					name: 'systemProgram'
					address: '11111111111111111111111111111111'
				},
				{
					name: 'tokenProgram'
				},
				{
					name: 'associatedTokenProgram'
					address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
				},
			]
			args: []
		},
		{
			name: 'emit'
			discriminator: [252, 45, 156, 110, 150, 14, 45, 99]
			accounts: [
				{
					name: 'mintAccount'
				},
				{
					name: 'tokenProgram'
					address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
				},
			]
			args: []
		},
		{
			name: 'initialize'
			discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
			accounts: [
				{
					name: 'payer'
					writable: true
					signer: true
				},
				{
					name: 'mintAccount'
					writable: true
					signer: true
				},
				{
					name: 'tokenProgram'
					address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
				},
				{
					name: 'systemProgram'
					address: '11111111111111111111111111111111'
				},
			]
			args: [
				{
					name: 'args'
					type: {
						defined: {
							name: 'tokenMetadataArgs'
						}
					}
				},
			]
		},
		{
			name: 'mintToken'
			discriminator: [172, 137, 183, 14, 207, 110, 234, 56]
			accounts: [
				{
					name: 'signer'
					writable: true
					signer: true
				},
				{
					name: 'mint'
					writable: true
				},
				{
					name: 'receiver'
					writable: true
				},
				{
					name: 'tokenProgram'
				},
			]
			args: [
				{
					name: 'amount'
					type: 'u64'
				},
			]
		},
		{
			name: 'removeKey'
			discriminator: [210, 40, 193, 233, 8, 77, 176, 144]
			accounts: [
				{
					name: 'updateAuthority'
					writable: true
					signer: true
				},
				{
					name: 'mintAccount'
					writable: true
				},
				{
					name: 'tokenProgram'
					address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
				},
				{
					name: 'systemProgram'
					address: '11111111111111111111111111111111'
				},
			]
			args: [
				{
					name: 'key'
					type: 'string'
				},
			]
		},
		{
			name: 'updateAuthority'
			discriminator: [32, 46, 64, 28, 149, 75, 243, 88]
			accounts: [
				{
					name: 'currentAuthority'
					signer: true
				},
				{
					name: 'newAuthority'
					optional: true
				},
				{
					name: 'mintAccount'
					writable: true
				},
				{
					name: 'tokenProgram'
					address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
				},
				{
					name: 'systemProgram'
					address: '11111111111111111111111111111111'
				},
			]
			args: []
		},
		{
			name: 'updateField'
			discriminator: [164, 49, 117, 6, 187, 205, 13, 217]
			accounts: [
				{
					name: 'authority'
					writable: true
					signer: true
				},
				{
					name: 'mintAccount'
					writable: true
				},
				{
					name: 'tokenProgram'
					address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
				},
				{
					name: 'systemProgram'
					address: '11111111111111111111111111111111'
				},
			]
			args: [
				{
					name: 'args'
					type: {
						defined: {
							name: 'updateFieldArgs'
						}
					}
				},
			]
		},
	]
	types: [
		{
			name: 'anchorField'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'name'
					},
					{
						name: 'symbol'
					},
					{
						name: 'uri'
					},
					{
						name: 'key'
						fields: ['string']
					},
				]
			}
		},
		{
			name: 'tokenMetadataArgs'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'name'
						type: 'string'
					},
					{
						name: 'symbol'
						type: 'string'
					},
					{
						name: 'uri'
						type: 'string'
					},
				]
			}
		},
		{
			name: 'updateFieldArgs'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'field'
						docs: ['Field to update in the metadata']
						type: {
							defined: {
								name: 'anchorField'
							}
						}
					},
					{
						name: 'value'
						docs: ['Value to write for the field']
						type: 'string'
					},
				]
			}
		},
	]
}
