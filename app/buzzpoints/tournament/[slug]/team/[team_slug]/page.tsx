import BonusCategoryTable from "../../../../../../components/BonusCategoryTable";
import Layout from "../../../../../../components/Layout";
import { sql, getTeamsByTournamentQuery, getTeamCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../../lib/queries";
import { Metadata } from "next";
import { BonusCategory, Team, Tournament } from "../../../../../../types";

export async function generateStaticParams() {
    return [];
    // const tournaments = await sql(getTournamentsQuery) as Tournament[];
    // const paths = [];

    // for (let { id, slug } of tournaments) {
    //     const teams = await sql(getTeamsByTournamentQuery, [id]) as Team[];
    //     for (const { slug: team_slug } of teams) {
    //         paths.push({
    //             slug,
    //             team_slug
    //         });
    //     }
    // }

    // return paths;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} - Buzzpoints App`,
        description: `Team category data for ${tournament!.name}`,
    };
}

export default async function TeamPage({ params }: { params: { slug: string, team_slug: string } }) {
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const bonusTeamCategoryStats = await sql(getTeamCategoryStatsQuery, [tournament.id, params.team_slug]) as BonusCategory[];

    return (
        <Layout tournament={tournament}>
            <h3 className="page-title">{bonusTeamCategoryStats[0]?.name || 'N/A'}</h3>
            <h3 className="page-subtitle">{bonusTeamCategoryStats[0]?.players || 'N/A'}</h3>
            <br/>
            <BonusCategoryTable bonusCategoryStats={bonusTeamCategoryStats} />
        </Layout>
    );
}
