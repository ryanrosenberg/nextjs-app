'use client';

import { QuestionSet } from "../types";
import Table from "./Table";
import { formatDecimal, formatPercent } from "../lib/utils";
import NormalTable from "./normal_table";

type QuestionSetSummaryProps = {
    questionSets: QuestionSet[];
    detailPage?: boolean;
}

export default function QuestionSetSummary({ questionSets, detailPage }: QuestionSetSummaryProps) {
    const columns = [
        {
            accessor: "name",
            Header: "Question Set",
            linkTemplate: detailPage ? undefined : "/buzzpoints/set/{{slug}}",
            border: "right"
        },
        {
            accessor: "difficulty",
            Header: "Difficulty",
            border: "right"
        },
        {
            accessor: "first_mirror",
            Header: "Debut",
            defaultSort: "desc" as const,
            border: "right"
        },
        {
            accessor: "edition_count",
            Header: "Editions"
        },
        {
            accessor: "tournament_count",
            Header: "Mirrors",
            border: "right"
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
            border: "right"
        },
        {
            accessor: "ppb",
            Header: "PPB",
            format: formatDecimal,
            border: "right"
        },
        {
            accessor: "easy_conversion",
            Header: "Easy %",
            format: formatPercent
        },
        {
            accessor: "medium_conversion",
            Header: "Medium %",
            format: formatPercent
        },
        {
            accessor: "hard_conversion",
            Header: "Hard %",
            format: formatPercent
        },
    ];

    return (
        <NormalTable
            columns={columns}
            data={questionSets}
        />
    );
}