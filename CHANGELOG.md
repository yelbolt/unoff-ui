# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.23.6] - 2026-03-30

### Fixed

- **`Tooltip` arrow position (non-portal)**: Arrow (`::after`) est ancré sur `.tooltip` et reste fixe au centre de l'ancre — seul `tooltip__block` glisse pour éviter les bords du viewport, la flèche ne dérive plus avec lui
- **`Tooltip` arrow position (portal)**: La position de la flèche est calculée via `anchorCenterX − clampedLeft` et appliquée en `--_arrow-left`, elle pointe toujours vers l'ancre même quand le tooltip est clampé
- **`Tooltip` scroll dismissal**: La tooltip se masque dès qu'un scroll est détecté (phase capture), elle ne flotte plus au-dessus du contenu dans les listes défilables
- **`Tooltip` knob tracking**: En mode portal, la position est recalculée à chaque frame via `requestAnimationFrame` — la tooltip suit un ancre en mouvement (ex. un `Knob` dans un slider)
- **`DraggableWindow` portal rendering**: La fenêtre est rendue via `createPortal` sur `document.body` en `position: fixed`, échappant aux contraintes d'overflow et de stacking context du parent — la position initiale est calculée depuis le `getBoundingClientRect` du bouton déclencheur

## [1.23.5] - 2026-03-30

### Fixed

- **`Tooltip` arrow position on collision**: When the tooltip block slides to avoid viewport boundaries, the arrow now stays visually attached to the reference element — the arrow is anchored to `.tooltip__block` and its horizontal position compensates for the block's offset

## [1.23.4] - 2026-03-30

### Added

- **`Tooltip` `anchor` prop**: New prop to pass a custom anchor element for portal rendering — tooltips now render outside the component tree to avoid overflow/clipping constraints
- **`Layout` `shouldReflow` prop**: New boolean prop that switches the layout to a single-column stack on viewports ≤ 460 px — reflow CSS is now gated behind the `layout--reflow` class instead of always-on media queries

### Changed

- **`Dropdown` portal rendering**: The dropdown menu now renders via a portal at `document.body` level, fixing overflow and z-index clipping issues when the trigger is inside a scrollable or transformed container
- **`Menu` portal rendering**: Aligned with `Dropdown` — menu panel now also renders via portal with recalculated viewport-relative positioning

## [1.23.3] - 2026-03-26

### Fixed

- **`Bar` vertical alignment**: Changed `align-items` from `stretch` to `center` in the vertical variant for consistent content alignment

## [1.23.2] - 2026-03-22

### Added

- **`Dropdown` `isFill` prop**: New boolean prop that stretches the trigger button to fill its container — decoupled from `alignment` so layout width and list anchor position can be set independently
- **`ActionsList` shortcut display**: Shortcut labels now render on the trailing edge of list items — pass `shortcut` on any `OPTION` or `GROUP` entry in the `DropdownOption` tree

### Changed

- **`Dropdown` `alignment` prop**: `'FILL'` value removed — replace with `isFill={true}` combined with `alignment="LEFT"` (or `"RIGHT"`); `alignment` now only accepts `'LEFT'` and `'RIGHT'`

### Fixed

- **`DraggableWindow` position**: Corrected the translate offset so the window always appears 8 px to the left of the trigger button regardless of the panel's position in the viewport

## [1.23.1] - 2026-03-18

### Fixed
- **`Dropdown` ellipsis**: Truncate the button label if the text overflows if the `alignment` is set to `FILL`

## [1.23.0] - 2026-03-18

### Added

- **`SegmentedControl` component**: New component for switching between mutually exclusive views or display modes
  - Supports per-item `isDisabled`, global `isBlocked` / `isNew` states with Pro / New badges
  - `warning` prop adds an `IconChip` badge for contextual alerts
  - `preview` prop attaches an image tooltip to the Pro/New badge
  - Full token support across all four platform themes (Figma, Framer, Penpot, Sketch)
- **Searchable `ActionsList`**: New `canBeSearched`, `searchLabel`, and `noResultsLabel` props
  - Renders a sticky `Input` field (with search icon and clear button) at the top of the list
  - Filters `OPTION` items and `GROUP` children by label (case-insensitive)
  - Shows `noResultsLabel` (default `"No results"`) when the query matches nothing
  - Adjacent separator is also sticky so the list scrolls beneath both elements
- **Searchable `Menu`**: Forwards `canBeSearched`, `searchLabel`, `noResultsLabel` to `ActionsList`
- **Searchable `Dropdown`**: Forwards `canBeSearched`, `searchLabel`, `noResultsLabel` through `Menu` and the inline `ActionsList`

### Fixed

- **Diagonal submenu switching**: `ActionsList` now tracks the last 5 `mousemove` `movementX` values and delays submenu changes by 350 ms when the cursor is moving towards the open submenu, preventing accidental group switches during diagonal mouse movement
- **Submenu not closing after sub-option click**: `MenuSubOption` now calls `onCancellation?.()` after the option action fires, matching the behaviour of `MenuOption`
- **`Dropdown` flex label**: Corrected flex properties on `.select-menu__item__label` so long option labels truncate correctly

## [1.22.2] - 2026-03-15

### Fixed

- **Penpot copy icon SVG path**: Corrected path coordinates for the `copy` icon in the Penpot icon set — the inner rectangle was misaligned (offset by 2px) relative to the outer rectangle

## [1.22.1] - 2026-03-15

### Changed

- **Semantic message max-width token removed**: `--semantic-message-max-width` (previously `400px`) removed from all four platform theme files (Figma, Framer, Penpot, Sketch) and their corresponding token JSON files — the component now falls back to `unset` by default
- **Label CSS variable naming standardized**: Label-related variables renamed from `--text-label-*` to `--text-styles-label-*` (`gap`, `padding-*`, `height`, `color`) across all platform theme files and `texts.module.scss`

### Removed

- **Unused platform type SCSS files**: Standalone `figma-types.scss`, `framer-types.scss`, `penpot-types.scss`, and `sketch-types.scss` files (which only declared `--font-stack`) removed, along with their `@import` references in the corresponding module files

## [1.22.0] - 2026-03-14

### Added

- **Figma Plugin Stylesheet** (`figma-plugin.scss`): New stylesheet for Figma plugin contexts where the platform already injects its own CSS custom properties
  - Maps only `-default` tokens to `var(--figma-color-x)` with no fallback values
  - Non-default tokens are omitted — they share Figma's native variable names directly
  - Compatible with all Figma products (Figma, FigJam, Slides, Buzz) without requiring `data-mode`
  - Exported as `figmaPlugin` from `@unoff/ui` alongside `figmaColors`
- **Commons design tokens**: Added `commons.scss` with shared dimension, opacity, radius, and shadow tokens used across all platform themes
- **Shadow tokens**: Added comprehensive shadow color tokens and elevation definitions for `dropShadow` and `innerShadow` effect types
- **Alpha color variations**: Added `alpha0` color tokens (fully transparent black and white) across all platform token definitions
- **Resolver-based color configs**: All four platform color themes (Figma, Framer, Penpot, Sketch) now use `.resolver.json` files for correct light/dark mode resolution

