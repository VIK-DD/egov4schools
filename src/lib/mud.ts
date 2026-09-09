/**
 * Single entry point for the MUD design system.
 *
 * Token stylesheets come first: they define the CSS custom properties that
 * mud.css and every component read.
 *
 * On the JS side we import `dist/mud/mud.esm.js` directly rather than calling
 * `defineCustomElements()` from `@egov-moldova/mud-web-components`, which is
 * what the package README documents.
 *
 * Reason: @egov-moldova/mud@1.1.9 declares `./loader`, `.` and `./dist/components`
 * in its exports map, but the published tarball contains only `dist/mud` and
 * `dist/types` — `dist/esm/loader.js` is absent, so the loader re-export fails
 * to resolve and the build dies with UNRESOLVED_IMPORT.
 *
 * `mud.esm.js` is Stencil's lazy-load bundle. Importing it bootstraps and
 * registers every <mud-*> element as a side effect, so no explicit call is
 * needed. Revisit this once AGE ships a release that includes dist/esm.
 */
import '@egov-moldova/mud/dist/mud/tokens/core.tokens.css';
import '@egov-moldova/mud/dist/mud/tokens/core.dark.tokens.css';
import '@egov-moldova/mud/dist/mud/mud.css';
import '@egov-moldova/mud/dist/mud/mud.esm.js';
