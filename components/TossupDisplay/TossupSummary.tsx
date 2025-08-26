import { type TossupSummary, Tournament } from "../../types";
import { formatDecimal, formatPercent } from "../../lib/utils";
import NormalTable from "../normal_table";

type TossupSummaryProps = {
    tournament?: Tournament;
    tossupSummary: TossupSummary[]
}
export default function TossupSummary({ tournament, tossupSummary }: TossupSummaryProps) {
    let columns = [
        {
            accessor: 'tournament_name',
            Header: 'Tournament',
            linkTemplate: "/buzzpoints/tournament/{{tournament_slug}}/tossup/{{round_number}}/{{question_number}}"
        },
        {
            accessor: 'edition',
            Header: 'Edition',
            defaultSort: "asc" as const,
            linkTemplate: "/buzzpoints/set/{{set_slug}}/tossup/{{question_slug}}"
        },
        { accessor: 'exact_match', Header: 'Exact Match?' },
        { accessor: 'tuh', Header: 'TUH' },
        { accessor: 'conversion_rate', Header: 'Conv. %', format: formatPercent },
        { accessor: 'power_rate', Header: 'Power %', format: formatPercent },
        { accessor: 'neg_rate', Header: 'Neg %', format: formatPercent },
        { accessor: 'average_buzz', Header: 'Average Buzz', format: formatDecimal }
    ];

    return <div className="my-3 mt-3">
        <NormalTable columns={columns} data={tossupSummary}
            // rowProperties={item => ({
            //     className: item.tournament_id === tournament?.id ? "highlighted-row zero" : ""
            // })}
        />
    </div>;
}