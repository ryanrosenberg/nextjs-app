import BonusDisplay from "../../../../../components/BonusDisplay";
import Layout from "../../../../../components/Layout";
import { Bonus, BonusDirect, BonusPart, Round, Tournament } from "../../../../../types";
import { getNavOptions, removeTags, shortenAnswerline } from "../../../../../lib/jordan_utils";
import { get, all, getBonusesByTournamentQuery, getTournamentBySlugQuery, getTournamentsQuery, getBonusPartsQuery, getDirectsByBonusQuery, getRoundsForTournamentQuery } from "../../../../../lib/queries";
import { Metadata } from "next";

export const generateStaticParams = () => {
    const tournaments = all<Tournament[]>(getTournamentsQuery);
    const paths = [];

    for (let { id, slug } of tournaments) {
        const bonuses = getBonusesByTournamentQuery.all(id) as Bonus[];

        for (let { id } of bonuses) {
            paths.push({
                slug,
                id: String(id)
            });
        }
    }

    return paths;
}

export async function generateMetadata({ params }: { params: { slug:string, id:string }}): Promise<Metadata> {
    const tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    const bonusParts = getBonusPartsQuery.all(tournament.id, params.id) as BonusPart[];
    
    return {
        title: `${removeTags(shortenAnswerline(bonusParts[0].answer))} - ${tournament.name} - Buzzpoints App`,
        description: `Bonus data for ${tournament!.name}`,
    };
}

export default function BonusPage({ params }: { params: { slug:string, id:string }}) {
    const tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    const parts = getBonusPartsQuery.all(tournament.id, params.id) as BonusPart[];
    const directs = getDirectsByBonusQuery.all(parts[0].id, tournament.id) as BonusDirect[];
    const navOptions = getNavOptions(parseInt(params.id));

    return (
        <Layout tournament={tournament}>
            <BonusDisplay 
                parts={parts} 
                directs={directs} 
                tournament={tournament} 
                navOptions={navOptions}
            />
        </Layout>
    );
}