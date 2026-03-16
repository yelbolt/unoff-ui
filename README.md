![GitHub package.json version](https://img.shields.io/github/package-json/v/yelbolt/unoff-ui?color=informational) ![GitHub last commit](https://img.shields.io/github/last-commit/yelbolt/unoff-ui?color=informational) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yelbolt/unoff-ui/npm.yml?label=npm) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yelbolt/unoff-ui/chromatic.yml?label=Chromatic) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yelbolt/unoff-ui/deploy.yml?label=Deployment)
![GitHub](https://img.shields.io/github/license/yelbolt/unoff-ui?color=informational)

# Unoff UI

Unoff UI is a comprehensive library of UI components designed specifically for building Figma, Penpot, and Sketch plugins. It leverages modern tools and frameworks to ensure a seamless development experience.

<img width="1280" height="640" alt="image" src="https://github.com/user-attachments/assets/a4c6c693-db16-43a8-a553-28362380a1b3" />

## Features

- **Built with React**: A popular JavaScript library for building user interfaces
- **Bundled with Vite**: Fast and optimized build tool for modern web projects
- **Tested with Vitest**: Ensures reliability and robustness of components with interaction tests
- **Exposed with Storybook**: Interactive UI component explorer for easy development and testing
- **Design tokens with Terrazzo**: Theme management using design tokens for consistent styling across platforms. [View Terrazzo Guide](./docs/terrazzo-guide.md)
- **Theme Generator**: Create custom themes easily with the [Theme Generator](./docs/theme-generator.md) tool based on Figma theme structure
- **SCSS Builder**: Generate theme-specific SCSS files from tokens using the build-scss script, with support for building components across all themes
- **Interaction Testing**: Automated interaction tests for all components using Storybook play functions.

## Installation

To install Unoff UI, use npm or yarn:

```bash
npm install @unoff/ui
# or
yarn add @unoff/ui
```

## Testing

Unoff UI comes with comprehensive interaction tests for all components:

```bash
# Run only Storybook interaction tests
npm run test:storybook
```

Tests can also be run directly in Storybook UI:

1. Start Storybook: `npm run storybook`
2. Open the Tests panel in the sidebar
3. Click "Run all" to execute all interaction tests

## Theme Development Tools

Unoff UI provides powerful tools for creating and managing custom themes:

### Theme Generator

Create new themes based on existing design systems (Sketch, Figma UI, etc.) with a single command:

```bash
npm run create:theme
```

The Theme Generator automates the creation of all necessary files and configurations:

- Tokens JSON files
- Terrazzo configuration
- Storybook integration
- SCSS imports

[Learn more about the Theme Generator](./docs/theme-generator.md)

### SCSS Builder

Generate theme-specific SCSS files from design tokens with these commands:

```bash
# List available themes and components
npm run scss:list

# Build all SCSS files
npm run scss:build

# Build SCSS for a specific theme
npm run scss:build theme=themeName

# Build SCSS for a specific component across all themes
npm run scss:build component=componentName

# Build SCSS for a specific component within a specific theme
npm run scss:build theme=themeName component=componentName

# Build specific token types across all themes
npm run scss:build text
npm run scss:build color
npm run scss:build icon
npm run scss:build type

# Build specific token types for a specific theme
npm run scss:build theme=themeName text
npm run scss:build theme=themeName color
```

## Usage

### Slots

#### Bar

```tsx
import { Bar } from '@unoff/ui'

function App() {
  return (
    <Bar
      leftPartSlot={<div>Left very long text that may be truncated</div>}
      rightPartSlot={<div>Right very long text that may be truncated</div>}
      truncate={['LEFT', 'RIGHT']}
      padding="12px"
    />
  )
}
```

#### Form Item

```tsx
import { FormItem } from '@unoff/ui'
import { Input } from '@unoff/ui'

function App() {
  return (
    <FormItem
      id="text-input-item"
      label="Type your name"
      helper={{
        type: 'INFO',
        message: 'First name followed by your last name',
      }}
      shouldFill={false}
      isBlocked={false}
      isNew={false}
    >
      <Input
        id="text-input-item"
        type="TEXT"
        value="Jean-Michel Avous"
      />
    </FormItem>
  )
}
```

#### Section

```tsx
import { Section } from '@unoff/ui'

function App() {
  return (
    <Section
      title="Section Title"
      description="Section description goes here"
      isNew={false}
    >
      <div>Section content goes here</div>
    </Section>
  )
}
```

#### Drawer

```tsx
import { Drawer } from '@unoff/ui'

function App() {
  return (
    <Drawer
      title="Drawer Title"
      isOpen={true}
      onClose={() => console.log('Drawer closed')}
    >
      <div>Drawer content goes here</div>
    </Drawer>
  )
}
```

### Actions

#### Primary Button

```tsx
import { Button } from '@unoff/ui'

function App() {
  return (
    <Button
      type="primary"
      size="default"
      label="Primary action button"
      preview={{
        image: 'https://placehold.co/96x96',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }}
      feature="PRIMARY_ACTION"
      action={() => console.log('Primary button clicked')}
    />
  )
}
```

#### Secondary Button

```tsx
import { Button } from '@unoff/ui'

function App() {
  return (
    <Button
      type="secondary"
      size="default"
      label="Secondary action button"
      feature="SECONDARY_ACTION"
      action={() => console.log('Secondary button clicked')}
    />
  )
}
```

#### Tertiary Button

```tsx
import { Button } from '@unoff/ui'

function App() {
  return (
    <Button
      type="tertiary"
      label="Tertiary action button"
      feature="TERTIARY_ACTION"
      isLink={true}
      url="https://example.com"
      action={() => console.log('Tertiary button clicked')}
    />
  )
}
```

#### Destructive Button

```tsx
import { Button } from '@unoff/ui'

function App() {
  return (
    <Button
      type="destructive"
      size="default"
      label="Destructive action button"
      feature="DESTRUCTIVE_ACTION"
      action={() => console.log('Destructive button clicked')}
    />
  )
}
```

#### Icon Button

```tsx
import { Button } from '@unoff/ui'

function App() {
  return (
    <Button
      type="icon"
      size="default"
      state="default"
      icon="adjust"
      helper={{
        label: 'Adjust',
        type: 'SINGLE_LINE',
      }}
      action={() => console.log('Icon button clicked')}
    />
  )
}
```

### Inputs

#### Short Text Input

```tsx
import { Input } from '@unoff/ui'

function App() {
  return (
    <Input
      id="short-text-typing"
      type="TEXT"
      placeholder="Type something (64 characters max.)…"
      value=""
      charactersLimit={64}
      feature="TYPE_SHORT_TEXT"
      state="DEFAULT"
      isAutoFocus={false}
      isClearable={false}
      isFramed={true}
      onChange={(e) => console.log(e.target.value)}
    />
  )
}
```

#### Long Text Input

```tsx
import { Input } from '@unoff/ui'

function App() {
  return (
    <Input
      id="long-text-typing"
      type="LONG_TEXT"
      placeholder="Type something"
      value=""
      feature="TYPE_LONG_TEXT"
      state="DEFAULT"
      isGrowing={false}
      onChange={(e) => console.log(e.target.value)}
    />
  )
}
```

#### Color Picker

```tsx
import { Input } from '@unoff/ui'

function App() {
  return (
    <Input
      id="color-picker"
      type="COLOR"
      value="#87ebe7"
      feature="PICK_COLOR"
      onChange={(e) => console.log(e.target.value)}
    />
  )
}
```

#### Numeric Stepper

```tsx
import { Input } from '@unoff/ui'

function App() {
  return (
    <Input
      id="numeric-stepper"
      type="NUMBER"
      icon={{
        type: 'LETTER',
        value: 'H',
      }}
      value="20"
      min="0"
      max="100"
      step="1"
      feature="ADJUST_NUMBER"
      onChange={(e) => console.log(e.target.value)}
    />
  )
}
```

### Dropdown

#### Single Selection

```tsx
import { Dropdown } from '@unoff/ui'

function App() {
  return (
    <Dropdown
      id="dropdown-button"
      options={[
        {
          label: 'Option 1',
          value: 'OPTION_1',
          type: 'OPTION',
        },
        {
          label: 'Option 2',
          value: 'OPTION_2',
          type: 'OPTION',
          children: [
            {
              label: 'Option 2.1',
              value: 'OPTION_2.1',
              type: 'OPTION',
            },
            {
              label: 'Option 2.2',
              value: 'OPTION_2.2',
              type: 'OPTION',
            },
          ],
        },
        {
          type: 'SEPARATOR',
        },
        {
          label: 'Title',
          type: 'TITLE',
        },
        {
          label: 'Option 3',
          value: 'OPTION_3',
          type: 'OPTION',
        },
      ]}
      selected="OPTION_1"
      alignment="LEFT"
      onChange={(value) => console.log(value)}
    />
  )
}
```

#### Multiple Selection

```tsx
import { Dropdown } from '@unoff/ui'

function App() {
  return (
    <Dropdown
      id="dropdown-button"
      options={[
        {
          label: 'All',
          value: 'ANY',
          type: 'OPTION',
        },
        {
          label: 'Option 1',
          value: 'OPTION_1',
          type: 'OPTION',
        },
        {
          label: 'Option 2',
          value: 'OPTION_2',
          type: 'OPTION',
        },
      ]}
      selected={['ANY']}
      alignment="LEFT"
      onChange={(values) => console.log(values)}
    />
  )
}
```

### Sliders

#### Simple Slider

```tsx
import { SimpleSlider } from '@unoff/ui'

function App() {
  return (
    <SimpleSlider
      id="simple-slider"
      label="Simple Slider"
      value={50}
      min={0}
      max={100}
      colors={{
        min: 'white',
        max: 'black',
      }}
      feature="ADJUST_VALUE"
      onChange={(feature, type, value) => console.log(value)}
    />
  )
}
```

#### Multiple Slider

```tsx
import { MultipleSlider } from '@unoff/ui'

function App() {
  return (
    <MultipleSlider
      id="multiple-slider"
      label="Multiple Slider"
      stops={[
        { id: 'stop-1', value: 20 },
        { id: 'stop-2', value: 50 },
        { id: 'stop-3', value: 80 },
      ]}
      min={0}
      max={100}
      colors={{
        min: 'white',
        max: 'black',
      }}
      feature="ADJUST_VALUES"
      onChange={(feature, type, value) => console.log(value)}
    />
  )
}
```

### Dialogs

#### Simple Dialog

```tsx
import { Dialog } from '@unoff/ui'

function App() {
  return (
    <Dialog
      title="Are you sure to delete?"
      actions={{
        destructive: {
          label: 'Delete',
          action: () => console.log('Delete action'),
        },
        secondary: {
          label: 'Cancel',
          action: () => console.log('Cancel action'),
        },
      }}
      pin="CENTER"
      onClose={() => console.log('Dialog closed')}
    >
      <div className="dialog__text">
        <p>Deleting this item will remove it permanently.</p>
      </div>
    </Dialog>
  )
}
```

#### Form Dialog

```tsx
import { Dialog } from '@unoff/ui'
import { Input } from '@unoff/ui'
import { FormItem } from '@unoff/ui'

function App() {
  return (
    <Dialog
      title="What do you want to say?"
      actions={{
        primary: {
          label: 'Submit',
          action: () => console.log('Submit action'),
        },
      }}
      pin="CENTER"
      onClose={() => console.log('Dialog closed')}
    >
      <div className="dialog__form">
        <div className="dialog__form__item">
          <FormItem
            label="Full Name"
            id="type-fullname"
            shouldFill
          >
            <Input type="TEXT" />
          </FormItem>
        </div>
        <div className="dialog__form__item">
          <FormItem
            label="Email"
            id="type-email"
            shouldFill
          >
            <Input type="TEXT" />
          </FormItem>
        </div>
        <div className="dialog__form__item">
          <FormItem
            label="Message"
            id="type-message"
            shouldFill
          >
            <Input
              type="LONG_TEXT"
              placeholder="Type your message here"
            />
          </FormItem>
        </div>
      </div>
    </Dialog>
  )
}
```

#### Loading Dialog

```tsx
import { Dialog } from '@unoff/ui'

function App() {
  return (
    <Dialog
      title="Loading…"
      pin="CENTER"
      isLoading={true}
      onClose={() => console.log('Dialog closed')}
    />
  )
}
```

### Lists

#### Simple List

```tsx
import { ActionsList } from '@unoff/ui'

function App() {
  return (
    <ActionsList
      options={[
        {
          label: 'Option 1',
          value: 'OPTION_1',
          type: 'OPTION',
          action: () => console.log('Option 1 clicked'),
        },
        {
          label: 'Option 2',
          value: 'OPTION_2',
          type: 'OPTION',
          action: () => console.log('Option 2 clicked'),
        },
        {
          label: 'Option 3',
          value: 'OPTION_3',
          type: 'OPTION',
          action: () => console.log('Option 3 clicked'),
        },
        {
          label: 'Option 4',
          value: 'OPTION_4',
          type: 'OPTION',
          action: () => console.log('Option 4 clicked'),
        },
      ]}
      selected="OPTION_1"
    />
  )
}
```

#### Grouped List

```tsx
import { ActionsList } from '@unoff/ui'

function App() {
  return (
    <ActionsList
      options={[
        {
          label: 'Group 1',
          type: 'TITLE',
        },
        {
          label: 'Option 1',
          value: 'OPTION_1',
          type: 'OPTION',
          action: () => console.log('Option 1 clicked'),
        },
        {
          label: 'Option 2',
          value: 'OPTION_2',
          type: 'OPTION',
          action: () => console.log('Option 2 clicked'),
        },
        {
          type: 'SEPARATOR',
        },
        {
          label: 'Group 2',
          type: 'TITLE',
        },
        {
          label: 'Option 3',
          value: 'OPTION_3',
          type: 'OPTION',
          action: () => console.log('Option 3 clicked'),
        },
        {
          label: 'Option 4',
          value: 'OPTION_4',
          type: 'OPTION',
          action: () => console.log('Option 4 clicked'),
        },
      ]}
    />
  )
}
```

#### Nested List

```tsx
import { ActionsList } from '@unoff/ui'

function App() {
  return (
    <ActionsList
      options={[
        {
          label: 'Group 1',
          value: 'GROUP_1',
          type: 'OPTION',
          children: [
            {
              label: 'Option 1',
              value: 'OPTION_A_1',
              type: 'OPTION',
              action: () => console.log('Option A.1 clicked'),
            },
            {
              label: 'Option 2',
              value: 'OPTION_A_2',
              type: 'OPTION',
              action: () => console.log('Option A.2 clicked'),
            },
          ],
        },
        {
          label: 'Group 2',
          value: 'GROUP_2',
          type: 'OPTION',
          children: [
            {
              label: 'Option 1',
              value: 'OPTION_B_1',
              type: 'OPTION',
              action: () => console.log('Option B.1 clicked'),
            },
            {
              label: 'Option 2',
              value: 'OPTION_B_2',
              type: 'OPTION',
              action: () => console.log('Option B.2 clicked'),
            },
          ],
        },
      ]}
    />
  )
}
```

### Tags

#### Basic Chip

```tsx
import { Chip } from '@unoff/ui'

function App() {
  return <Chip state="ACTIVE">New</Chip>
}
```

#### Chip with Color Indicator

```tsx
import { Chip, ColorChip } from '@unoff/ui'

function App() {
  return (
    <Chip
      state="ON_BACKGROUND"
      leftSlot={
        <ColorChip
          color="blue"
          width="8px"
          height="8px"
          isRounded={true}
        />
      }
      rightSlot={<div style={{ fontSize: '11px' }}>✔︎</div>}
    >
      AA
    </Chip>
  )
}
```

### Assets

#### Icon

```tsx
import { Icon } from '@unoff/ui'

function App() {
  return (
    <>
      {/* Pictogram Icon */}
      <Icon
        type="PICTO"
        iconName="adjust"
      />

      {/* Letter Icon */}
      <Icon
        type="LETTER"
        iconLetter="L"
      />
    </>
  )
}
```

#### Avatar

```tsx
import { Avatar } from '@unoff/ui'

function App() {
  return (
    <>
      {/* Avatar with Image */}
      <Avatar
        avatar="https://example.com/avatar.jpg"
        fullName="John Doe"
        isInverted={false}
      />

      {/* Default Avatar */}
      <Avatar isInverted={false} />
    </>
  )
}
```

#### Thumbnail

```tsx
import { Thumbnail } from '@unoff/ui'

function App() {
  return (
    <Thumbnail
      src="https://example.com/image.jpg"
      width="300px"
      height="200px"
    />
  )
}
```

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