### Changed

- **Token format migration to DTCG 2025.10**: All design token JSON files migrated from Tokens Studio legacy format to the DTCG 2025.10 standard
  - Dimension values changed from strings (`"4px"`) to `{ value, unit }` objects
  - `$type` fields updated: `fontFamilies → fontFamily`, `fontWeights → fontWeight`, `fontSizes → dimension`, `lineHeights → number`, `letterSpacing → dimension`, `boxShadow → shadow`
- **Terrazzo pipeline refactored** to run on `@terrazzo/cli` and `@terrazzo/plugin-css` v2.0.0-rc.0
  - `terrazzo.globals.js` replaced by `terrazzo.commons.js` using a commons resolver
  - `terrazzo.type.js` removed — text styles now handled per-platform in `terrazzo.text.js`
  - All Terrazzo component configs updated across all four platforms (207 files)
- **`wrapFallbacks` CSS bridge**: Color tokens ending in `-default` are now emitted as `var(--base-name, raw-value)`, enabling Storybook to use hardcoded fallbacks while the Figma plugin picks up native Figma variables automatically
- **`globals.module.scss` replaced by `commons.module.scss`** in exported style modules
- **Naming conventions standardized**: Hover/focus states renamed from `over` to `hover` in dropzone tokens; dimension property names unified across all platforms
- **Button letter-spacing tokens** corrected per platform (Figma, Framer, Penpot, Sketch)

### Fixed

- **Dimension tokens generating `undefinedundefined`**: `cssTransform` in `tokens-studio-compat.js` now handles both legacy string dimensions (`"4px"`) and DTCG `{ value, unit }` objects correctly
- **Shadow aliases resolving inline**: Shadow tokens that alias commons elevation tokens now emit `var(--elevation-x)` references instead of inlining all layers
- **`stopLoading` type**: Changed from `NodeJS.Timeout` to `number` for browser compatibility

### Technical Details

- New `tokens-studio-compat.js` plugin exports: `preprocessTokens`, `cssTransform`, `wrapFallbacks`, `wrapPassthrough`
- `wrapPassthrough(':root')` generates the plugin-only passthrough stylesheet with zero fallback values
- All platform token resolver files moved to `tokens/platforms/{theme}/` with DTCG-compliant mode files
- Updated `docs/terrazzo-guide.md` with full pipeline documentation, two-file Figma strategy, and all four plugin exports

## [1.21.3] - 2026-03-06

### Changed

- Updated repository references from `a-ng-d` to `yelbolt` in `package.json`, `README.md`, and `CHANGELOG.md`

## [1.21.2] - 2026-03-03

### Added

- **New Icons**: Added `code`, `copy`, `redo`, and `undo` icons across all design systems
  - SVG icons available for Figma, Framer, Penpot, and Sketch
  - Updated icon SCSS files and type definitions to include the new icons
  - Simplified icon usage in stories

- **Slider Progress Bar**: Added progress bar support to SimpleSlider and MultipleSlider components
  - New `hasProgressBar` prop to toggle the visual progress fill
  - Available on both standard and gradient slider variants

- **Slider Padding Control**: Added padding control to slider components
  - New `hasPadding` prop for SimpleSlider and MultipleSlider
  - Propagated to gradient slider variants via `hasProgressBar` and `hasPadding` props

### Enhanced

- **Form Item Min-Width**: Added `--form-item-min-width` CSS variable for better layout control in constrained containers

### Fixed

- **Tooltip Display Logic**: Updated display condition to use dynamic array length instead of a hardcoded value
- **Chip Documentation**: Corrected state terminology in Chip component documentation

### Changed

- **State Interface Naming**: Unified state interface naming across components for consistency

### Technical Details

- Updated Storybook dependencies to version 10.2.14
- Added `minimatch` dependency and upgraded `vite-plugin-dts` in `package.json`
- Scoped `minimatch` dependency under `@microsoft/api-extractor`

## [1.21.1] - 2026-02-26

### Changed

- Bumped version from `1.21.0` to `1.21.1`

## [1.21.0] - 2026-02-26

### Changed

- **Package Renamed to Unoff UI**: Migrated package identity from Figmug UI to Unoff UI
  - Renamed package from `figmug-ui` to `@unoff/ui` in `package.json`
  - Updated npm registry scope from `@a_ng_d` to `@unoff`
  - Updated all import paths from `figmug-utils` to `@unoff/utils` across components and stories
  - Updated documentation and README to reflect the new Unoff UI branding

### Technical Details

- Updated `package.json` and `package-lock.json` with new package name and scope
- Replaced all `doClassnames` imports from `figmug-utils` with `@unoff/utils` across all components
- Updated theme generator documentation and code coverage reports
- All internal references to Figmug UI replaced with Unoff UI

## [1.20.6] - 2026-02-05

### Changed

- **Layout Component Distributed Gap**: Adjusted distributed gap size for improved layout consistency
  - Reduced `--layout-distributed-gap` from `small` to `xxsmall` for tighter, more consistent spacing
  - Applied across all themes (Figma, Framer, Penpot, Sketch) for uniform distributed layout behavior
  - Better visual balance in distributed layout mode with reduced spacing between elements

### Technical Details

- Updated layout token files for all platforms with new gap size value
- Changed distributed gap from `var(--size-pos-small)` to `var(--size-pos-xxsmall)`
- Regenerated SCSS files for all themes with updated spacing values
- Improved layout density for better use of available space

## [1.20.5] - 2026-02-04

### Enhanced

- **Popin Component Layout**: Improved layout handling for better positioning control
  - Added `position: relative` to `.popin__content` for better nested element positioning
  - Enhanced layout stability for child components that require positioning context
  - Better support for absolutely positioned elements within popin content

### Technical Details

- Updated popin SCSS with relative positioning on content container
- Improved positioning context for nested components within popins
- Enhanced layout predictability for complex popin content structures

## [1.20.4] - 2026-02-03

### Enhanced

- **Slider Components Snap Behavior**: Extended snap behavior to include step value of 1
  - Changed snap threshold from `step > 1` to `step >= 1` in both SimpleSlider and MultipleSlider
  - Step value of 1 now uses jump/snap behavior instead of continuous sliding
  - Improved consistency: only steps < 1 (e.g., 0.1, 0.5) use smooth continuous movement
  - Better tactile feedback for integer-based value selection

### Technical Details

- Updated conditional check in `onSlide` method from `if (step > 1)` to `if (step >= 1)`
- Applied change consistently across SimpleSlider and MultipleSlider components
- Snap behavior activates for all integer step values (1, 2, 5, 10, etc.)
- Smooth sliding behavior preserved only for fractional steps (< 1)

## [1.20.3] - 2026-02-03

### Fixed

- **Button Status Rendering**: Improved conditional rendering logic for button status indicators
  - Removed unnecessary type checks when displaying chips for blocked/new states
  - Simplified Status component logic for better maintainability
  - Status now properly renders regardless of button type

