import Layout from "../../../../../../components/Layout";
import { sql, 
    getAllBuzzesByTossupQuery, 
    getQuestionSetBySlugQuery, 
    getQuestionSetsQuery, 
    getTossupForSetDetailQuery, 
    getTossupSummaryBySite, 
    getTossupsByQuestionSetQuery } from "../../../../../../lib/queries";
import { Buzz, QuestionSet, Tossup, TossupSummary } from "../../../../../../types";
import TossupDisplay from "../../../../../../components/TossupDisplay";
import { Metadata } from "next";

export async function generateStaticParams() {
    const questionSets: QuestionSet[] = await sql(getQuestionSetsQuery) as QuestionSet[];
    const paths = [];

    for (let { id, slug } of questionSets) {
        const tossups: Tossup[] = await sql(getTossupsByQuestionSetQuery, [id]) as Tossup[];

        for (let { slug: tossupSlug } of tossups) {
            paths.push({
                slug,
                tossupSlug
            });
        }
    }

    return paths;
}

export async function generateMetadata({ params }: { params: { slug:string, tossupSlug:string }}): Promise<Metadata> {
    const [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]) as QuestionSet[];
    const [tossup] = await sql(getTossupForSetDetailQuery, [questionSet.id, params.tossupSlug]) as Tossup[];

    return {
        title: `${tossup.answer_primary} - ${questionSet.name} - Buzzpoints App`,
        description: `Tossup data for ${questionSet!.name}`,
    };
}

export default async function TossupPage({ params }: { params: { slug:string, tossupSlug:string }}) {
    const [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]) as QuestionSet[];
    const [tossup] = await sql(getTossupForSetDetailQuery, [questionSet.id, params.tossupSlug]) as Tossup[];
    const buzzes = await sql(getAllBuzzesByTossupQuery, [tossup.id]) as Buzz[];
    const tossupSummary = await sql(getTossupSummaryBySite,[
        tossup.id, 
        questionSet.id, 
        tossup.metadata, 
        tossup.answer_primary, 
        tossup.question
    ]) as TossupSummary[];

    return (
        <div>
            <Layout questionSet={questionSet}>
                <TossupDisplay 
                    tossup={tossup} 
                    buzzes={buzzes} 
                    tossupSummary={tossupSummary}
                />
            </Layout>
        </div>
    );
}