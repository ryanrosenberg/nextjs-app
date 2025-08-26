import Layout from "../../../../../../components/Layout";
import { PlayerTable } from "../../../../../../components/common/PlayerTable";
import { Tossup, Tournament } from "../../../../../../types";
import { sql, getCategoriesForTournamentQuery, getPlayerCategoryLeaderboard, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    return [];
    // const tournaments = await sql(getTournamentsQuery) as Tournament[];
    // const paths = [];
    // for (const tournament of tournaments) {
    //     const categories = await sql(getCategoriesForTournamentQuery, [tournament.id]) as any[];
    //     for (const { category_slug } of categories) {
    //         if (category_slug) {
    //             paths.push({
    //                 slug: tournament.slug,
    //                 category: category_slug
    //             });
    //         }
    //     }
    // }

    // return paths;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Players - Buzzpoints App`,
        description: `Category leaderboard for ${tournament!.name}`,
    };
}

export default async function CategoryTossupPage(props: { params: Promise<{ slug: string, category: string }> }) {
    const params = await props.params;
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const players = await sql(getPlayerCategoryLeaderboard, [tournament!.id, tournament!.id, params.category]) as Tossup[];

    return <Layout tournament={tournament}>
        <h3 className="text-xl text-center mb-3"><b>{players[0]?.category || "N/A"}</b></h3>
        <PlayerTable players={players} />
    </Layout>
}
