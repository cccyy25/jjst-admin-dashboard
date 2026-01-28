import { redirect } from "next/navigation";
import { getSession } from "@/backend/actions";
import BranchSalesPage from "@/app/components/BranchSalesPage";

export default async function PuchongBranch() {
    const session = await getSession();

    if (!session) {
        redirect("/internalUse/login");
    }

    // Staff can only access their assigned branch
    if (session.role === "staff" && session.branch !== "puchong") {
        redirect("/internalUse");
    }

    return <BranchSalesPage branchSlug="puchong" branchName="Puchong Branch" isAdmin={session.role === "superadmin"} />;
}