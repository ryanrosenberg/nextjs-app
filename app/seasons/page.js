import SeasonsIndex from "./seasons-index";
import { db } from "@vercel/postgres";

export async function getData() {
  const client = await db.connect();
  const data = await client.sql`
  SELECT * from ((SELECT distinct champions.year from champions
    WHERE champions.year not in ('08-09', '09-10', '10-11')) champions
    LEFT JOIN (select year, school as "ACF Nationals" from champions where tournament = 'ACF Nationals') nats
    on champions.year = nats.year
    LEFT JOIN (select year, school as "DI ICT" from champions where tournament = 'DI ICT') ict
    on champions.year = ict.year)
    order by 1
    `;

  const res = data.rows.map((en) => {
    en["year"] = `<a href = '/seasons/${en["year"]}'>${en["year"]}</a>`;
    return en;
  });

  return {
    props: {
      result: res,
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
