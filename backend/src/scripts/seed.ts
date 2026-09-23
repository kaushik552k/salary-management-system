import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Sales',
  'Finance',
  'Marketing',
  'Operations',
  'Legal',
  'Product',
  'Customer Success',
  'Data Science',
];

const JOB_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Director', 'VP'];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract'];
const EMPLOYMENT_TYPE_WEIGHTS = [0.75, 0.1, 0.15]; // 75% FT, 10% PT, 15% Contract

const COUNTRIES_CONFIG = [
  { name: 'United States', currency: 'USD', weight: 0.30, salaryMultiplier: 1.0 },
  { name: 'India', currency: 'INR', weight: 0.25, salaryMultiplier: 83 },
  { name: 'United Kingdom', currency: 'GBP', weight: 0.12, salaryMultiplier: 0.79 },
  { name: 'Germany', currency: 'EUR', weight: 0.08, salaryMultiplier: 0.92 },
  { name: 'Canada', currency: 'CAD', weight: 0.07, salaryMultiplier: 1.36 },
  { name: 'Australia', currency: 'AUD', weight: 0.06, salaryMultiplier: 1.53 },
  { name: 'Singapore', currency: 'SGD', weight: 0.05, salaryMultiplier: 1.34 },
  { name: 'Brazil', currency: 'BRL', weight: 0.03, salaryMultiplier: 4.97 },
  { name: 'France', currency: 'EUR', weight: 0.02, salaryMultiplier: 0.92 },
  { name: 'Japan', currency: 'JPY', weight: 0.02, salaryMultiplier: 149 },
];

// Base salaries in USD by level
const BASE_SALARY_USD: Record<string, { min: number; max: number }> = {
  Junior: { min: 45_000, max: 70_000 },
  Mid: { min: 70_000, max: 100_000 },
  Senior: { min: 100_000, max: 140_000 },
  Lead: { min: 130_000, max: 170_000 },
  Principal: { min: 160_000, max: 210_000 },
  Director: { min: 190_000, max: 260_000 },
  VP: { min: 240_000, max: 350_000 },
};

// Level weights — pyramid-shaped org
const LEVEL_WEIGHTS: Record<string, number> = {
  Junior: 0.25,
  Mid: 0.30,
  Senior: 0.25,
  Lead: 0.10,
  Principal: 0.05,
  Director: 0.03,
  VP: 0.02,
};

