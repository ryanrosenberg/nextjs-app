'use client';

import { TossupCategory } from "../types";
import { formatDecimal, formatPercent } from "../lib/jordan_utils";
import NormalTable from "./normal_table";

type TossupCategoryTableProps = {
    tossupCategoryStats: TossupCategory[]
}

export default function TossupCategoryTable({ tossupCategoryStats }: TossupCategoryTableProps) {
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
            accessor: "conversion_rate",
            Header: "Conv %",
            format: formatPercent
        },  
        {
            accessor: "power_rate",
            Header: "Power %",
            format: formatPercent,
            border: "right",
        },        
        {
            accessor: "average_buzz",
            Header: "Average Buzz",
            format: formatDecimal
        }                   
    ];

    return <NormalTable columns={columns} data={tossupCategoryStats} />;
}