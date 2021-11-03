import React from 'react'
import { Provider } from 'react-redux'
import { Story, Meta } from '@storybook/react'

import { configureStore, history } from '../../../store/store'
import { ConnectedRouter } from 'connected-react-router'
import ScheduleModal from '../modal/ScheduleModal'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: 'Workflow/ScheduleModal',
  component: ScheduleModal,
  argTypes: {}
} as Meta

const Template: Story<any> = (args) => (
  <Provider store={configureStore()}>
    <ConnectedRouter history={history}>
      <ScheduleModal />
    </ConnectedRouter>
  </Provider>
)

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic'
}