- **Lock Icon Path**: Corrected lock-off icon SVG path for accurate visual representation
  - Updated lock-off icon with corrected coordinates and dimensions
  - Better visual consistency with lock-on icon

### Enhanced

- **Slider Components Snap Behavior**: Improved interaction feel for large step values
  - Added intelligent snap behavior for steps > 1: knob stays fixed and jumps only when crossing step thresholds
  - Smooth continuous movement preserved for steps ≤ 1
  - Eliminated "stuck" feeling during drag operations with large steps
  - Better visual feedback with snap-to-value behavior on large increments

- **Slider Keyboard Navigation**: Fixed and improved keyboard step handling
  - Step values now correctly applied when using arrow keys (was hardcoded to 1)
  - Arrow keys: move by configured `step` value
  - Shift + Arrow keys: move by `step × 10` for faster navigation
  - Consistent keyboard behavior across SimpleSlider and MultipleSlider components

- **MultipleSlider Keyboard Shortcuts**: Standardized keyboard modifier keys
  - Changed from Cmd/Ctrl to Shift for accelerated movement (×10 multiplier)
  - More intuitive keyboard shortcuts aligned with SimpleSlider behavior
  - Better cross-platform consistency

### Technical Details

- Updated `onSlide` method in both slider components with conditional snap logic based on step value
- Enhanced `shiftRightStop` and `shiftLeftStop` functions to accept and apply step parameter
- Modified keyboard event handlers to pass step values to shift functions
- Changed modifier key detection from `metaKey`/`ctrlKey` to `shiftKey` in MultipleSlider
- Added value change detection in snap logic to prevent unnecessary updates
- Improved step rounding on release for smooth snapping behavior

## [1.20.2] - 2026-02-02

### Fixed

- **Slider Components Positioning**: Fixed mouse position calculation for nested containers
  - Updated SimpleSlider and MultipleSlider to use `getBoundingClientRect()` instead of `offsetLeft`
  - Eliminates position offset when sliders are placed in deeply nested containers
  - More reliable positioning regardless of parent container structure

### Technical Details

- Replaced `slider.offsetLeft` with `e.clientX - rangeRect.left` in position calculations
- Removed dependency on computed padding values for positioning accuracy
- Updated `onSlide` method signature to accept `DOMRect` for range element positioning
- Improved positioning robustness for complex component hierarchies

## [1.21.0] - 2026-02-01

### Added

- **Card Component Tag Feature**: New tag support for better content categorization
  - Added `tag` prop to Card component for displaying category labels
  - Integrated Chip component for consistent tag styling
  - Tags display in top-right corner of cards with absolute positioning
  - Configurable tag display with optional rendering

- **Text Component Extended Color Palette**: New color options for semantic states
  - Added `success` color option for positive/success messages
  - Added `warning` color option for caution/warning messages
  - Added `alert` color option for error/danger messages
  - Updated all theme configurations (Figma, Framer, Penpot, Sketch) with new color variables
  - Enhanced Text component story with comprehensive color examples

### Technical Details

- Added `tag?: string` prop to Card component interface
- Enhanced Card component with conditional tag rendering
- Updated Card SCSS with `.card__tags` styling and positioning
- Added new CSS variables for text colors: `--text-color-success`, `--text-color-warning`, `--text-color-alert`
- Updated theme files for Figma, Framer, Penpot, and Sketch with semantic color mappings
- Enhanced Text component SCSS with new color modifier classes (`.text--success`, `.text--warning`, `.text--alert`)
- Updated Card and Text component Storybook stories with new prop examples

## [1.20.0] - 2026-01-15

### Added

- **Storybook Interaction Tests**: Comprehensive interaction testing across all components
  - Implemented Play functions in Storybook stories for interactive behavior validation
  - Automated user interaction testing covering clicks, form submissions, and state changes
  - Enhanced test coverage for component responsiveness and event handling

- **Storybook Accessibility Tests**: Full accessibility test suite integration
  - Integrated `@storybook/addon-a11y` for automated accessibility checking
  - Added accessibility tests covering WCAG 2.1 standards
  - Comprehensive coverage of color contrast, ARIA attributes, keyboard navigation
  - Automated testing for semantic HTML structure and form labels

- **Storybook Coverage Metrics**: Test coverage reporting for component implementations
  - Integrated coverage analysis for visual regression testing
  - Added coverage badges and metrics to component documentation
  - Tracking coverage across actions, assets, dialogs, inputs, lists, slots, and tags

### Enhanced

- **Component Accessibility**: Improved accessibility across all components
  - Enhanced ARIA labels and descriptions for better screen reader support
  - Improved keyboard navigation with proper focus management
  - Added missing `aria-label` attributes to interactive elements
  - Improved semantic HTML structure for better accessibility
  - Enhanced form components with proper label associations
  - Improved color contrast ratios for better readability
  - Added `aria-describedby` relationships for helper and error messages
  - Enhanced button and link semantics for assistive technology

- **Accessibility Documentation**: Comprehensive accessibility guidelines
  - Added accessibility best practices to component documentation
  - Documented WCAG 2.1 compliance status for each component
  - Enhanced prop documentation with accessibility requirements
  - Added usage examples for proper accessible implementation

### Technical Details

- Configured Storybook with Play functions for interaction testing across 42+ components
- Implemented accessibility addon with automated scanning on every story
- Added test configurations for interactive and accessibility test execution
- Enhanced component templates with semantic HTML and ARIA attributes
- Improved focus management with proper `autoFocus` and `tabIndex` handling
- Added keyboard event handling for accessible component interactions
- Comprehensive accessibility testing covering all design system components

## [1.19.43] - 2026-01-06

### Enhanced

- **Component Props Documentation**: Comprehensive documentation enhancement for 42 components with detailed JSDoc comments
  - **Input Components**: Dropdown, Dropzone, Input, InputsBar, MultipleSlider, Select, SimpleSlider
    - Added detailed prop descriptions for unique identifiers, options, states, event handlers
    - Enhanced type documentation for icons, units, character limits, range constraints
    - Documented helper, preview, and warning message configurations
    - Added feature tracking, reflow, and responsive behavior props
  - **List Components**: ActionsItem, ActionsList, ColorItem, DraggableItem, KeyboardShortcutItem, MembersList, SortableList, Tabs
    - Documented selection states, interactivity options, and click handlers
    - Added descriptions for image sources, indicators, descriptions, and action slots
    - Enhanced drag-and-drop functionality documentation with state change handlers
    - Documented responsive behavior with max visible tabs and overflow handling
  - **Slot Components**: Bar, DraggableWindow, Drawer, FormItem, Layout, List, Popin, Section, SimpleItem
    - Added comprehensive layout configuration documentation (columns, dimensions, borders)
    - Documented content slot positions (left, center, right) and alignment options
    - Enhanced form item documentation with label, helper, error message configurations
    - Documented responsive behaviors, padding options, and centering controls
  - **Action Components**: Accordion, Button, Card, Knob, Menu
    - Enhanced button prop documentation with variants, icons, helper tooltips
    - Documented accordion row configurations, expansion states, action handlers
    - Added menu positioning, alignment, and viewport management documentation
  - **Asset Components**: Avatar, Icon, SectionTitle, Thumbnail
    - Documented icon types, names, sizes, and color configurations
    - Added avatar initials, image sources, and user state documentation
  - **Dialog Components**: Consent, Dialog, Message, Notification, SemanticMessage
    - Documented dialog types, titles, illustrations, and action configurations
    - Enhanced semantic message documentation with orientation and responsive options
  - **Tag Components**: Chip, ColorChip, IconChip, Tooltip
    - Added visual state documentation (active, inactive, on-background)
    - Documented color values, preview configurations, and tooltip positioning
    - Enhanced tooltip content documentation with image support

