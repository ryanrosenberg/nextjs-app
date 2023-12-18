'use client';

import Table from "../Table";
import { formatDecimal } from "../../lib/utils";
import NormalTable from "../normal_table";

type TeamTableProps = {
    teams: any[]
}

export function TeamTable({ teams }: TeamTableProps) {
    const columns = [
        {
            accessor: "name",
            Header: "Team",
            linkTemplate: "/buzzpoints/{{tournament_slug}}/team/{{slug}}",
            html: true
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
            defaultDescending: true
        },
        {
            accessor: "bouncebacks",
            Header: "Bouncebacks",
            defaultDescending: true
        },
        {
            accessor: "points",
            Header: "Points",
            defaultDescending: true
        },
        {
            accessor: "earliest_buzz",
            Header: "Earliest Buzz"
        },
        {
            accessor: "average_buzz",
            Header: "Avg. Buzz",
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
        },
        // {
        //     accessor: "ppb",
        //     Header: "PPB",
        //     format: formatDecimal
        // }
    ];

    return <NormalTable
        columns={columns}
        data={teams}
    />
}
