'use client';

import { Tossup } from "../../types";
import { formatDecimal, formatPercent, shortenAnswerline } from "../../lib/utils";
import NormalTable from "../normal_table";

type TournamentTossupTableProps = {
    tossups: Tossup[]
}

export function TournamentTossupTable({ tossups }: TournamentTossupTableProps) {
    const columns = [
        {
            accessor: "category",
            Header: "Category",
            border: "right",
        },
        {
            accessor: "answer",
            Header: "Answer",
            linkTemplate: "/buzzpoints/set/{{set_slug}}/tossup/{{slug}}",
            html: true,
            sortaccessor: "answer_primary",
            border: "right",
        },
        {
            accessor: "editions",
            Header: "Editions"
        },
        {
            accessor: "heard",
            Header: "Heard",
            border: "right",
        },
        {
            accessor: "conversion_rate",
            Header: "Conv. %",
            format: formatPercent
        },
        {
            accessor: "power_rate",
            Header: "Power %",
            format: formatPercent
        },
        {
            accessor: "neg_rate",
            Header: "Neg %",
            format: formatPercent,
            border: "right",
        },
        {
            accessor: "first_buzz",
            Header: "First Buzz"
        },
        {
            accessor: "average_buzz",
            Header: "Average Buzz",
            format: formatDecimal
        }
    ];

    return <NormalTable
        columns={columns}
        data={tossups.map(t => ({
            ...t,
            answer: shortenAnswerline(t.answer)
        }))}
    />
}