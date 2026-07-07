"use client";
import { useState } from "react";
import type { Button, Link, Media, Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { asFields } from "@/lib/types";
import { IMAGE_SIZES } from "@/lib/constants";

interface HeaderFields { logo?: Media; navLinks?: Link[]; cta?: Button }

export function Header({ fields }: { fields: Section["fields"] }) {
  const f = asFields<HeaderFields>(fields);
  const [open, setOpen] = useState(false);
  const links = f.navLinks ?? [];

  return (
    <header className="ld-header" id="top">
      <div className="container ld-header__inner">
        <a href="/" className="ld-header__brand">
          {f.logo ? <MediaImg media={f.logo} className="ld-header__logo" sizes={IMAGE_SIZES.logo} priority /> : null}
        </a>

        <nav className="ld-header__nav d-none d-lg-flex" aria-label="Primary">
          {links.map((l) => (
            <a key={l?.sys?.id} href={l?.fields?.href ?? "#"} className="ld-header__link">{l?.fields?.label}</a>
          ))}
        </nav>

        <div className="ld-header__actions">
          {f.cta?.fields ? (
            <a className="ld-btn ld-btn--primary" href={f.cta.fields.link?.fields?.href ?? "#"}>{f.cta.fields.label}</a>
          ) : null}
          <button
            type="button"
            className="ld-header__burger d-lg-none"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open
                ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                : <>
                    <path d="M3 6h18" strokeLinecap="round" />
                    <path d="M3 12h18" strokeLinecap="round" />
                    <path d="M3 18h18" strokeLinecap="round" />
                  </>}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="ld-header__mobilenav d-lg-none" aria-label="Primary mobile">
          {links.map((l) => (
            <a key={l?.sys?.id} href={l?.fields?.href ?? "#"} className="ld-header__link">{l?.fields?.label}</a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