### Added

- **Figma Code Connect Integration**: Implemented comprehensive Code Connect setup to link Figma design components to React implementation
  - Added `@figma/code-connect` v1.3.12 dependency for bidirectional Figma-code synchronization
  - Created 6 Code Connect files mapping Figma components to React components:
    - **Button** (`Button.figma.tsx`): 7 type variants (PRIMARY, SECONDARY, TERTIARY, DESTRUCTIVE, ALTERNATIVE, INACTIVE, ICON)
    - **Icon** (`Icon.figma.tsx`): PICTO type with icon name mappings
    - **Input** (`Input.figma.tsx`): 4 input types (TEXT, LONG_TEXT, NUMBER, COLOR) with state mappings
    - **Dropdown** (`Dropdown.figma.tsx`): Alignment variants (LEFT/HUG, FILL/STRETCH)
    - **Tabs** (`Tabs.figma.tsx`): Direction (HORIZONTAL/VERTICAL) and flex mode support
    - **Chip** (`Chip.figma.tsx`): 3 state variants (ACTIVE, INACTIVE, ON_BACKGROUND)
  - Configured `figma.config.json` with React parser and include patterns
  - Added npm scripts: `figma:publish`, `figma:unpublish`, `figma:parse`

- **Storybook-Figma Integration**: Enhanced Storybook stories with native Figma Code Connect integration
  - Added `parameters.design` configuration to story meta objects
  - Integrated Figma prop mappings using `figma.enum()` and `figma.boolean()` helpers
  - Connected stories for Input, Dropdown, and Chip components
  - Enables direct Figma design access from Storybook documentation

- **Documentation**: Created comprehensive Code Connect documentation
  - Added `docs/code-connect.md` with setup instructions and token requirements
  - Documented all 6 connected components with their Figma node IDs
  - Included troubleshooting guide for token scope configuration
  - Provided file structure examples and next steps for expanding coverage

### Changed

- **Environment Configuration**: Updated `.gitignore` to properly manage environment files
  - Changed from ignoring `*.local` to explicitly ignoring `.env` and `.env.*` patterns
  - Better security for Figma access token and other sensitive configuration

### Technical Details

- Enhanced 42 component files with comprehensive JSDoc documentation (1392+ lines added)
- Connected Figma file: `QlBdsfEcaUsGBzqA20xbNi` ("Unoff" document)
- Code Connect files use component set node IDs (parent frames) for proper variant mapping
- Validation passes for all 6 components with `npm run figma:parse`
- Token requirements: "File Read" + "Code Connect Write" scopes
- Storybook integration uses default import pattern: `import figma from '@figma/code-connect'`

## [1.19.42] - 2025-12-07

### Enhanced

- **Tooltip Component Size**: Increased tooltip dimensions for better readability
  - Increased `minWidth` from 172px to 200px across all themes (Figma, Penpot, Sketch, Framer)
  - Increased `maxWidth` from 200px to 248px across all themes
  - Better text allocation and improved visibility for tooltip content
  - Enhanced multi-line tooltip readability with larger width constraints

- **Tooltip Text Alignment**: Improved text alignment for better content presentation
  - Changed default text alignment from `center` to `left` for multi-line tooltips
  - Single-line tooltips retain centered alignment for better visual balance
  - Better readability for longer tooltip content with left-aligned text

- **Component Helper/Warning Props**: Enhanced flexibility for tooltip content across components
  - Updated `helper`, `warning`, and `preview` text props to accept `string | React.ReactNode`
  - Enables rich content in tooltips including formatted text, icons, or custom elements
  - Applied to: Button, Menu, Dropdown, Input, Select, Slider, SimpleSlider, ActionsList, Chip, ColorChip, IconChip, SectionTitle, Knob
  - Improved component API flexibility while maintaining backward compatibility

### Technical Details

- Updated design tokens for tooltip dimensions across all platform configurations (Figma, Penpot, Sketch, Framer)
- Enhanced tooltip SCSS with conditional text alignment based on tooltip type
- Updated TypeScript interfaces across 12+ components for React.ReactNode support
- Maintained backward compatibility with string-based helper/warning props

## [1.19.40] - 2025-12-04

### Enhanced

- **SectionTitle Component Truncation**: Improved text truncation handling with tooltip protection
  - Added text truncation with ellipsis for long section titles
  - Implemented `flex: 1`, `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap` on title element
  - Protected tooltip icon from being cut off with `flex-shrink: 0`
  - Better layout control for section titles in constrained spaces

- **Accordion Component Layout**: Improved layout and text truncation support
  - Added `min-width: 0` to `.accordion__row__left` for proper flex child text truncation
  - Added `box-sizing: border-box` to `.accordion__row` for consistent sizing
  - Enabled section title truncation within accordion rows
  - Better handling of long text content in accordion headers

### Technical Details

- Enhanced SectionTitle styling with flex-based truncation system
- Improved accordion row layout with proper flex constraints
- Added box-sizing for consistent padding calculations in accordion rows
- Protected interactive elements (tooltips) from being truncated

## [1.19.39] - 2025-12-04

### Enhanced

- **Tabs Component Responsive Behavior**: Improved responsive tab navigation with overflow menu
  - Added `maxVisibleTabs` prop (default: 3) to control maximum visible tabs in responsive mode
  - Implemented intelligent tab overflow: displays 2 tabs + Menu with ellipsis icon when screen ≤460px
  - Enhanced Menu integration: overflow tabs shown in dropdown with proper selection state
  - Force horizontal orientation when screen width ≤460px regardless of `direction` prop
  - Added smart "New" badge on overflow menu when overflow tabs contain new items
  - Improved responsive logic: full tab display on desktop (>460px), overflow menu on mobile (≤460px)

- **Dropdown Component Positioning**: Enhanced dropdown menu positioning accuracy
  - Improved `setPosition()` calculation to align selected item with button text
  - Dynamic height detection from actual list element for theme-accurate positioning
  - Added button padding compensation for precise vertical alignment
  - Accounts for menu padding (`--floating-menu-padding-top`) in position calculations
  - Better cross-theme consistency for Figma, Sketch, Penpot, and Framer

- **Layout Components Flexibility**: Added alignment and wrapping controls to snackbar/stackbar layouts
  - New `--wrap` modifier for flex-wrap behavior
  - Added `--left`, `--center`, `--right` modifiers for horizontal alignment
  - Responsive centering on mobile (≤460px) for better mobile UX
  - Enhanced semantic message actions with centered, wrapped layout

