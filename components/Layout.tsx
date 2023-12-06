import { Tournament } from "../types";
import Navbar from "./buzzpoint_navbar";

type LayoutProps = {
    tournament?: Tournament;
    children: React.ReactNode;
}

export default function Layout({ tournament, children }: LayoutProps) {
    return <main>
        <Navbar tournament={tournament} />
        <div className="container mx-auto ps-5 pe-5 md:ps-20 md:pe-20 mt-3">
            {children}
        </div>
    </main>
}