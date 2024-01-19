import { Tournament } from "../types";
import NormalTable from "./normal_table";

type TournamentSummaryProps = {
    tournament: Tournament
}

export default function TournamentSummary({ tournament }: TournamentSummaryProps) {
    const startDate = new Date(tournament.start_date).toLocaleDateString("en-US");
    const endDate = tournament.end_date ? new Date(tournament.end_date).toLocaleDateString("en-US") : "";
    const columns = [
        {
            accessor: "name",
            Header: "Tournament"
        },
        {
            accessor: "date",
            Header: "Date"
        },
        {
            accessor: "level",
            Header: "Level"
        },
        {
            accessor: "location",
            Header: "Location"
        }, 
        {
            accessor: "set",
            Header: "Set"
        }, 
        {
            accessor: "difficulty",
            Header: "Difficulty"
        }
    ];
    
    const data = [
        {
            name: tournament.name,
            date: startDate + (endDate && endDate !== startDate ? ` - ${endDate}` : ''),
            level: tournament.level,
            location: tournament.location,
            set: tournament.question_set.name,
            difficulty: tournament.question_set.difficulty
        }
    ];

    return <NormalTable columns={columns} data={data} />;
}