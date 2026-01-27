import { redirect } from "next/navigation";
import { getSession } from "@/backend/actions";
import InternalUseContent from "./InternalUseContent";

export default async function InternalUsePage() {
    const session = await getSession();

    if (!session) {
        redirect("/internalUse/login");
    }

    return <InternalUseContent role={session.role} username={session.username} branch={session.branch} />;
}