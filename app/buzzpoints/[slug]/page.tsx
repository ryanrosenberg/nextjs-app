import Link from "next/link";
import TournamentSummary from "../../../components/TournamentSummary";
import TossupCategoryTable from "../../../components/TossupCategoryTable";
import Layout from "../../../components/Layout";
import { get, getBonusCategoryStatsQuery, getQuestionSetQuery, getTossupCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../lib/queries";
import { Metadata } from "next";
import { BonusCategory, QuestionSet, TossupCategory, Tournament } from "../../../types";
import BonusCategoryTable from "../../../components/BonusCategoryTable";
import styles from "../buzzpoints.module.css"

export async function generateStaticParams() {
    const tournaments = getTournamentsQuery.all() as Tournament[];

    return tournaments.map(({ slug }) => ({ slug: '2023-bhsu' }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    console.log(tournament);
    

    return {
        title: `${tournament.name} - Buzzpoints App`,
        description: `Category conversion data for ${tournament!.name}`,
    };
}

export default function Tournament({ params }: { params: { slug: string } }) {
    const tournament = get<Tournament>(getTournamentBySlugQuery, params.slug);
    const tossupCategoryStats = getTossupCategoryStatsQuery.all(tournament.question_set_id) as TossupCategory[];
    const bonusCategoryStats = getBonusCategoryStatsQuery.all(tournament.question_set_id) as BonusCategory[];
    const startDate = new Date(tournament.start_date).toLocaleDateString("en-US");
    
    return (
        <Layout tournament={tournament}>
            <h2 className="page-title">{tournament.name}</h2>
            <h2 className="page-subtitle">{startDate}</h2>
            <div className={styles.tournamentFlex}>
                <div className="md:basis-1/2">
                    <h2>Tossups</h2>
                    <p className="mb-2"><Link href={`/buzzpoints/${tournament.slug}/tossup`} className="underline">View all tossups</Link></p>
                    <TossupCategoryTable tossupCategoryStats={tossupCategoryStats} />
                </div>
                <div className="md:basis-1/2">
                    <h2>Bonuses</h2>
                    <p className="mb-2"><Link href={`/buzzpoints/${tournament.slug}/bonus`} className="underline">View all bonuses</Link></p>
                    <BonusCategoryTable bonusCategoryStats={bonusCategoryStats}/>
                </div>
            </div>
        </Layout>
    );
}