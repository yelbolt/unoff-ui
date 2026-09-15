import React from 'react'
import { useGlobals } from 'storybook/manager-api'
import {
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from 'storybook/internal/components'
import { PaintBrushIcon } from '@storybook/icons'
import { THEMES, MODE_ITEMS, needsModeStep } from './theme-config'

type Step = 'theme' | 'family' | 'mode'

interface StepLink {
  id: string
  title: string
  active?: boolean
  closesMenu: boolean
  onClick: () => void
}

function currentLabel(
  theme: string | undefined,
  family: string | undefined,
  mode: string | undefined
): string {
  if (!theme) {
    return 'Theme'
  }
  const entry = THEMES[theme]
  const parts = [entry?.title ?? theme]
  const familyItem = entry?.families?.find((f) => f.value === family)
  if (familyItem && !familyItem.isBaseline) {
    parts.push(familyItem.title)
  }
  if (!familyItem?.fixedDataMode && mode) {
    parts.push(mode === 'dark' ? 'Dark' : 'Light')
  }
  return parts.join(' · ')
}

export const ThemeTool: React.FC = () => {
  const [globals, updateGlobals] = useGlobals()
  const [step, setStep] = React.useState<Step>('theme')

  const theme = globals.themes as string | undefined
  const family = globals.family as string | undefined
  const mode = globals.mode as string | undefined

  const entry = theme ? THEMES[theme] : undefined
  const hasFamilies = !!entry?.families?.length

  let links: StepLink[]

  if (step === 'theme') {
    links = Object.entries(THEMES).map(([value, config]) => ({
      id: value,
      title: config.title,
      active: value === theme,
      closesMenu: false,
      onClick: () => {
        updateGlobals({ themes: value })
        setStep(config.families?.length ? 'family' : 'mode')
      },
    }))
  } else if (step === 'family' && theme && hasFamilies) {
    links = [
      {
        id: '__back',
        title: '← Back',
        closesMenu: false,
        onClick: () => setStep('theme'),
      },
      ...entry!.families!.map((item) => ({
        id: item.value,
        title: item.title,
        active: item.value === family,
        closesMenu: !!item.fixedDataMode,
        onClick: () => {
          updateGlobals({ family: item.value })
          if (needsModeStep(theme, item.value)) {
            setStep('mode')
          }
        },
      })),
    ]
  } else {
    links = [
      {
        id: '__back',
        title: '← Back',
        closesMenu: false,
        onClick: () => setStep(hasFamilies ? 'family' : 'theme'),
      },
      ...MODE_ITEMS.map((item) => ({
        id: item.value,
        title: item.title,
        active: item.value === mode,
        closesMenu: true,
        onClick: () => {
          updateGlobals({ mode: item.value })
        },
      })),
    ]
  }

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnOutsideClick
      onVisibleChange={(visible) => {
        if (!visible) {
          setStep('theme')
        }
      }}
      tooltip={({ onHide }) => (
        <TooltipLinkList
          links={links.map((link) => ({
            id: link.id,
            title: link.title,
            active: link.active,
            onClick: () => {
              link.onClick()
              if (link.closesMenu) {
                onHide()
              }
            },
          }))}
        />
      )}
    >
      <IconButton
        key="theme-tool"
        title="Select theme, family and mode"
      >
        <PaintBrushIcon />
        {currentLabel(theme, family, mode)}
      </IconButton>
    </WithTooltip>
  )
}
