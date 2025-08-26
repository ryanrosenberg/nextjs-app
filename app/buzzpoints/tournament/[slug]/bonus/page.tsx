import Layout from "../../../../../components/Layout";
import { sql, getBonusesByTournamentQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../lib/queries";
import { Bonus, Tournament } from "../../../../../types";
import { BonusTable } from "../../../../../components/common/BonusTable";
import { Metadata } from "next";

export async function generateStaticParams() {
    const tournaments = await sql(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Bonuses - Buzzpoints App`,
        description: `Bonus data for ${tournament!.name}`,
    };
}

export default async function BonusesPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const bonuses = await sql(getBonusesByTournamentQuery, [tournament!.id]) as Bonus[];

    return (
        <Layout tournament={tournament}>
            <BonusTable bonuses={bonuses} />
        </Layout>
    );
}