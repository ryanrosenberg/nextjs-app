import Layout from "../../../../../../components/Layout";
import { get, getBuzzesByTossupQuery, getRoundsForTournamentQuery, getTossupForDetailQuery, getTossupsByTournamentQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../../lib/queries";
import { Buzz, Round, Tossup, Tournament } from "../../../../../../types";
import TossupDisplay from "../../../../../../components/TossupDisplay";
import { Metadata } from "next";
import { getNavOptions, removeTags, shortenAnswerline } from "../../../../../../lib/jordan_utils";

export const generateStaticParams = () => {
    const tournaments: Tournament[] = getTournamentsQuery.all() as Tournament[];
    const paths = [];

    for (let { id, slug } of tournaments) {
        const tossups: Tossup[] = getTossupsByTournamentQuery.all(id) as Tossup[];

        for (let { round, question_number } of tossups) {
            paths.push({
                slug,
                round: String(round),
                number: String(question_number)
            });
        }
    }

    return paths;
}

export async function generateMetadata({ params }: { params: { slug:string, round:string, number:string }}): Promise<Metadata> {
    const tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    const tossup = getTossupForDetailQuery.get(tournament.id, params.round, params.number) as Tossup;

    return {
        title: `${removeTags(shortenAnswerline(tossup.answer))} - ${tournament.name} - Buzzpoints App`,
        description: `Tossup data for ${tournament!.name}`,
    };
}

export default function TossupPage({ params }: { params: { slug:string, round:string, number:string }}) {
    const tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    const tossup = getTossupForDetailQuery.get(tournament.id, params.round, params.number) as Tossup;
    const buzzes = getBuzzesByTossupQuery.all(tossup.id, tournament.id) as Buzz[];
    const tournamentRounds = getRoundsForTournamentQuery.all(tournament.id) as Round[];
    const navOptions = getNavOptions(parseInt(params.round), parseInt(params.number), tournamentRounds);

    return (
        <div>
            <Layout tournament={tournament}>
                <TossupDisplay 
                    tossup={tossup} 
                    buzzes={buzzes} 
                    tournament={tournament} 
                    navOptions={navOptions}
                />
            </Layout>
        </div>
    );
}