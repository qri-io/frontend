import React from 'react'
import { Provider } from 'react-redux'
import { Story, Meta } from '@storybook/react'

import { configureStore, history } from '../../../store/store'
import { ConnectedRouter } from 'connected-react-router'
import DatasetComponents from '../DatasetComponents'
// import './styles.css'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: 'Workflow/DatasetComponents',
  component: DatasetComponents,
  argTypes: {}
} as Meta

const Template: Story<any> = (args) => {
  return (<Provider store={configureStore()}>
      <ConnectedRouter history={history}>
        <DatasetComponents />
      </ConnectedRouter>
    </Provider>)
}

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic'
}
