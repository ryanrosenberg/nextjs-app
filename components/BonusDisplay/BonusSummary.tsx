"use client";

import { BonusSummary, Tournament } from "../../types";
import { formatDecimal, formatPercent } from "../../lib/utils";
import NormalTable from "../normal_table";

type BonusSummaryProps = {
    tournament?: Tournament;
    bonusSummary: BonusSummary[]
}

export default function BonusSummary({ tournament, bonusSummary }: BonusSummaryProps) {
    let columns = [
        {
            accessor: 'tournament_name',
            Header: 'Tournament',
            linkTemplate: "/buzzpoints/tournament/{{tournament_slug}}/bonus/{{round_number}}/{{question_number}}"
        },
        {
            accessor: 'edition',
            Header: 'Edition',
            defaultSort: "asc" as const,
            linkTemplate: "/buzzpoints/set/{{set_slug}}/bonus/{{question_slug}}"
        },
        { accessor: 'exact_match', Header: 'Exact Match?' },
        { accessor: 'heard', Header: 'Heard' },
        { accessor: 'ppb', Header: 'PPB', format: formatDecimal },
        { accessor: 'easy_conversion', Header: 'Easy %', format: formatPercent },
        { accessor: 'medium_conversion', Header: 'Medium %', format: formatPercent },
        { accessor: 'hard_conversion', Header: 'Hard %', format: formatPercent },
    ];

    return <div className="my-3 mt-3">
        <NormalTable columns={columns} data={bonusSummary} />
    </div>;
}