import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy route: the dashboard is now split into /portfolio and /market. */
export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    throw redirect({ to: "/portfolio" });
  },
});
