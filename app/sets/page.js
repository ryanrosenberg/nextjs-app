import SetsIndex from "./sets-index";
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export const dynamicParams = false;

export async function getData() {
  console.log(process.env.DATABASE_URL);
  const data = await sql`
  SELECT 
  sets."set",
  case sets.difficulty 
  when 'easy' then 1
  when 'medium' then 2
  when 'regionals' then 3
  when 'nationals' then 4 end as difficulty,
  sets.set_slug as set_slug,
  sets.year as Season,
  editors.category,
  string_agg(editor || ',,' || people.slug || ',,' || subcategory, '; ') as editors
  from 
  (SELECT set_id, category, person_id, editor, string_agg(subcategory, ', ') as subcategory from editors group by 1, 2, 3, 4) editors
  left join sets on editors.set_id = sets.set_id
  left join people on editors.person_id = people.person_id
  GROUP BY 1, 2, 3, 4, 5
  ORDER BY Season desc, difficulty
    `;

  return {
    props: {
      result: data,
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
