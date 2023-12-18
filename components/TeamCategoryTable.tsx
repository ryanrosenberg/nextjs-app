'use client';

import { BonusCategory } from "../types";
import Table from "./Table";
import { formatDecimal, formatPercent } from "../lib/utils";
import NormalTable from "./normal_table";

type TeamCategoryTableProps = {
    bonusCategoryStats: BonusCategory[]
}

export default function TeamCategoryTable({ bonusCategoryStats }: TeamCategoryTableProps) {
    const columns = [
        {
            accessor: "name",
            Header: "Team Name",
            linkTemplate: "/buzzpoints/{{slug}}/team/{{team_slug}}",
            border: "right"
        },
        {
            accessor: "heard",
            Header: "Heard",
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
        }
    ];

    return <NormalTable columns={columns} data={bonusCategoryStats} />;
}
