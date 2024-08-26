import { prisma } from '@/app/utils/db'

async function seed() {
	console.log('🌱 Seeding...')

	const totalTokens = 3
	console.time(`👤 Created ${totalTokens} tokens...`)

	for (let index = 0; index < totalTokens; index++) {}

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