### Fixed

- **Overflow Scrolling Consistency**: Standardized overflow properties across components
  - Changed `overflow-y: auto` to `overflow: hidden auto` for better horizontal overflow prevention
  - Applied to: Consent, Textarea, Select, SortableList, Drawer, and Popin components
  - Prevents unwanted horizontal scrollbars while maintaining vertical scrolling

- **Tabs Component Styling**: Improved tab badge positioning and sizing
  - Adjusted notification badge inset values for Figma theme (xxxsmall → xunit)
  - Fixed notification badge dimensions for Framer and Penpot themes (xxxsmall → xxsmall)
  - Better visual consistency across all design system themes
  - Removed `min-width: fit-content` from tabs for better responsive behavior

### Changed

- **Tooltip Component Enhancement**: Added text-transform control
  - New `--tooltip-text-transform` CSS variable (default: none) for theme customization
  - Applied across all themes (Figma, Penpot, Sketch, Framer) for consistent text rendering

- **Storybook Organization**: Improved story categorization
  - Moved complex components from "Components" to "Patterns" category
  - Recategorized: Consent, Dialog, Bar, Drawer, Form Item, Layout, List, Section, Simple Item
  - Better organization for component discovery and documentation

- **Bar Component Stories**: Enhanced Bar component examples
  - Added fullscreen layout parameter for better demonstration
  - Disabled controls for slot props (leftPartSlot, soloPartSlot, rightPartSlot)
  - Improved truncation examples with proper text styling
  - Added border prop to all stories for better visual consistency

### Technical Details

- Enhanced Tabs component with useRef for menu container ID generation
- Improved responsive tab visibility calculation with dynamic slicing
- Added Menu component integration for overflow tab navigation
- Enhanced dropdown positioning with theme-aware CSS variable detection
- Improved button content height calculation excluding padding
- Added comprehensive responsive alignment utilities to layout SCSS

## [1.19.38] - 2025-12-03

### Fixed

- **ActionsList Component Padding**: Adjusted padding values for selected action items across themes
  - Reduced right padding from `xsmall` to `xxsmall` for better visual balance in selected states
  - Fixed selected focus padding structure in Sketch theme for consistency
  - Updated padding values in Figma, Penpot, and Sketch themes for consistent spacing
  - Improved visual alignment of selected action items across all design systems

### Technical Details

- Updated `actions-list.json` token files for Figma, Penpot, and Sketch platforms
- Changed selected action item right padding from `{size.pos.xsmall}` to `{size.pos.xxsmall}`
- Fixed Sketch theme selectedFocus padding to use individual directional values (top, right, bottom, left)
- Regenerated SCSS files for ActionsList component with updated padding values

## [1.19.37] - 2025-12-02

### Enhanced

- **Tooltip Component with Image Support**: Added native image support to Tooltip component
  - New `image` prop for displaying images within tooltips without manual layout composition
  - Enhanced `WITH_IMAGE` tooltip type with proper image and text alignment
  - Simplified Chip component by leveraging native Tooltip image support
  - Better image rendering with consistent gap spacing between image and text

### Changed

- **Tooltip Component Structure**: Improved internal layout for better content composition
  - Added `tooltip__snack` wrapper for flexible content layout
  - Enhanced styling with proper flexbox alignment and gap management
  - Simplified component usage by removing need for manual layout composition in consumers

- **Chip Component Simplification**: Refactored preview tooltip implementation
  - Removed manual image layout composition in favor of Tooltip's native `image` prop
  - Simplified component by removing unnecessary layout module imports
  - Better separation of concerns between Tooltip rendering and Chip logic

### Added

- **Tooltip Storybook Documentation**: Comprehensive story examples for all tooltip variants
  - Interactive stories for single-line, multi-line, and image tooltips
  - All tooltip types displayed in organized grid layout with proper spacing
  - Examples demonstrating both TOP and BOTTOM pin positions
  - Edge position story showing viewport boundary auto-adjustment
  - Comprehensive AllTooltips story showcasing all variants with visual examples

### Technical Details

- Added `image?: string` prop to Tooltip component interface
- Implemented `tooltip__snack` CSS class with flexbox layout and gap styling
- Enhanced Tooltip component to conditionally render image element when `image` prop is provided
- Updated `.prettierignore` to include `commons.scss` for better build consistency
- Improved Tooltip layout structure with nested presentation wrappers for better styling control

## [1.19.36] - 2025-12-02

### Enhanced

- **Button Component Status Rendering**: Improved conditional rendering logic for button status indicators
  - Status component now only renders when warning prop is defined for icon buttons
  - Chip status (Pro/New badges) no longer displays on icon-type buttons
  - Better visual consistency across different button types

### Technical Details

- Added conditional rendering check for warning prop in icon button template
- Enhanced Status template to check button type before rendering Chip component
- Updated Storybook controls for better icon button configuration

## [1.19.35] - 2025-11-19

### Enhanced

- **SemanticMessage Layout**: Added max-width constraint (400px) for better responsive layout control
- **Select Component Structure**: Improved layout with snackbar wrapper for better tooltip positioning and responsive behavior
- **Background Color Variables**: Standardized semantic message background color variable naming across themes

### Technical Details

- Added semantic-message max-width token across all theme configurations
- Enhanced Select component templates with consistent layout wrapper structure
- Updated background color variable references from base names to `-default` suffix for consistency

## [1.19.34] - 2025-11-19

### Enhanced

- **SemanticMessage Responsive Orientation**: Added automatic vertical orientation on narrow screens (≤460px)
  - Dynamic orientation switching based on document width detection
  - Window resize event handling for real-time responsive adaptation
  - Enhanced mobile layout for better semantic message display

### Technical Details

- Added document width tracking with resize event listeners to SemanticMessage component
- Implemented responsive orientation logic that overrides manual orientation prop on small screens
- Enhanced component state management for viewport dimension tracking

## [1.19.33] - 2025-11-19

### Enhanced

- **Bar Component Responsive Padding**: Improved mobile padding configuration for better responsive design
  - Enhanced mobile padding specification with individual top, right, bottom, left values
  - Refined responsive padding from single `--bar-padding-mobile` to detailed directional padding tokens
  - Better spacing control in mobile layouts with more granular padding configuration

### Technical Details

- Updated bar component padding tokens across all themes (Figma, Penpot, Sketch, Framer)
- Enhanced CSS responsive rules to use individual padding directions for mobile breakpoints
- Improved design token structure for more flexible responsive padding management
- Minor formatting improvements in generated CSS files for better readability

## [1.19.32] - 2025-11-19

### Added

- **Responsive UI Patterns**: Comprehensive responsive behavior across components with 460px breakpoint
  - Button `shouldReflow` prop: labels automatically move to tooltips on narrow screens
  - Dropdown responsive mode: transforms to Menu component on mobile
  - Tabs responsive fallback: converts to dropdown navigation on small screens
  - Select component tooltip handling with optional label rendering for flexible usage

### Enhanced

