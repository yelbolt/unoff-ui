import { figma } from '@figma/code-connect'
import Dropdown from './Dropdown'

figma.connect(
  Dropdown,
  'https://www.figma.com/design/QlBdsfEcaUsGBzqA20xbNi/Unoff?node-id=393:795',
  {
    props: {
      alignment: figma.enum('Type', {
        HUG: 'LEFT',
        STRETCH: 'RIGHT',
      }),
    },
    example: (props) => (
      <Dropdown
        id="dropdown-example"
        options={[
          { label: 'Option 1', value: 'opt1', type: 'OPTION' as const },
          { label: 'Option 2', value: 'opt2', type: 'OPTION' as const },
        ]}
        selected="opt1"
        alignment={props.alignment}
      />
    ),
  }
)
