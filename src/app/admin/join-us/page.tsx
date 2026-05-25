import Link from "next/link";
import { OpenRehearsalDatesForm } from "@/components/admin/open-rehearsal-dates-form";
import { getOpenRehearsalDates } from "@/lib/db/queries";
import { getSession } from "@/lib/session";
import { AdminLoginForm } from "@/components/admin/login-form";

export default async function AdminJoinUsPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    return <AdminLoginForm />;
  }

  const dates = await getOpenRehearsalDates();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Join us — open rehearsal dates</h1>
        <p className="mt-2 text-muted-foreground">
          Edit the dates listed under <strong>Upcoming open sessions:</strong> on the{" "}
          <Link href="/join-us/" className="text-impram-link hover:underline">
            Join us
          </Link>{" "}
          page.
        </p>
      </div>
      <OpenRehearsalDatesForm dates={dates} />
    </div>
  );
}
