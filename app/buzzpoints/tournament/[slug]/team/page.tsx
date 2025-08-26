import Layout from "../../../../../components/Layout";
import { TeamTable } from "../../../../../components/common/TeamTable";
import { Tossup, Tournament } from "../../../../../types";
import { sql, getTeamLeaderboard, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const tournaments = await sql(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Teams - Buzzpoints App`,
        description: `Team data for ${tournament!.name}`,
    };
}

export default async function TeamPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const teams = await sql(getTeamLeaderboard, [tournament!.id, tournament!.id]) as Tossup[];

    return <Layout tournament={tournament}>
        <TeamTable teams={teams} />
    </Layout>
}
