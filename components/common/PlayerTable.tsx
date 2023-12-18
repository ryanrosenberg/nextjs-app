'use client';

import { Righteous } from "next/font/google";
import { formatDecimal } from "../../lib/jordan_utils";
import NormalTable from "../normal_table";

type PlayerTableProps = {
    players: any[]
}

export function PlayerTable({ players }: PlayerTableProps) {
    const columns = [
        {
            accessor: "name",
            Header: "Player",
            linkTemplate: "/buzzpoints/{{tournament_slug}}/player/{{slug}}",
        },
        {
            accessor: "team_name",
            Header: "Team",
            linkTemplate: "/buzzpoints/{{tournament_slug}}/team/{{team_slug}}",
            html: true,
            border: "right",
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
            defaultDescending: true,
            border: "right",
        },
        {
            accessor: "bouncebacks",
            Header: "Bouncebacks",
            defaultDescending: true,
            border: "right",
        },
        {
            accessor: "points",
            Header: "Points",
            defaultDescending: true,
            border: "right",
        },
        {
            accessor: "earliest_buzz",
            Header: "Earliest Buzz"
        },
        {
            accessor: "average_buzz",
            Header: "Avg. Buzz",
            format: formatDecimal,
            border: "right",
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
        data={players}
    />
}