import { BonusDirect } from "../../types";
import NormalTable from "../normal_table";

type BonusDataProps = {
    directs: BonusDirect[]
}

export default function BonusData({ directs }: BonusDataProps) {
    const columns = [
        {
            accessor: "team_name",
            Header: "Team",
            linkTemplate: "/buzzpoints/tournament/{{tournament_slug}}/team/{{team_slug}}"
        },
        {
            accessor: "opponent_name",
            Header: "Opponent",
            border: "right"
        },
        {
            accessor: "part_one",
            Header: "Part 1"
        }, 
        {
            accessor: "part_two",
            Header: "Part 2"
        }, 
        {
            accessor: "part_three",
            Header: "Part 3",
            border: "right"
        },
        {
            accessor: "total",
            Header: "Total",
        }
    ];

    return (
        <NormalTable 
            columns={columns} 
            data={directs} 
        />
    );
}