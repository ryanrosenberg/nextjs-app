import Layout from "../../../../../components/Layout";
import TossupCategoryTable from "../../../../../components/TossupCategoryTable";
import { TossupCategory, Tournament } from "../../../../../types";
import { sql, getTossupCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const tournaments = await sql.query(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    let [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Players - Buzzpoints App`,
        description: `Category leaderboard for ${tournament!.name}`,
    };
}

export default async function CategoryTossupPage(props: { params: Promise<{ slug: string, category: string }> }) {
    const params = await props.params;
    const [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const tossupCategoryStats = await sql.query(getTossupCategoryStatsQuery, [tournament!.id]) as TossupCategory[];

    return <Layout tournament={tournament}>
        <TossupCategoryTable tossupCategoryStats={tossupCategoryStats} />
    </Layout>
}
