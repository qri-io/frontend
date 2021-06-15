import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '../../store/store';
import App from './App';

test('initial app render', () => {
  const { getByText } = render(
    <Provider store={configureStore()}>
      <App />
    </Provider>
  );

  // app should render the splash route by default, text pulled from theere
  expect(getByText(/New Dataset/i)).toBeInTheDocument();
});
