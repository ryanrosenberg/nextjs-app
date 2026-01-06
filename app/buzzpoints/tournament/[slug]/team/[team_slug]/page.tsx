import BonusCategoryTable from "../../../../../../components/BonusCategoryTable";
import Layout from "../../../../../../components/Layout";
import { sql, getTeamCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../../lib/queries";
import { Metadata } from "next";
import { BonusCategory, Team, Tournament } from "../../../../../../types";

export async function generateStaticParams() {
    return [];
    // const tournaments = await sql.query(getTournamentsQuery) as Tournament[];
    // const paths = [];

    // for (let { id, slug } of tournaments) {
    //     const teams = await sql.query(getTeamsByTournamentQuery, [id]) as Team[];
    //     for (const { slug: team_slug } of teams) {
    //         paths.push({
    //             slug,
    //             team_slug
    //         });
    //     }
    // }

    // return paths;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    let [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} - Buzzpoints App`,
        description: `Team category data for ${tournament!.name}`,
    };
}

export default async function TeamPage(props: { params: Promise<{ slug: string, team_slug: string }> }) {
    const params = await props.params;
    const [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const bonusTeamCategoryStats = await sql.query(getTeamCategoryStatsQuery, [tournament.id, params.team_slug]) as BonusCategory[];

    return (
        <Layout tournament={tournament}>
            <h3 className="page-title">{bonusTeamCategoryStats[0]?.name || 'N/A'}</h3>
            <h3 className="page-subtitle">{bonusTeamCategoryStats[0]?.players || 'N/A'}</h3>
            <br/>
            <BonusCategoryTable bonusCategoryStats={bonusTeamCategoryStats} />
        </Layout>
    );
}
