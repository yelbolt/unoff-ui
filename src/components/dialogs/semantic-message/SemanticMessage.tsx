import React from 'react'
import { doClassnames } from '@unoff/utils'
import { IconList } from '@tps/icon.types'
import layouts from '@styles/layouts.module.scss'
import Message from '../message/Message'
import './semantic-message.scss'

export interface SemanticMessageProps {
  /**
   * Type of message determining its visual style and icon
   */
  type: 'NEUTRAL' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  /**
   * Message content to display
   */
  message: string
  /**
   * Whether the message is anchored to its position
   * @default false
   */
  isAnchored?: boolean
  /**
   * Layout orientation
   * @default 'HORIZONTAL'
   */
  orientation?: 'HORIZONTAL' | 'VERTICAL'
  /**
   * Optional action buttons slot
   */
  actionsSlot?: React.ReactNode
}

export interface SemanticMessageState {
  documentWidth: number
}

export default class SemanticMessage extends React.Component<
  SemanticMessageProps,
  SemanticMessageState
> {
  static defaultProps: Partial<SemanticMessageProps> = {
    orientation: 'HORIZONTAL',
    isAnchored: false,
  }

  constructor(props: SemanticMessageProps) {
    super(props)
    this.state = {
      documentWidth:
        typeof document !== 'undefined'
          ? document.documentElement.clientWidth
          : 1024,
    }
  }

  // Lifecycle
  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  }

  // Handlers
  handleResize = () => {
    this.setState({ documentWidth: document.documentElement.clientWidth })
  }

  setIcon = (type: string): IconList => {
    if (type === 'SUCCESS') return 'check'
    else if (type === 'WARNING') return 'warning'
    else if (type === 'ERROR') return 'alert'

    return 'info'
  }

  // Render
  render() {
    const { type, message, isAnchored, orientation, actionsSlot } = this.props
    const { documentWidth } = this.state

    const isResponsiveVertical = documentWidth <= 460
    const effectiveOrientation = isResponsiveVertical ? 'VERTICAL' : orientation

    return (
      <div
        className={doClassnames([
          'semantic-message',
          `semantic-message--${type.toLowerCase()}`,
          effectiveOrientation === 'VERTICAL' && 'semantic-message--vertical',
          isAnchored && 'semantic-message--anchored',
        ])}
        role="status"
      >
        <div className="semantic-message__body">
          <Message
            icon={this.setIcon(type)}
            messages={[message]}
          />
        </div>
        {actionsSlot !== undefined && (
          <div
            className={doClassnames([
              layouts['snackbar--medium'],
              layouts['snackbar--wrap'],
              layouts['snackbar--center'],
              'semantic-message__actions',
            ])}
            role="toolbar"
          >
            {actionsSlot}
          </div>
        )}
      </div>
    )
  }
}
