# Turborepo degenerator

solana-test-validator --reset \
--clone CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C \
--clone DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8 \
--clone D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2 \
--url https://api.mainnet-beta.solana.com

solana config set --url https://api.devnet.solana.com

solana-keygen recover -o recover.json --force

solana program deploy --buffer recover.json target/deploy/degenerator.so
