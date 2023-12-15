import SetsIndex from "./sets-index";
import { db } from "@vercel/postgres";

export const dynamicParams = false;

export async function getData() {
  const client = await db.connect();
  const data = await client.sql`
  SELECT 
  sets.\"set\",
  case sets.difficulty 
  when 'easy' then 1
  when 'medium' then 2
  when 'regionals' then 3
  when 'nationals' then 4 end as difficulty,
  sets.set_slug as set_slug,
  sets.year as Season,
  editors.category,
  string_agg(distinct editor, '; ') as editors,
  string_agg(distinct people.slug, '; ') as slugs,
  string_agg(subcategory, '; ') as subcats
  from editors
  left join sets on editors.set_id = sets.set_id
  left join people on editors.person_id = people.person_id
  GROUP BY 1, 2, 3, 4, 5
  ORDER BY Season desc, difficulty
    `;

  return {
    props: {
      result: data.rows,
    },
  };
}

export const metadata = {
  title: "Sets | College Quizbowl Stats",
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <SetsIndex result={pageData} />;
}
