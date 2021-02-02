import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import DropdownButton, { Option } from '../DropdownButton';

export default {
  title: 'Chrome/DropdownButton',
  component: DropdownButton,
  argTypes: {},
} as Meta;

const Template: Story<any> = (args) => {
  const options: Option[] = [
    { id: 'one', title: 'Option One', description: 'well, this is the first option. There are three'},
    { id: 'two', title: 'Option Two', description: 'well, this is the second option. Maybe this one is better'},
    { id: 'three', title: 'Option Three', description: 'And then there\'s this option. don\'t choose this no matter what you do'},
  ]
  const [option, setOption] = useState<Option>(options[0])
  return (
    <div>
      <DropdownButton
        value={option}
        onChangeValue={(o: Option) => { setOption(o)}}
        options={options}
        onClick={(o: Option) => { alert("click")}}
      />
    </div>
  )
}

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic',
}

