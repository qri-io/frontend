import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Story, Meta } from '@storybook/react';

import activity from './data/activity.json'
import { configureStore, history } from '../../../store/store';

import ActivityList from "../ActivityList";

export default {
  title: 'ActivityList/ActivityList',
  component: ActivityList,
  argTypes: {},
} as Meta;

const Template: Story<any> = (args) => (
  <Provider store={configureStore()}>
    <ConnectedRouter history={history}>
      <ActivityList activity={activity} {...args} />
    </ConnectedRouter>
  </Provider>
);

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic',
}
