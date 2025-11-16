import Link from "next/link";
import TossupCategoryTable from "../../../../components/TossupCategoryTable";
import Layout from "../../../../components/Layout";
import { sql, getBonusCategoryStatsQuery, getQuestionSetQuery, getTossupCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../lib/queries";
import { Metadata } from "next";
import { BonusCategory, QuestionSet, TossupCategory, type Tournament } from "../../../../types";
import BonusCategoryTable from "../../../../components/BonusCategoryTable";
import styles from "../../buzzpoints.module.css"

export async function generateStaticParams() {
    const tournaments = await sql.query(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    let [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} - Buzzpoints App`,
        description: `Category conversion data for ${tournament!.name}`,
    };
}

export default async function Tournament(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[] as Tournament[];
    const [questionSet] = await sql.query(getQuestionSetQuery, [tournament.question_set_edition_id]) as QuestionSet[];
    const tossupCategoryStats = await sql.query(getTossupCategoryStatsQuery, [tournament.id]) as TossupCategory[];
    const bonusCategoryStats = await sql.query(getBonusCategoryStatsQuery, [tournament.id]) as BonusCategory[];
    const startDate = new Date(tournament.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });


    return (
        <Layout tournament={tournament}>
            <h2 className="page-title">{tournament.name}</h2>
            <h2 className="page-subtitle">{startDate}</h2>
            <div className="flex flex-col md:flex-row md:space-x-10 mt-5">
                <div className={styles.tournamentFlex}>
                    <div className="md:basis-1/2">
                        <h2>Tossups</h2>
                        <p className="mb-2"><Link href={`/buzzpoints/tournament/${tournament.slug}/tossup`} className="underline">View all tossups</Link></p>
                        <TossupCategoryTable tossupCategoryStats={tossupCategoryStats} />
                    </div>
                    <div className="md:basis-1/2">
                        <h2>Bonuses</h2>
                        <p className="mb-2"><Link href={`/buzzpoints/tournament/${tournament.slug}/bonus`} className="underline">View all bonuses</Link></p>
                        <BonusCategoryTable bonusCategoryStats={bonusCategoryStats} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// return (
//     <Layout tournament={tournament}>
//         <h2 className="page-title">{tournament.name}</h2>
//         <h2 className="page-subtitle">{startDate}</h2>
//         <div className={styles.tournamentFlex}>
//             <div className="md:basis-1/2">
//                 <h2>Tossups</h2>
//                 <p className="mb-2"><Link href={`/buzzpoints/${tournament.slug}/tossup`} className="underline">View all tossups</Link></p>
//                 <TossupCategoryTable tossupCategoryStats={tossupCategoryStats} />
//             </div>
//             <div className="md:basis-1/2">
//                 <h2>Bonuses</h2>
//                 <p className="mb-2"><Link href={`/buzzpoints/${tournament.slug}/bonus`} className="underline">View all bonuses</Link></p>
//                 <BonusCategoryTable bonusCategoryStats={bonusCategoryStats}/>
//             </div>
//         </div>
//     </Layout>