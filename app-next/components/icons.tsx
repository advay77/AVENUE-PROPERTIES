import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 15, children, ...rest }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...rest}>
      {children}
    </svg>
  );
}

export function IconPin({ size = 14 }: { size?: number }) {
  return (
    <Base size={size} strokeWidth="2.4">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Base>
  );
}

export function IconPhone({ size = 15 }: { size?: number }) {
  return (
    <Base size={size}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </Base>
  );
}

export function IconHome({ size = 15 }: { size?: number }) {
  return (
    <Base size={size}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.6V20h13V9.6" />
    </Base>
  );
}

export function IconClock({ size = 15 }: { size?: number }) {
  return (
    <Base size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 1.9" />
    </Base>
  );
}

export function IconRupee({ size = 13 }: { size?: number }) {
  return (
    <Base size={size} strokeWidth="2.4">
      <path d="M6 4h12M6 9h12M9 4c4 0 6 2 6 5s-2 5-6 5H6l8 6" />
    </Base>
  );
}

export function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <Base size={size} strokeWidth="2.4">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </Base>
  );
}

export function IconHeart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19.5 12.6 12 20l-7.5-7.4a4.8 4.8 0 0 1 0-6.9 5 5 0 0 1 7 0l.5.5.5-.5a5 5 0 0 1 7 0 4.8 4.8 0 0 1 0 6.9Z" />
    </svg>
  );
}

export function IconWa({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.3 1.3-1.8 1.3-.5.1-1 .1-1.7-.1a13.4 13.4 0 0 1-6.6-5.8c-.5-.8-.8-1.7-.8-2.6 0-1 .5-1.5.7-1.7.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6a9.3 9.3 0 0 0 4 3.4c.3.1.5.1.6-.1l.8-1c.2-.2.3-.2.6-.1l2 1c.2.1.4.2.4.3.1.1.1.6 0 1Z" />
    </svg>
  );
}

export function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
      <path d="m4 12 5.5 5.5L20 7" />
    </svg>
  );
}

export function IconInfo({ size = 17 }: { size?: number }) {
  return (
    <Base size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-5M12 8h.01" />
    </Base>
  );
}

export function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconChevron() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function IconBrand({ size = 21 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.6V20h13V9.6" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

export function IconCatArrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

export function IconList() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconFilter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function IconClose() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Star({ on, size }: { on: boolean; size?: number }) {
  return (
    <svg className={on ? "on" : undefined} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 17.3-6.2 3.7 1.7-7-5.5-4.7 7.2-.6L12 2l2.8 6.7 7.2.6-5.5 4.7 1.7 7z" />
    </svg>
  );
}

export function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" />
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1Z" />
    </svg>
  );
}
