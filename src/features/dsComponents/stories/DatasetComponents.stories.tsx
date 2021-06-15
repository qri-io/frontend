import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Story, Meta } from '@storybook/react';

import { configureStore, history } from '../../../store/store';
import { ConnectedRouter } from 'connected-react-router';
import DatasetComponents from '../DatasetComponents';
import { ComponentName, NewDataset } from '../../../qri/dataset';
import earthquakes from './data/earthquakes.json'

// import './styles.css'

export default {
  title: 'Workflow/DatasetComponents',
  component: DatasetComponents,
  argTypes: {},
} as Meta;

const Template: Story<any> = (args) => {
  const [component, setComponent] = useState<ComponentName>('body')
  return (<Provider store={configureStore()}>
      <ConnectedRouter history={history}>
        <DatasetComponents 
          selectedComponent={component}
          setSelectedComponent={setComponent}
          dataset={NewDataset(earthquakes)} 
        />
      </ConnectedRouter>
    </Provider>)
}

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic',
}

