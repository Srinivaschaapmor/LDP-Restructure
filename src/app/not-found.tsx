import { ROUTES } from "@/constants";

export default function NotFound() {
  return (
    <main className="container-xxl py-5 text-center">
      <h1>Page not found</h1>
      <p>We couldn&apos;t find that page. Please check the URL or return home.</p>
      <a className="ld-btn ld-btn--primary" href={ROUTES.home}>Back to home</a>
    </main>
  );
}
