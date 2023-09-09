'use client';

import { BonusCategory } from "../types";
import { formatDecimal, formatPercent } from "../lib/jordan_utils";
import NormalTable from "./normal_table";

type BonusCategoryTableProps = {
    bonusCategoryStats: BonusCategory[]
}

export default function BonusCategoryTable({ bonusCategoryStats }: BonusCategoryTableProps) {
    const columns = [
        {
            accessor: "category",
            Header: "Category",
            border: "right",
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