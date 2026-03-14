import React from 'react'
import { doClassnames } from '@unoff/utils'
import SemanticMessage from '@components/dialogs/semantic-message/SemanticMessage'
import Icon from '@components/assets/icon/Icon'
import Button from '@components/actions/button/Button'
import './dropzone.scss'

interface FileContent {
  name: string
  content: string | ArrayBuffer | null | undefined
}

export interface DropzoneProps {
  /**
   * Message to display in the dropzone
   */
  message: string
  /**
   * Warning message to show on invalid file type
   */
  warningMessage: string
  /**
   * Error message to show on upload failure
   */
  errorMessage: string
  /**
   * Call-to-action text for the upload button
   */
  cta: string
  /**
   * Array of accepted MIME types
   * @default ['image/jpeg', 'image/png', 'application/pdf']
   */
  acceptedMimeTypes: Array<string>
  /**
   * Whether multiple files can be uploaded
   */
  isMultiple: boolean
  /**
   * Whether the dropzone is in loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Whether the dropzone is disabled
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether the dropzone is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Callback when files are successfully imported
   */
  onImportFiles: (files: Array<FileContent>) => void
}

export interface DropzoneState {
  status: 'READY' | 'WAITING' | 'WARNING' | 'ERROR'
  isLoading: boolean
  isDraggedOver: boolean
  blackList: Array<string>
}

export default class Dropzone extends React.Component<
  DropzoneProps,
  DropzoneState
> {
  stopLoading: number | undefined

  static defaultProps: Partial<DropzoneProps> = {
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    isLoading: false,
    isDisabled: false,
    isNew: false,
    isBlocked: false,
  }

  constructor(props: DropzoneProps) {
    super(props)
    this.state = {
      status: 'READY',
      isLoading: props.isLoading || false,
      isDraggedOver: false,
      blackList: [],
    }
    this.stopLoading = undefined
  }

  // Lifecycle
  componentDidUpdate = (prevProps: Readonly<DropzoneProps>) => {
    const { isLoading } = this.props

    if (isLoading !== prevProps.isLoading && isLoading) {
      this.setState({
        isLoading: true,
      })
      this.stopLoading = setTimeout(
        () => {
          this.setState({
            isLoading: false,
          })
        },
        2 * 60 * 1000
      )
    } else if (isLoading !== prevProps.isLoading && !isLoading) {
      clearTimeout(this.stopLoading)
      this.setState({
        isLoading: false,
      })
    }
  }

  // Direct Actions
  onImport = (validFiles: Array<File>, unValidFiles: Array<File>) => {
    const { onImportFiles } = this.props
    const fileContents: Array<FileContent> = []

    validFiles.forEach((file: File) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result

        fileContents.push({ name: file.name, content: content })

        if (
          fileContents.length === validFiles.length &&
          unValidFiles.length === 0
        ) {
          onImportFiles(fileContents)
          this.setState({
            status: 'READY',
          })
        } else if (
          fileContents.length === validFiles.length &&
          unValidFiles.length > 0
        ) {
          onImportFiles(fileContents)
          this.setState({
            status: 'WARNING',
          })
        }
      }

      if (file.type.startsWith('image/png')) reader.readAsArrayBuffer(file)
      else if (file.type === 'application/pdf') reader.readAsArrayBuffer(file)
      else reader.readAsText(file)
    })
  }

  onValidFilesViaButton = () => {
    const { acceptedMimeTypes, isMultiple } = this.props

    this.setState({
      isDraggedOver: false,
    })

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = acceptedMimeTypes.join(',')
    fileInput.multiple = isMultiple
    fileInput.onchange = (event: Event) => {
      this.setState({
        status: 'WAITING',
        isLoading: true,
      })
      const target = event.target as HTMLInputElement
      const files = target.files
      this.onImport(Array.from(files || []), [])
    }
    fileInput.click()
    fileInput.remove()
  }

  onValidFilesViaDrop = (event: React.DragEvent) => {
    const { acceptedMimeTypes, isMultiple } = this.props

    event.preventDefault()
    this.setState({
      status: 'WAITING',
      isLoading: true,
      isDraggedOver: false,
    })

    let validFiles: File[] = Array.from(event.dataTransfer.files).filter(
      (file: File) => acceptedMimeTypes.includes(file.type)
    )

    let unValidFiles: File[] = Array.from(event.dataTransfer.files).filter(
      (file: File) => !acceptedMimeTypes.includes(file.type)
    )

    if (!isMultiple && validFiles.length > 1) {
      unValidFiles = unValidFiles.concat(validFiles.slice(1))
      validFiles = validFiles.slice(0, 1)
    }

    this.setState({
      blackList: unValidFiles.map((file) => file.name),
    })

    if (validFiles.length > 0) this.onImport(validFiles, unValidFiles)
    else
      this.setState({
        status: 'ERROR',
        isLoading: false,
      })
  }

  onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    this.setState({
      isDraggedOver: true,
    })
  }

  onDragEnter = (event: React.DragEvent) => {
    event.preventDefault()
    this.setState({
      isDraggedOver: true,
    })
  }

  onDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    this.setState({
      isDraggedOver: false,
    })
  }

  render() {
    const {
      message,
      warningMessage,
      errorMessage,
      cta,
      isDisabled,
      isBlocked,
      isNew,
    } = this.props
    const { status, isLoading, isDraggedOver, blackList } = this.state
    let fragment

    switch (status) {
      case 'READY': {
        fragment = (
          <SemanticMessage
            type="NEUTRAL"
            message={message}
            orientation="VERTICAL"
            actionsSlot={
              <Button
                type="primary"
                label={cta}
                isBlocked={isBlocked}
                isDisabled={isDisabled}
                isNew={isNew}
                action={() =>
                  !(isBlocked || isDisabled) && this.onValidFilesViaButton()
                }
              />
            }
          />
        )
        break
      }
      case 'WAITING': {
        fragment = null
        break
      }
      case 'WARNING': {
        fragment = (
          <SemanticMessage
            type="WARNING"
            message={warningMessage.replace(
              '$1',
              blackList.map((item) => `"${item}"`).join(', ')
            )}
            orientation="VERTICAL"
            actionsSlot={
              <Button
                type="primary"
                label={cta}
                isBlocked={isBlocked}
                isDisabled={isDisabled}
                isNew={isNew}
                action={() =>
                  !(isBlocked || isDisabled) && this.onValidFilesViaButton()
                }
              />
            }
          />
        )
        break
      }
      case 'ERROR': {
        fragment = (
          <SemanticMessage
            type="ERROR"
            message={errorMessage}
            orientation="VERTICAL"
            actionsSlot={
              <Button
                type="primary"
                label={cta}
                isBlocked={isBlocked}
                isDisabled={isDisabled}
                isNew={isNew}
                action={() =>
                  !(isBlocked || isDisabled) && this.onValidFilesViaButton()
                }
              />
            }
          />
        )
        break
      }
    }

    return (
      <div
        className={doClassnames([
          'dropzone',
          isDraggedOver && 'dropzone--dragged-over',
          (isBlocked || isDisabled) && 'dropzone--disabled',
        ])}
        role="region"
        aria-disabled={isDisabled || isBlocked}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onValidFilesViaDrop}
      >
        {isLoading && (
          <Icon
            type="PICTO"
            iconName="spinner"
          />
        )}
        {fragment}
      </div>
    )
  }
}
