'use client';

import { BonusCategory } from "../types";
import { formatDecimal, formatPercent } from "../lib/utils";
import NormalTable from "./normal_table";

type BonusCategoryTableProps = {
    bonusCategoryStats: BonusCategory[];
    categoryLinks?: boolean;
}

export default function BonusCategoryTable({ bonusCategoryStats, categoryLinks = true }: BonusCategoryTableProps) {
    const columns = [
        {
            accessor: "category",
            Header: "Category",
            border: "right",
            linkTemplate: categoryLinks ? "/tournament/{{tournament_slug}}/category-bonus/{{category_slug}}" : undefined,
            align: 'left'
        },
        {
            accessor: "heard",
            Header: "Heard",
            border: "right",
        },
        {
            accessor: "ppb",
            Header: "PPB",
            format: formatDecimal,
            border: "right",
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