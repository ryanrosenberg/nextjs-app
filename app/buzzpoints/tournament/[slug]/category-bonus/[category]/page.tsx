import TeamCategoryTable from "../../../../../../components/TeamCategoryTable";
import Layout from "../../../../../../components/Layout";
import { sql, getCategoriesForTournamentQuery, getTeamCategoryLeaderboard, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../../lib/queries";
import { Metadata } from "next";
import { BonusCategory, Tournament } from "../../../../../../types";

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
        title: `${tournament.name} - Buzzpoints App`,
        description: `Team category data for ${tournament!.name}`,
    };
}

export default async function TeamPage(props: { params: Promise<{ slug: string, category: string }> }) {
    const params = await props.params;
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const bonusTeamCategoryStats = await sql(getTeamCategoryLeaderboard, [tournament.id, params.category]) as BonusCategory[];

    return (
        <Layout tournament={tournament}>
            <h3 className="text-xl text-center mb-3"><b>{bonusTeamCategoryStats[0]?.category || "N/A"}</b></h3>
            <TeamCategoryTable bonusCategoryStats={bonusTeamCategoryStats} />
        </Layout>
    );
}
