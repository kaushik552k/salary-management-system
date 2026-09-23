import prisma from '../src/lib/prisma';

afterAll(async () => {
  // Ensure the Prisma Client connection is cleanly closed
  // after all tests run, so Jest can exit cleanly without --forceExit
  await prisma.$disconnect();
});
