'use client';

import { TossupCategory } from "../types";
import { formatDecimal, formatPercent } from "../lib/utils";
import NormalTable from "./normal_table";

type TossupCategoryTableProps = {
    tossupCategoryStats: TossupCategory[];
    categoryLinks?: boolean;
}

export default function TossupCategoryTable({ tossupCategoryStats, categoryLinks = true }: TossupCategoryTableProps) {
    const columns = [
        {
            accessor: "category",
            Header: "Category",
            border: "right",
            linkTemplate: categoryLinks ? "/tournament/{{tournament_slug}}/category-tossup/{{category_slug}}" : undefined,
            align: 'left'
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