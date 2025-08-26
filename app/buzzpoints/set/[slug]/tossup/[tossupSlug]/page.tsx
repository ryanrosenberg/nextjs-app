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
    return [];
}

export async function generateMetadata(props: { params: Promise<{ slug:string, tossupSlug:string }>}): Promise<Metadata> {
    const params = await props.params;
    const [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]) as QuestionSet[];
    const [tossup] = await sql(getTossupForSetDetailQuery, [questionSet.id, params.tossupSlug]) as Tossup[];

    return {
        title: `${tossup.answer_primary} - ${questionSet.name} - Buzzpoints App`,
        description: `Tossup data for ${questionSet!.name}`,
    };
}

export default async function TossupPage(props: { params: Promise<{ slug:string, tossupSlug:string }>}) {
    const params = await props.params;
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