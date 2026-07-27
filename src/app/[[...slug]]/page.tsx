import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPageSlugs, getPageBySlug } from "@/lib/contentful";
import { ctId, type PageEntry } from "@/lib/types";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { SectionRenderer } from "@/components/SectionRenderer";

export const revalidate = 3600; // ISR fallback; on-demand revalidation via webhook (later)
export const dynamicParams = true;

type Params = { slug?: string[] };

const pathFrom = (slug?: string[]) => "/" + (slug ?? []).join("/");

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((s) => ({ slug: s.replace(/^\//, "").split("/") }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = (await getPageBySlug(pathFrom(params.slug))) as PageEntry | undefined;
  const meta = page?.fields?.meta?.fields;
  if (!meta) return { title: page?.fields?.title };
  return {
    title: meta.title,
    description: meta.description,
    alternates: meta.canonicalUrl ? { canonical: meta.canonicalUrl } : undefined,
    robots: meta.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function Page({ params }: { params: Params }) {
  const page = (await getPageBySlug(pathFrom(params.slug))) as PageEntry | undefined;
  if (!page) notFound();

  // A leading banner is a full-bleed hero that sits ABOVE the breadcrumbs (per design);
  // the rest of the sections render below the breadcrumbs.
  const sections = page.fields.sections ?? [];
  const leadBanner = ctId(sections[0]) === "banner" ? sections[0] : undefined;
  const bodySections = leadBanner ? sections.slice(1) : sections;

  return (
    <>
      <script
        type="application/ld+json"
        // Article structured data for search engines (seo skill).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(page.fields.title, page.fields.meta?.fields?.description)) }}
      />
      {page.fields.header ? (
        <Header fields={page.fields.header.fields} primaryNav={page.fields.primaryNav} />
      ) : null}
      <main>
        {leadBanner ? <SectionRenderer sections={[leadBanner]} /> : null}
        <Breadcrumbs page={page} />
        {/* Common content padding for every page: 60px below breadcrumbs, 60px above footer. */}
        <div className="ld-content">
          <SectionRenderer sections={bodySections} />
        </div>
      </main>
      {page.fields.footer ? <Footer fields={page.fields.footer.fields} /> : null}
    </>
  );
}

function articleJsonLd(title?: string, description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
  };
}
