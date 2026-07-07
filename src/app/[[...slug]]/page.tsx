import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPageSlugs, getPageBySlug } from "@/lib/contentful";
import type { PageEntry } from "@/lib/types";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
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

  return (
    <>
      {page.fields.header ? <Header fields={page.fields.header.fields} /> : null}
      <main>
        <SectionRenderer sections={page.fields.sections} />
      </main>
      {page.fields.footer ? <Footer fields={page.fields.footer.fields} /> : null}
    </>
  );
}