- **Component Positioning**: Improved Menu and Dropdown viewport management
  - Smart repositioning to prevent overflow outside visible area
  - Enhanced transform calculations for better Menu alignment
  - Added visibility delays for smoother positioning transitions

- **Layout Responsiveness**: Refined responsive layout behavior
  - Flex-wrap support in snackbar layouts and ActionsItem components
  - Better border positioning for mobile (border-left → border-top)
  - Enhanced component dimensions handling in responsive mode

### Fixed

- **Warning Prop Consistency**: Standardized warning prop types across components
  - Removed deprecated `WITH_IMAGE` type from tooltip interfaces
  - Fixed prop type mismatches in Slider, Select, and SimpleSlider components

- **Component Styling**: Minor fixes for better visual consistency
  - Removed fixed dimensions from Dropzone component
  - Updated select component heights (medium → small) for better alignment
  - Enhanced Dialog cover box-sizing for responsive behavior

### Technical Details

- Window resize event handling with proper cleanup across components
- Responsive breakpoint detection at ≤460px with automatic UI adaptation
- Enhanced tooltip management with conditional rendering based on screen size
- Improved component state management for viewport dimension tracking

## [1.19.31] - 2025-11-17

### Fixed

- **Tabs Responsiveness**: Simplified responsive behavior by removing dropdown mode and improving flex layout on small screens

## [1.19.30] - 2025-11-17

### Added

- **Button Helper Tooltip**: Added `helper` prop for contextual tooltips with configurable positioning
- **Tabs Responsive Wrapper**: Enhanced Tabs dropdown mode with proper wrapper structure and ARIA attributes

### Fixed

- **Layout Overflow**: Fixed `overflow: visible` on layout blocks for screens ≤460px to prevent content clipping

## [1.19.29] - 2025-11-17

### Fixed

- **Button Component Label Rendering**: Improved button label rendering to handle optional labels
  - Fixed issue where button label span was always rendered even when label was undefined
  - Added conditional rendering to only display label element when label prop is defined
  - Enhanced component flexibility by allowing buttons with icons only (no label required)
  - Improved DOM structure by avoiding empty label spans in the rendered output

### Technical Details

- Added `label !== undefined` condition before rendering the button label span
- Maintained existing label styling and structure when label is provided
- Enhanced component API flexibility for icon-only button use cases
- Improved DOM cleanliness by preventing unnecessary empty elements

## [1.19.28] - 2025-11-17

### Added

- **Responsive Tabs Component**: Implemented intelligent responsive behavior for navigation tabs
  - Added automatic dropdown fallback for tab navigation on narrow screens (≤460px)
  - Enhanced Tabs component with window width detection using `useState` and `useEffect` hooks
  - Implemented dynamic option mapping that preserves tab functionality in dropdown mode
  - Added proper event handling to maintain `data-feature` attribute consistency between tab and dropdown modes

- **Layout Storybook Documentation**: Created comprehensive Storybook stories for Layout component
  - Added detailed Layout component stories demonstrating responsive behavior
  - Created sample components using Section, SimpleItem, and SectionTitle for realistic examples
  - Implemented TwoColumns and ThreeColumns story variants showcasing different layout configurations
  - Added responsive documentation explaining automatic column-to-row conversion at 460px breakpoint

### Enhanced

- **Layout Component Responsiveness**: Improved Layout component behavior across different screen sizes
  - Added responsive CSS rules with `@media (max-width: 460px)` breakpoint for automatic layout adaptation
  - Enhanced layout to switch from horizontal columns to vertical stacking on small screens
  - Implemented border direction changes: `border-left` converts to `border-top` in responsive mode
  - Added automatic width adjustments with `width: 100%` and constraint resets for responsive columns
  - Fixed height behavior in responsive mode: `height: auto` instead of fixed heights

### Changed

- **Tabs Component API**: Enhanced Tabs component with responsive dropdown integration
  - Added support for automatic UI pattern switching based on viewport width
  - Implemented DropdownOption mapping that preserves original tab functionality
  - Enhanced component to handle both tab navigation and dropdown selection seamlessly
  - Added window resize event handling for real-time responsive behavior

### Technical Details

- Added `useEffect` and `useState` hooks for window width tracking in Tabs component
- Implemented responsive breakpoint detection with proper cleanup of event listeners
- Enhanced Layout CSS with mobile-first responsive design patterns
- Created comprehensive Storybook documentation with realistic component examples
- Added proper TypeScript interfaces for dropdown option mapping from tabs
- Implemented event delegation to maintain consistent action handling across UI patterns

### Documentation

- **Storybook Stories**: Added comprehensive Layout component documentation
  - Created realistic example components using the design system (Section, SimpleItem, SectionTitle)
  - Added detailed story descriptions explaining responsive behavior and breakpoint changes
  - Implemented proper component composition patterns for Layout story examples
  - Added visual examples of two-column and three-column layouts with responsive adaptations

## [1.19.27] - 2025-11-15

### Fixed

- **Menu Component Alignment**: Fixed CSS transform conflicts affecting TOP_RIGHT and TOP_LEFT menu positioning
  - Resolved issue where viewport management transforms were overriding alignment-specific transforms
  - Fixed menus appearing too low when using TOP_RIGHT or TOP_LEFT alignment options
  - Enhanced transform combination logic to preserve both alignment positioning and viewport adjustments
  - Improved transform calculation to properly combine `translateY(-100%)` with viewport `translateX()` adjustments

### Technical Details

- Added intelligent transform combination that preserves base alignment transforms
- Enhanced viewport management to detect and respect existing TOP alignment transforms
- Fixed transform conflicts by properly combining CSS and JavaScript transform values
- Improved positioning logic to handle multiple simultaneous transform operations

## [1.19.26] - 2025-11-15

### Enhanced

- **Menu and Dropdown Components**: Improved positioning and viewport visibility enhancements
  - Added automatic viewport boundary detection to prevent menus from overflowing outside the visible area
  - Implemented smart repositioning for both horizontal and vertical overflow scenarios
  - Enhanced Menu component to use `containerId` prop instead of `parentClassName` for better consistency with Dropdown
  - Added comprehensive viewport management that works in combination with existing parent container positioning
  - Improved menu visibility with proper transform calculations to keep menus within viewport bounds
  - Enhanced accessibility and user experience by ensuring menus remain accessible regardless of screen position

### Changed

- **Menu Component API**: Updated Menu component prop interface for better consistency
  - **BREAKING**: Replaced `parentClassName?: string` with `containerId?: string` prop
  - Unified positioning API between Menu and Dropdown components for consistent developer experience
  - Enhanced ActionsList integration with proper containerId prop passing

### Technical Details

- Implemented dual-layer positioning system: viewport-first, then container-specific adjustments
- Added smart transform calculations using `translateX()` and `translate()` for optimal positioning
- Enhanced both Menu and Dropdown components with identical viewport management logic
- Improved menu visibility logic with proper container-based visibility handling
- Added 8px safety margins from viewport edges to ensure adequate spacing

## [1.19.25] - 2025-11-15

### Enhanced