// Job titles by department
const JOB_TITLES: Record<string, Record<string, string[]>> = {
  Engineering: {
    Junior: ['Junior Software Engineer', 'Junior Frontend Engineer', 'Junior Backend Engineer'],
    Mid: ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer'],
    Senior: ['Senior Software Engineer', 'Senior Frontend Engineer', 'Senior Backend Engineer'],
    Lead: ['Tech Lead', 'Engineering Lead'],
    Principal: ['Principal Engineer', 'Staff Engineer'],
    Director: ['Engineering Manager', 'Director of Engineering'],
    VP: ['VP of Engineering', 'CTO'],
  },
  HR: {
    Junior: ['HR Coordinator', 'HR Assistant'],
    Mid: ['HR Specialist', 'Talent Acquisition Specialist'],
    Senior: ['Senior HR Specialist', 'Senior Recruiter'],
    Lead: ['HR Lead', 'TA Lead'],
    Principal: ['Principal HR Partner'],
    Director: ['HR Director', 'Director of People Operations'],
    VP: ['VP of HR', 'Chief People Officer'],
  },
  Sales: {
    Junior: ['Sales Development Rep', 'Junior Account Executive'],
    Mid: ['Account Executive', 'Sales Representative'],
    Senior: ['Senior Account Executive', 'Enterprise AE'],
    Lead: ['Sales Team Lead', 'Regional Sales Lead'],
    Principal: ['Principal Account Executive'],
    Director: ['Sales Director', 'Director of Sales'],
    VP: ['VP of Sales', 'Chief Revenue Officer'],
  },
  Finance: {
    Junior: ['Financial Analyst', 'Accounting Analyst'],
    Mid: ['Finance Manager', 'Senior Financial Analyst'],
    Senior: ['Senior Finance Manager', 'FP&A Manager'],
    Lead: ['Finance Lead', 'Controller Lead'],
    Principal: ['Principal Financial Advisor'],
    Director: ['Finance Director', 'Controller'],
    VP: ['VP of Finance', 'CFO'],
  },
  Marketing: {
    Junior: ['Marketing Coordinator', 'Content Writer'],
    Mid: ['Marketing Specialist', 'Growth Marketer'],
    Senior: ['Senior Marketing Manager', 'Brand Manager'],
    Lead: ['Marketing Lead', 'Campaign Lead'],
    Principal: ['Principal Marketing Strategist'],
    Director: ['Marketing Director', 'Director of Growth'],
    VP: ['VP of Marketing', 'CMO'],
  },
  Operations: {
    Junior: ['Operations Coordinator', 'Ops Analyst'],
    Mid: ['Operations Manager', 'Process Analyst'],
    Senior: ['Senior Operations Manager'],
    Lead: ['Operations Lead'],
    Principal: ['Principal Operations Strategist'],
    Director: ['Director of Operations'],
    VP: ['VP of Operations', 'COO'],
  },
  Legal: {
    Junior: ['Legal Analyst', 'Paralegal'],
    Mid: ['Legal Counsel', 'Associate General Counsel'],
    Senior: ['Senior Legal Counsel'],
    Lead: ['Legal Lead'],
    Principal: ['Principal Counsel'],
    Director: ['Legal Director'],
    VP: ['VP of Legal', 'General Counsel'],
  },
  Product: {
    Junior: ['Associate Product Manager', 'Junior PM'],
    Mid: ['Product Manager'],
    Senior: ['Senior Product Manager'],
    Lead: ['Product Lead', 'Group PM'],
    Principal: ['Principal Product Manager'],
    Director: ['Director of Product'],
    VP: ['VP of Product', 'CPO'],
  },
  'Customer Success': {
    Junior: ['Customer Success Associate', 'CS Coordinator'],
    Mid: ['Customer Success Manager'],
    Senior: ['Senior Customer Success Manager'],
    Lead: ['CS Team Lead'],
    Principal: ['Principal CS Manager'],
    Director: ['Director of Customer Success'],
    VP: ['VP of Customer Success'],
  },
  'Data Science': {
    Junior: ['Junior Data Analyst', 'Data Analyst'],
    Mid: ['Data Scientist', 'Machine Learning Engineer'],
    Senior: ['Senior Data Scientist', 'Senior ML Engineer'],
    Lead: ['Data Science Lead', 'ML Lead'],
    Principal: ['Principal Data Scientist'],
    Director: ['Director of Data Science'],
    VP: ['VP of Data', 'Chief Data Officer'],
  },
};

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

