'use client';

import Table from "./Table";
import { formatDecimal } from "../lib/utils";
import NormalTable from "./normal_table";

type PlayerCategoryTableProps = {
    categories: any[]
}

export default function PlayerCategoryTable({ categories }: PlayerCategoryTableProps) {
    const columns = [
        {
            accessor: "category",
            Header: "Category",
            border: "right",
            linkTemplate: "/buzzpoints/2023-acf-winter-columbia/category-tossup/{{category_slug}}"
        },
        {
            accessor: "powers",
            Header: "Powers",
            defaultDescending: true
        },
        {
            accessor: "gets",
            Header: "Gets",
            defaultDescending: true
        },
        {
            accessor: "negs",
            Header: "Negs",
            border: "right",
            defaultDescending: true
        },
        {
            accessor: "bouncebacks",
            Header: "BBs",
            border: "right",
            defaultDescending: true
        },
        {
            accessor: "points",
            Header: "Points",
            border: "right",
            defaultDescending: true
        },
        {
            accessor: "earliest_buzz",
            Header: "Earliest Buzz"
        },
        {
            accessor: "average_buzz",
            Header: "Avg. Buzz",
            border: "right",
            format: formatDecimal
        },
        {
            accessor: "first_buzzes",
            Header: "First Buzzes",
            defaultDescending: true
        },
        {
            accessor: "top_three_buzzes",
            Header: "Top 3 Buzzes",
            defaultDescending: true
        }
    ];

    return <NormalTable
        columns={columns}
        data={categories}
    />
}
