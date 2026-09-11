/**
 * Component manifest — the single source of truth for which component token
 * sets exist, where their SCSS lands, and which token namespaces each one owns.
 *
 * `include` is what scopes a component's output. Every component token set is
 * loaded into one Terrazzo config, so an output must name the namespaces it
 * owns rather than exclude everything it doesn't.
 *
 * Two entries are not derivable from the name:
 *   - `button` owns both `button.*` and `iconButton.*`
 *   - `icon` collides with the platform-level icon.json (which declares the
 *     same `icon` root for its 120 asset paths), so it names its children
 */
export const COMPONENTS = [
  { name: 'accordion', category: 'actions', include: ['accordion.**'] },
  { name: 'actions-item', category: 'lists', include: ['actionsItem.**'] },
  { name: 'actions-list', category: 'lists', include: ['actionsList.**'] },
  { name: 'avatar', category: 'assets', include: ['avatar.**'] },
  { name: 'bar', category: 'slots', include: ['bar.**'] },
  { name: 'button', category: 'actions', include: ['button.**', 'iconButton.**'] },
  { name: 'card', category: 'actions', include: ['card.**'] },
  { name: 'chip', category: 'tags', include: ['chip.**'] },
  { name: 'color-chip', category: 'tags', include: ['colorChip.**'] },
  { name: 'color-item', category: 'lists', include: ['colorItem.**'] },
  { name: 'consent', category: 'dialogs', include: ['consent.**'] },
  { name: 'dialog', category: 'dialogs', include: ['dialog.**'] },
  { name: 'draggable-item', category: 'lists', include: ['draggableItem.**'] },
  { name: 'draggable-window', category: 'slots', include: ['draggableWindow.**'] },
  { name: 'drawer', category: 'slots', include: ['drawer.**'] },
  { name: 'dropdown', category: 'inputs', include: ['dropdown.**'] },
  { name: 'dropzone', category: 'inputs', include: ['dropzone.**'] },
  { name: 'form-item', category: 'slots', include: ['formItem.**'] },
  { name: 'icon-chip', category: 'tags', include: ['iconChip.**'] },
  { name: 'icon', category: 'assets', include: ['icon.width', 'icon.height', 'icon.picto.**', 'icon.letter.**'] },
  { name: 'input', category: 'inputs', include: ['input.**'] },
  { name: 'inputs-bar', category: 'inputs', include: ['inputsBar.**'] },
  { name: 'keyboard-shortcut-item', category: 'lists', include: ['keyboardShortcutItem.**'] },
  { name: 'knob', category: 'actions', include: ['knob.**'] },
  { name: 'layout', category: 'slots', include: ['layout.**'] },
  { name: 'list', category: 'slots', include: ['list.**'] },
  { name: 'members-list', category: 'lists', include: ['membersList.**'] },
  { name: 'menu', category: 'actions', include: ['menu.**'] },
  { name: 'message', category: 'dialogs', include: ['message.**'] },
  { name: 'multiple-slider', category: 'inputs', include: ['multipleSlider.**'] },
  { name: 'notification', category: 'dialogs', include: ['notification.**'] },
  { name: 'popin', category: 'slots', include: ['popin.**'] },
  { name: 'section-title', category: 'assets', include: ['sectionTitle.**'] },
  { name: 'section', category: 'slots', include: ['section.**'] },
  { name: 'segmented-control', category: 'actions', include: ['segmentedControl.**'] },
  { name: 'select', category: 'inputs', include: ['select.**'] },
  { name: 'semantic-message', category: 'dialogs', include: ['semanticMessage.**'] },
  { name: 'simple-item', category: 'slots', include: ['simpleItem.**'] },
  { name: 'simple-slider', category: 'inputs', include: ['simpleSlider.**'] },
  { name: 'sortable-list', category: 'lists', include: ['sortableList.**'] },
  { name: 'tabs', category: 'lists', include: ['tabs.**'] },
  { name: 'thumbnail', category: 'assets', include: ['thumbnail.**'] },
  { name: 'tooltip', category: 'tags', include: ['tooltip.**'] },
]

/** Primitive and semantic families that must never reach a component stylesheet. */
export const PRIMITIVE_EXCLUDES = [
  'font.**',
  'control.**',
  'radius.**',
  'space.**',
  'stroke.**',
  'type.**',
  'scale.**',
  'shadow.**',
  'border.**',
  'grey.**',
  'alpha.**',
  'elevation.**',
  'text.**',
  'motion.**',
  'duration.**',
  'easing.**',
  'transform.**',
]
