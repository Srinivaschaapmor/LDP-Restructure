import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";

export function RichText({ doc }: { doc?: Document }) {
  if (!doc) return null;
  return <>{documentToReactComponents(doc)}</>;
}
