import Layout from "../../../../components/Layout";
import { TossupTable } from "../../../../components/common/TossupTable";
import { Tossup, Tournament } from "../../../../types";
import { get, getTossupsByTournamentQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../lib/queries";
import { Metadata } from "next";

export const generateStaticParams = () => {
    const tournaments: Tournament[] = getTournamentsQuery.all() as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);

    return {
        title: `${tournament.name} Tossups - Buzzpoints App`,
        description: `Tossup data for ${tournament!.name}`,
    };
}

export default function TossupPage({ params }: { params: { slug: string } }) {
    const tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    const tossups = getTossupsByTournamentQuery.all(tournament.question_set_id) as Tossup[];

    return <Layout tournament={tournament}>
        <TossupTable tossups={tossups} />
    </Layout>
}