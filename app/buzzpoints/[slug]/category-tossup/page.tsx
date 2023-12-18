import Layout from "../../../../components/Layout";
import TossupCategoryTable from "../../../../components/TossupCategoryTable";
import { TossupCategory, Tournament } from "../../../../types";
import { sql, getTossupCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const tournaments = await sql(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Players - Buzzpoints App`,
        description: `Category leaderboard for ${tournament!.name}`,
    };
}

export default async function CategoryTossupPage({ params }: { params: { slug: string, category: string } }) {
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const tossupCategoryStats = await sql(getTossupCategoryStatsQuery, [tournament!.id]) as TossupCategory[];

    return <Layout tournament={tournament}>
        <TossupCategoryTable tossupCategoryStats={tossupCategoryStats} />
    </Layout>
}
