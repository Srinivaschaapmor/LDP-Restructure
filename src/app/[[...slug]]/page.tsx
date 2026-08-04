import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPageSlugs, getPageBySlug } from "@/contentful/queries/page.queries";
import { ctId, type PageEntry } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionRenderer } from "@/components/SectionRenderer";
import { articleJsonLd } from "@/lib/seo/articleJsonLd";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { slug?: string[] };

const pathFrom = (slug?: string[]) => "/" + (slug ?? []).join("/");

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((s) => ({ slug: s.replace(/^\//, "").split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = (await getPageBySlug(pathFrom(slug))) as PageEntry | undefined;
  const meta = page?.fields?.meta?.fields;
  if (!meta) return { title: page?.fields?.title };
  return {
    title: meta.title,
    description: meta.description,
    alternates: meta.canonicalUrl ? { canonical: meta.canonicalUrl } : undefined,
    robots: meta.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = (await getPageBySlug(pathFrom(slug))) as PageEntry | undefined;
  if (!page) notFound();

  const sections = page.fields.sections ?? [];
  const leadBanner = ctId(sections[0]) === "banner" ? sections[0] : undefined;
  const bodySections = leadBanner ? sections.slice(1) : sections;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(page.fields.title, page.fields.meta?.fields?.description)) }}
      />
      {page.fields.header ? (
        <Header fields={page.fields.header.fields} primaryNav={page.fields.primaryNav} />
      ) : null}
      <main>
        {leadBanner ? <SectionRenderer sections={[leadBanner]} /> : null}
        <Breadcrumbs page={page} />
        <div className="ld-content">
          <SectionRenderer sections={bodySections} />
        </div>
      </main>
      {page.fields.footer ? <Footer fields={page.fields.footer.fields} /> : null}
    </>
  );
}
