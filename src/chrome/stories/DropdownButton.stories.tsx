import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'

import DropdownButton, { Option } from '../DropdownButton'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: 'Chrome/DropdownButton',
  component: DropdownButton,
  argTypes: {}
} as Meta

const Template: Story<any> = (args) => {
  const options: Option[] = [
    { value: 'one', title: 'Option One', description: 'well, this is the first option. There are three' },
    { value: 'two', title: 'Option Two', description: 'well, this is the second option. Maybe this one is better' },
    { value: 'three', title: 'Option Three', description: 'And then there\'s this option. don\'t choose this no matter what you do' }
  ]
  const [option, setOption] = useState<Option>(options[0])
  return (
    <div>
      <DropdownButton
        id={option.value}
        value={option}
        onChangeValue={(o: Option) => { setOption(o) }}
        options={options}
        onClick={(o: Option) => { alert("click") }}
      />
    </div>
  )
}

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic'
}
