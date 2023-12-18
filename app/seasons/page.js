import SeasonsIndex from "./seasons-index";
import { neon } from '@neondatabase/serverless';

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`
  SELECT * from ((SELECT distinct champions.year from champions
    WHERE champions.year not in ('08-09', '09-10', '10-11')) champions
    LEFT JOIN (select year, school as "ACF Nationals" from champions where tournament = 'ACF Nationals') nats
    on champions.year = nats.year
    LEFT JOIN (select year, school as "DI ICT" from champions where tournament = 'DI ICT') ict
    on champions.year = ict.year)
    order by 1
    `;

  return {
    props: {
      result: data,
    },
  };
}

export const metadata = {
  title: "Seasons | College Quizbowl Stats",
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <SeasonsIndex result={pageData} />;
}
