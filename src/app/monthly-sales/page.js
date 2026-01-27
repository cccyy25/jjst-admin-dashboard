import { redirect } from "next/navigation";
import { getSession } from "@/backend/actions";
import MonthlySalesContent from "./MonthlySalesContent";

export default async function MonthlySalesPage() {
    const session = await getSession();

    if (!session) {
        redirect("/internalUse/login");
    }

    if (session.role !== "superadmin") {
        redirect("/internalUse");
    }

    return <MonthlySalesContent />;
}