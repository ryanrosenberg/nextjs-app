import BonusCategoryTable from "../../../../../components/BonusCategoryTable";
import Layout from "../../../../../components/Layout";
import { get, getTeamsByTournamentQuery, getTeamCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../lib/queries";
import { Metadata } from "next";
import { BonusCategory, Team, Tournament } from "../../../../../types";

export async function generateStaticParams() {
    const tournaments = getTournamentsQuery.all() as Tournament[];
    const paths = [];

    for (let { id, slug } of tournaments) {
        const teams = getTeamsByTournamentQuery.all(id) as Team[];
        for (const { slug: team_slug } of teams) {
            paths.push({
                slug,
                team_slug
            });
        }
    }

    return paths;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);

    return {
        title: `${tournament.name} - Buzzpoints App`,
        description: `Team category data for ${tournament!.name}`,
    };
}

export default function TeamPage({ params }: { params: { slug: string, team_slug: string } }) {
    const tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    const bonusTeamCategoryStats = getTeamCategoryStatsQuery.all(tournament.id, params.team_slug) as BonusCategory[];

    return (
        <Layout tournament={tournament}>
            <h3 className="page-title">{bonusTeamCategoryStats[0]?.name || 'N/A'}</h3>
            <br/>
            <BonusCategoryTable bonusCategoryStats={bonusTeamCategoryStats} />
        </Layout>
    );
}
