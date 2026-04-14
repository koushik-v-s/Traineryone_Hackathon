import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────────────────
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/** Bell-curve-ish score: avg ≈ 3.3 */
function bellCurveScore(): number {
  const r = (Math.random() + Math.random() + Math.random()) / 3;
  return +(1 + r * 4).toFixed(1);
}
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function fmtDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

// ── Reference data ──────────────────────────────────────────────────
const LOCATIONS = ["New York", "San Francisco", "London", "Bangalore", "Singapore"];
const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Product", "Design", "Finance"];
const JOB_TITLES: Record<string, string[]> = {
  Engineering: ["Junior Developer", "Senior Developer", "Engineering Manager"],
  Marketing: ["Marketing Lead"],
  Sales: ["Sales Executive"],
  HR: ["HR Manager"],
  Product: ["Product Manager"],
  Design: ["UX Designer"],
  Finance: ["Finance Analyst"],
};
const COMP_RANGES: Record<string, [number, number]> = {
  "Junior Developer": [55_000, 85_000],
  "Senior Developer": [100_000, 160_000],
  "Engineering Manager": [140_000, 200_000],
  "Marketing Lead": [80_000, 130_000],
  "Sales Executive": [60_000, 110_000],
  "HR Manager": [75_000, 120_000],
  "Product Manager": [110_000, 170_000],
  "UX Designer": [80_000, 135_000],
  "Finance Analyst": [70_000, 115_000],
  "Data Analyst": [75_000, 120_000],
};

interface CourseRecord {
  course_id: string;
  title: string;
  topic: string;
  completed_date: string;
  score: number;
}

const COURSES = [
  { course_id: "C001", title: "Leadership Fundamentals", topic: "Leadership" },
  { course_id: "C002", title: "Data Analysis with Python", topic: "Technical" },
  { course_id: "C003", title: "Effective Communication", topic: "Communication" },
  { course_id: "C004", title: "Workplace Compliance 101", topic: "Compliance" },
  { course_id: "C005", title: "Advanced Analytics & BI", topic: "Analytics" },
  { course_id: "C006", title: "People Management Mastery", topic: "Management" },
  { course_id: "C007", title: "Emotional Intelligence at Work", topic: "Soft Skills" },
  { course_id: "C008", title: "Cloud Architecture Basics", topic: "Technical" },
  { course_id: "C009", title: "Strategic Leadership", topic: "Leadership" },
  { course_id: "C010", title: "Negotiation Skills", topic: "Communication" },
  { course_id: "C011", title: "Data Privacy & GDPR", topic: "Compliance" },
  { course_id: "C012", title: "Team Building Essentials", topic: "Soft Skills" },
  { course_id: "C013", title: "Financial Modelling", topic: "Analytics" },
  { course_id: "C014", title: "Agile Project Management", topic: "Management" },
  { course_id: "C015", title: "React & TypeScript Mastery", topic: "Technical" },
];

const FIRST_NAMES = [
  "Aarav","Priya","James","Sofia","Liam","Mei","Carlos","Fatima","Oliver","Ananya",
  "Ethan","Yuki","Noah","Isabella","Ravi","Chloe","Aiden","Sakura","Lucas","Zara",
  "Benjamin","Nadia","Daniel","Kavya","Alexander","Elena","Samuel","Aisha","William","Mia",
  "Arjun","Emma","Ryan","Leila","Nathan","Sanya","Dylan","Hana","Tyler","Rina",
  "Marcus","Shreya","Jordan","Lily","Kevin","Nisha","Derek","Tara","Victor","Jade",
  "Ian","Simone","Oscar","Freya","Hugo","Devi"
];
const LAST_NAMES = [
  "Patel","Johnson","Tanaka","Garcia","Smith","Chen","Kumar","Williams","Nakamura","Khan",
  "Brown","Singh","Martinez","Lee","Davis","Sharma","Anderson","Yamamoto","Taylor","Gupta",
  "Wilson","Rao","Thomas","Suzuki","Moore","Iyer","Jackson","Sato","Harris","Nair",
  "Clark","Reddy","Lewis","Wong","Walker","Joshi","Hall","Kim","Young","Mehta",
  "Allen","Das","Wright","Park","Scott","Bhat","Green","Lim","Baker","Chopra",
  "Adams","Dutta","Nelson","Tan","Hill","Verma"
];

function generateCourses(): CourseRecord[] {
  const count = randBetween(1, 6);
  const selected = new Set<number>();
  while (selected.size < count) {
    selected.add(randBetween(0, COURSES.length - 1));
  }
  return [...selected].map((i) => {
    const c = COURSES[i];
    return {
      course_id: c.course_id,
      title: c.title,
      topic: c.topic,
      completed_date: fmtDate(randomDate(new Date("2023-01-01"), new Date("2025-12-31"))),
      score: randBetween(60, 100),
    };
  });
}

// ── Main seed ────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  Seeding database …");

  await prisma.employee.deleteMany();

  const usedEmails = new Set<string>();

  const employees = Array.from({ length: 55 }, () => {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const name = `${firstName} ${lastName}`;

    let email: string;
    let attempt = 0;
    do {
      const suffix = attempt === 0 ? "" : `${attempt}`;
      email = `${firstName.toLowerCase()}${suffix}.${lastName.toLowerCase()}@company.io`;
      attempt++;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const dept = pick(DEPARTMENTS);
    const titlePool = JOB_TITLES[dept] ?? ["Data Analyst"];
    const jobTitle = pick(titlePool);
    const [minComp, maxComp] = COMP_RANGES[jobTitle] ?? [60_000, 100_000];

    return {
      name,
      email,
      job_title: jobTitle,
      department: dept,
      location: pick(LOCATIONS),
      performance_score: bellCurveScore(),
      compensation_usd: randBetween(minComp, maxComp),
      hire_date: randomDate(new Date("2018-01-01"), new Date("2025-06-01")),
      courses_taken: JSON.stringify(generateCourses()), // SQLite: store as JSON string
    };
  });

  for (const emp of employees) {
    await prisma.employee.create({ data: emp });
  }

  console.log(`✅  Seeded ${employees.length} employees.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
