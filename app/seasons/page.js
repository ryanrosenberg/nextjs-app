import SeasonsIndex from "./seasons-index";
import { neon } from '@neondatabase/serverless';

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`
  SELECT champions.year, nats."ACF Nationals", ict."DI ICT", ug."Undergrad", bsqc."BSQC"
   from ((SELECT distinct sets.year from sets
    WHERE sets.year not in ('98-99', '99-00', '00-01', '01-02', '02-03', 
    '03-04', '04-05', '05-06', '06-07', '07-08', '08-09', '09-10', '10-11')
    and sets.year is not null) champions
    LEFT JOIN (select year, school as "ACF Nationals" from champions where tournament = 'ACF Nationals') nats
    on champions.year = nats.year
    LEFT JOIN (select year, school as "DI ICT" from champions where tournament = 'DI ICT') ict
    on champions.year = ict.year
    LEFT JOIN (select year, school as "Undergrad" from champions where tournament = 'UG Champs') ug
    on champions.year = ug.year
    LEFT JOIN (select year, school as "BSQC" from champions where tournament = 'BSQC') bsqc
    on champions.year = bsqc.year)
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