- **ColorItem Component**: Enhanced ColorItem component to manage removal state and improve styling
  - Added removal state management for better user interaction
  - Improved component styling for enhanced visual feedback
  - Better handling of color item removal workflows

## [1.19.24] - 2025-10-31

### Changed

- Card: remove unnecessary `justify-content` property from card styles

### Fixed

- Card: make `richText` and `actions` props optional in `Card` component
- Build: update `.prettierignore` to include Framer and Figma related styles and ensure `penpot.scss` is ignored

## [1.19.23] - 2025-10-31

### Fixed

- Make `src` prop optional and ensure proper rendering of asset and actions styles

## [1.19.22] - 2025-10-30

### Changed

- Adjust tab padding sizes in SCSS and token JSON for consistency across Figma and Sketch platforms

## [1.19.21] - 2025-10-29

### Changed

- Refactor Framer theme SCSS variable syntax to use double quotes for consistency across components and stylesheets

### Fixed

- Update accordion styles to use null size for row gap across themes (commit aa61978d)

## [1.19.20] - 2025-10-29

### Fixed

- Update tab notification dimensions to use `xxsmall` size

## [1.19.19] - 2025-10-29

### Fixed

- Tabs: clicking the "New" badge now triggers the parent tab and returns the correct `data-feature` id

## [1.19.18] - 2025-10-28

### Fixed

- Adjust popin component height settings for better responsiveness

## [1.19.17] - 2025-10-28

### Added / Changed

- Add centered alignment options to snackbar and stackbar components

## [1.19.16] - 2025-10-27

### Fixed

- Remove `isDisabled` and `isBlocked` props from `Accordion` component

## [1.19.15] - 2025-10-26

### Fixed

- Remove overflow:auto from `bar__left`, `bar__right`, and `bar__solo` elements

## [1.19.14] - 2025-10-26

### Added

- Bar component: add clipping/truncation functionality and update stories

## [1.19.13] - 2025-10-26

### Fixed

- Ensure overflow is auto for `bar__left`, `bar__right`, and `bar__solo` elements

## [1.19.12] - 2025-10-26

### Fixed

- Remove overflow hidden from `bar__left`, `bar__right`, and `bar__solo` elements

## [1.19.11] - 2025-10-26

### Fixed

- Ensure overflow is hidden for `bar__left`, `bar__right`, and `bar__solo` elements

## [1.19.9] - 2025-10-24

### Added

- **FormItem Baseline Alignment**: Added `isBaseline` prop to FormItem component for better text alignment
  - New baseline alignment option for improved layout when using text content as children
  - Enhanced FormItem styling with `form-item--baseline` modifier class
  - Better visual consistency when mixing interactive and text-only form items

### Changed

- **FormItem Component Enhancement**: Improved FormItem component flexibility and styling
  - Added baseline alignment styling that removes margins from labels and chips
  - Enhanced row alignment to use baseline positioning when `isBaseline` is enabled
  - Improved component API with better prop organization

- **ColorItem Props Refinement**: Improved ColorItem component prop structure
  - Made `id` prop optional for better component flexibility
  - Reordered props for better logical grouping and readability

### Added

- **Storybook Documentation**: Enhanced FormItem component documentation
  - Added new `SimpleTextItem` story demonstrating text content usage with baseline alignment
  - Improved story examples with proper text styling using design system typography
  - Better demonstration of FormItem component versatility

### Technical Details

- Added `isBaseline` prop to FormItem interface with default value of `false`
- Implemented `form-item--baseline` CSS class with baseline alignment and margin resets
- Enhanced FormItem stories with text styling import and baseline alignment example
- Improved ColorItem prop types with optional `id` prop for better developer experience

## [1.19.8] - 2025-10-20

### Added

- **Dropzone Disabled State**: Added comprehensive disabled state support to Dropzone component
  - New disabled visual styling with appropriate background, border, and cursor states
  - Consistent disabled appearance across all supported themes (Figma, Penpot, Sketch, Framer)
  - Proper accessibility support with `pointer-events: none` and `cursor: not-allowed`
  - Automatic disabled state activation when `isBlocked` or `isDisabled` props are true

### Changed

- **Dropzone Theme Tokens**: Enhanced design token system for Dropzone component
  - Added disabled-specific tokens for background color, border color, width, offset, and style
  - Updated all theme configurations (Figma, Penpot, Sketch, Framer) with disabled state tokens
  - Improved semantic message background color handling in disabled state
  - Refined Framer theme default background color for better consistency

### Technical Details

- Added `dropzone--disabled` CSS class with comprehensive disabled styling
- Implemented disabled state tokens across all design system themes
- Enhanced component logic to apply disabled class when `isBlocked` or `isDisabled` is true
- Updated design token JSON files for all platforms with disabled state specifications
- Improved theme consistency with proper disabled color mappings

## [1.19.7] - 2025-10-19

### Fixed

- **Figma Icon Correction**: Fixed visual inconsistency in Figma `caret-down` icon
  - Corrected icon design to match Figma's design system specifications
  - Improved visual consistency across Figma-themed components
  - Enhanced icon clarity and alignment

### Technical Details

- Updated Figma `caret-down` icon SVG for better visual fidelity
- Maintained icon sizing and positioning while improving design accuracy

## [1.19.6] - 2025-10-19

### Changed

- **Release Workflow Enhancement**: Improved GitHub release automation
  - Updated release workflow to include date in release names for better identification
  - Enhanced release notes generation for more informative GitHub releases
  - Streamlined release process with better date formatting

### Technical Details

- Modified GitHub Actions workflow to automatically append current date to release names
- Improved release automation for better release tracking and identification

## [1.19.5] - 2025-10-19

### Changed

- **CSS Values Adjustment**: Minor CSS value corrections for improved visual consistency
  - Updated two CSS property values for better component alignment and spacing
  - Refined styling parameters to enhance overall visual coherence

### Technical Details

- Adjusted specific CSS values to improve component rendering and visual balance
- Minor styling refinements for better cross-browser consistency

## [1.19.4] - 2025-10-15

### Fixed

- **Framer Theme Icon Sizing**: Fixed icon width and positioning inconsistencies in Framer theme
  - Corrected icon width from `msmall` to `medium` for better visual balance
  - Updated input padding with icon to match new icon dimensions
  - Fixed icon color variables to ensure both letter and picto icons use consistent colors

### Changed

- **Input Component Spacing**: Improved input component spacing and positioning in Framer theme
  - Adjusted clearable button positioning from `xunit` to `xxxsmall` for better alignment
  - Updated popin footer padding from `xxsmall` to `msmall` for improved spacing
  - Refined input token values for more consistent visual hierarchy

### Technical Details

- Updated Framer theme tokens for input icon width (`size.pos.medium` instead of `size.pos.msmall`)
- Fixed clearable button positioning tokens (`size.pos.xxxsmall` instead of `size.pos.xunit`)
- Added `--icon-picto-color` CSS variable for consistent icon coloring
- Improved popin footer padding tokens for better visual spacing
- Enhanced input padding calculations to accommodate updated icon dimensions

## [1.19.3] - 2025-10-14

### Fixed

