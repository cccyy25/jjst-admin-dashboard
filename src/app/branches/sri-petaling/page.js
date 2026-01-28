import { redirect } from "next/navigation";
import { getSession } from "@/backend/actions";
import BranchSalesPage from "@/app/components/BranchSalesPage";

export default async function SriPetalingBranch() {
    const session = await getSession();

    if (!session) {
        redirect("/internalUse/login");
    }

    // Staff can only access their assigned branch
    if (session.role === "staff" && session.branch !== "sri-petaling") {
        redirect("/internalUse");
    }

    return <BranchSalesPage branchSlug="sri-petaling" branchName="Sri Petaling Branch" isAdmin={session.role === "superadmin"} />;
}