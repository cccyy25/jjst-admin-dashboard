import { redirect } from "next/navigation";
import { getSession } from "@/backend/actions";
import StaffContent from "./StaffContent";

export default async function StaffPage() {
    const session = await getSession();

    if (!session) {
        redirect("/internalUse/login");
    }

    if (session.role !== "superadmin") {
        redirect("/internalUse");
    }

    return <StaffContent />;
}