- **Framer Theme Inconsistencies**: Corrected various inconsistencies in the Framer design system implementation
  - Fixed styling discrepancies between Framer theme and other platform themes
  - Resolved component-specific styling issues affecting visual consistency
  - Improved theme token mappings for better cross-platform alignment

### Changed

- **Theme Consistency**: Enhanced visual coherence across all supported design systems
  - Standardized component styling patterns for better maintainability
  - Improved token usage consistency in Framer-specific components
  - Better alignment with Framer design system guidelines

### Technical Details

- Corrected inconsistent CSS variable usage in Framer theme components
- Fixed theme-specific styling overrides that were causing visual discrepancies
- Improved component token inheritance for better theme consistency

## [1.19.2] - 2025-10-14

### Fixed

- **Framer Styles Export**: Fixed missing export of Framer CSS modules in the main library bundle
  - Added direct imports for `framer-colors.module.scss` and `framer-types.module.scss` to index.ts
  - Framer theme styles now properly available when consuming the library
  - Resolved issue where Framer styling was not accessible in production builds

### Changed

- **Build Process**: Simplified build pipeline by removing post-build CSS fix script
  - Removed `fix-css-modules.mjs` script in favor of direct module imports
  - Streamlined build command from `tsc && vite build && node scripts/fix-css-modules.mjs` to `tsc && vite build`
  - More reliable CSS module inclusion through explicit imports rather than post-build copying

### Technical Details

- Removed automated CSS module fix script (`scripts/fix-css-modules.mjs`)
- Added explicit Framer theme CSS module imports to main entry point
- Simplified build process while maintaining consistent CSS module availability
- Improved library distribution reliability for Framer theme assets

## [1.19.1] - 2025-10-14

### Fixed

- **Framer Colors CSS Module Generation**: Fixed issue where `framer-colors.css` was not being generated in the `dist/assets/styles/tokens/modules/` directory
  - Resolved Vite optimization behavior that treated smaller CSS files differently
  - Added automated CSS module fix script to ensure consistent module generation
  - All Framer color tokens now properly available as CSS modules for import

### Changed

- **Build System**: Enhanced build process with automated CSS module validation
  - Added `fix-css-modules.mjs` script to ensure consistent CSS module generation
  - Converted build scripts to ES modules for better consistency with project structure
  - Improved reliability of CSS token distribution in library builds

### Technical Details

- Implemented post-build validation script that detects and fixes missing CSS modules
- Fixed Vite configuration regex filter that was incorrectly excluding color module files
- Enhanced build pipeline to automatically copy missing CSS modules to proper distribution directories
- Converted CommonJS scripts to ES modules (`.mjs`) for modern JavaScript compatibility

## [1.19.0]

### Added

- **Framer Theme Support**: Complete theme implementation for Framer design system
  - Full Framer color palette, typography, and spacing tokens
  - Platform-specific component styling for Framer
  - Framer-compatible icons and visual elements
- **New Members List Component**: Interactive member avatar display component
  - Support for avatar stacking with configurable display count
  - Tooltip integration for member information
  - `isInverted` prop for flexible z-index management
- **Enhanced Component Library**: Comprehensive Framer theme support across all components
  - Actions List, Buttons, Inputs, Dropdowns, Tabs
  - Dialog systems, Notifications, Form components
  - List components, Layout components, and more

### Changed

- **Input Components**: Improved styling consistency across platforms
  - Unified padding and height variables for better alignment
  - Enhanced color chip and icon positioning
  - Better focus and error state handling
- **Select Component**: Complete refactoring for better maintainability
  - Improved accessibility with proper ARIA labels
  - Enhanced disabled state styling
  - Better box-sizing and positioning control
- **Typography System**: Updated font weights and letter spacing for consistency
- **Component Tokens**: Platform-specific token refinements
  - Improved border radius usage across components
  - Enhanced color token mappings for better theme consistency
  - Optimized spacing and sizing tokens

### Fixed

- **Letter Spacing**: Corrected letter spacing values across all text tokens
- **Border Radius**: Fixed border radius aliases and raw value usage
- **Input Container**: Improved input container radius calculations
- **Color Mapping**: Fixed background color mappings in Framer theme
- **Z-Index Issues**: Resolved input z-index conflicts
- **Icon Fonts**: Ensured icon letter font sizes are properly applied

### Improved

- **Theme Consistency**: Better visual alignment between Figma, Penpot, Sketch, and Framer
- **Token Management**: More robust token system with proper aliases
- **Component Reliability**: Enhanced component stability and predictable behavior
- **Developer Experience**: Better component APIs and prop consistency

### Technical Details

- Added comprehensive Framer configuration files across all component categories
- Implemented platform-specific token generation for Framer
- Enhanced SCSS build system to support multi-platform token generation
- Improved component-level token management and inheritance
- Added proper TypeScript types for new component features

### Platform Support

- **Figma**: Continued full support with optimizations
- **Penpot**: Enhanced theme compatibility and visual consistency
- **Sketch**: Improved component styling and token accuracy
- **Framer**: **NEW** - Complete design system implementation with full component library support

## [1.18.1]

### Changed

- **Icons**: Updated SVG icons for consistency and improved design
  - Refactored Figma icons: check, help, repository, star-off, star-on, user
  - Updated Penpot icons: star-off, star-on
  - Updated Sketch repository icon with improved styling and opacity effects

### Improved

- Better visual consistency across icon sets
- Enhanced icon styling with proper opacity and fill rules
- Improved accessibility and visual clarity

## [1.18.0]

### Added

- Design Tokens Community Group (DTCG) implementation with Terrazzo
- Theme system supporting Figma, Penpot, and Sketch design systems
- Theme Generator tool for creating custom themes
- SCSS Builder for generating theme-specific stylesheets
- Comprehensive tokens for colors, typography, spacing, and effects
- Platform-specific token configurations

### Changed

- **BREAKING**: Complete migration from traditional CSS to DTCG tokens
- Storybook theme system updated to use new token-based themes
- Component styling now uses design tokens for consistency
- Theme switching mechanism improved for better performance

### Improved

- Better design consistency across different platforms
- Easier theme customization and maintenance
- Scalable token management system
- Enhanced documentation with theme generator guide

### Technical Details

- Added `@terrazzo/cli` and related plugins for token processing
- Implemented automatic SCSS generation from JSON tokens
- Created modular token system with globals, colors, typography, and component-specific tokens
- Added support for component-specific token building
- Integrated token validation and linting

### Migration Notes

This version introduces a major architectural change in how styling is handled:

1. **Token Structure**: All design values are now defined as DTCG-compliant JSON tokens
2. **Theme System**: Themes are generated from token configurations
3. **Component Updates**: All components now consume design tokens instead of hard-coded CSS values
4. **Build Process**: SCSS files are automatically generated from tokens using Terrazzo

### Platform Support

- **Figma**: Full token support with Figma UI theme compatibility
- **Penpot**: Complete theme implementation for Penpot design system
- **Sketch**: Theme support matching Sketch's design language

[1.21.3]: https://github.com/yelbolt/unoff-utils/compare/v1.23.2...v1.23.3