async function seed() {
  console.log('🌱 Starting seed — 10,000 employees...');
  console.time('⏱️  Seed completed in');

  await prisma.employee.deleteMany();

  const TOTAL = 10_000;
  const BATCH_SIZE = 500;

  const levelItems = Object.keys(LEVEL_WEIGHTS);
  const levelWeights = Object.values(LEVEL_WEIGHTS);
  const employmentItems = EMPLOYMENT_TYPES;
  const employmentWeights = EMPLOYMENT_TYPE_WEIGHTS;
  const countryItems = COUNTRIES_CONFIG.map((c) => c);
  const countryWeights = COUNTRIES_CONFIG.map((c) => c.weight);

  const usedEmails = new Set<string>();
  let seeded = 0;

  for (let batch = 0; batch < TOTAL / BATCH_SIZE; batch++) {
    const data = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const globalIndex = batch * BATCH_SIZE + i + 1;

      const level = weightedRandom(levelItems, levelWeights);
      const country = weightedRandom(countryItems, countryWeights);
      const department = faker.helpers.arrayElement(DEPARTMENTS);
      const employmentType = weightedRandom(employmentItems, employmentWeights);

      const titles = JOB_TITLES[department]?.[level] ?? ['Specialist'];
      const jobTitle = faker.helpers.arrayElement(titles);

      // Generate salary in USD, then convert to local currency
      const { min, max } = BASE_SALARY_USD[level];
      const baseSalaryUSD = randomBetween(min, max);
      const baseSalary = Math.round(baseSalaryUSD * country.salaryMultiplier);
      const bonus =
        Math.random() > 0.3
          ? Math.round(baseSalary * (Math.random() * 0.2))
          : undefined;

      // Ensure unique email
      let email = faker.internet.email({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        provider: 'acmecorp.com',
      }).toLowerCase();
      let attempts = 0;
      while (usedEmails.has(email) && attempts < 10) {
        email = faker.internet.email({ provider: 'acmecorp.com' }).toLowerCase();
        attempts++;
      }
      usedEmails.add(email);

      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      // Joining date: between 10 years ago and today
      const joiningDate = faker.date.between({
        from: new Date('2015-01-01'),
        to: new Date(),
      });

      // ~5% inactive employees
      const status = Math.random() < 0.05 ? 'Inactive' : 'Active';

      // ── New fields ──────────────────────────────────────────────────────
      const allowances = Math.round(baseSalary * (0.20 + Math.random() * 0.15)); // 20-35% of base
      const epfPercent = country.name === 'India' ? 12 : 0;
      const esiPercent = (country.name === 'India' && baseSalary < 25_000) ? 0.75 : 0;
      const professionalTax = country.name === 'India' ? 200 : 0;
      const tdsPercent = (() => {
        const annualUSD = baseSalaryUSD;
        if (annualUSD < 50_000) return 0;
        if (annualUSD < 100_000) return 5;
        if (annualUSD < 150_000) return 10;
        if (annualUSD < 200_000) return 15;
        if (annualUSD < 300_000) return 20;
        return 30;
      })();

      // PAN: AAAAA0000A format
      const panNumber = `${faker.string.alpha({ length: 5, casing: 'upper' })}${faker.string.numeric(4)}${faker.string.alpha({ length: 1, casing: 'upper' })}`;

      // PF Account: AA/AAA/0000000/000/0000000
      const pfAccountNumber = `${faker.string.alpha({ length: 2, casing: 'upper' })}/${faker.string.alpha({ length: 3, casing: 'upper' })}/${faker.string.numeric(7)}/${faker.string.numeric(3)}/${faker.string.numeric(7)}`;

      const bankNames = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'Chase', 'Bank of America', 'Barclays', 'Deutsche Bank'];
      const bankName = faker.helpers.arrayElement(bankNames);
      const bankAccountNumber = `XXXX${faker.string.numeric(4)}`;

      data.push({
        employeeId: `EMP-${String(globalIndex).padStart(5, '0')}`,
        firstName,
        lastName,
        email,
        department,
        jobTitle,
        jobLevel: level,
        employmentType,
        country: country.name,
        currency: country.currency,
        baseSalary,
        bonus: bonus ?? null,
        joiningDate,
        status,
        // New fields
        dateOfBirth: faker.date.birthdate({ min: 25, max: 55, mode: 'age' }),
        fatherName: faker.person.firstName('male') + ' ' + faker.person.lastName(),
        panNumber,
        mobile: `+91 ${faker.string.numeric(5)} ${faker.string.numeric(5)}`,
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} - ${faker.location.zipCode()}`,
        pfAccountNumber,
        epfPercent,
        esiPercent,
        professionalTax,
        tdsPercent,
        allowances,
        bankName,
        bankAccountNumber,
        paymentMode: 'Bank Transfer',
      });
    }

    await prisma.employee.createMany({ data });
    seeded += data.length;
    process.stdout.write(`\r  Seeded ${seeded.toLocaleString()} / ${TOTAL.toLocaleString()} employees...`);
  }

  console.log('\n✅ Seed complete!');
  console.timeEnd('⏱️  Seed completed in');

  // Print a summary
  const counts = await prisma.employee.groupBy({
    by: ['country'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });
  console.log('\n📊 Employees by country:');
  counts.forEach((c) => console.log(`  ${c.country}: ${c._count.id}`));
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
