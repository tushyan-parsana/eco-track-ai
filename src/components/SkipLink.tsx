/**
 * @component SkipLink
 * @description An accessibility skip-navigation link that becomes visible
 * on keyboard focus, allowing screen-reader and keyboard users to jump
 * directly to the main content area.
 */

"use client";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-600 focus:text-white focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
}
