const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.qbozlxndlxgzeeeiulud:CompanioAI%402026@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
})

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe("SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'objects'")
    console.log("RLS SECURITY STATUS:")
    console.log(JSON.stringify(res, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
