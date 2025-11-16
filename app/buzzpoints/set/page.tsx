import { sql, getQuestionSetsQuery } from "../../../lib/queries";
import Layout from "../../../components/Layout";
import QuestionSetSummary from "../../../components/QuestionSetSummary";
import { QuestionSet } from "../../../types";

export default async function QuestionSetHome() {
  const questionSets: QuestionSet[] = await sql.query(getQuestionSetsQuery) as QuestionSet[];
  
  return (
    <Layout>
      <h3 className="text-2xl font-bold my-5">Recent Question Sets</h3>
      <QuestionSetSummary
        questionSets={questionSets}
      />
    </Layout>
  );
}