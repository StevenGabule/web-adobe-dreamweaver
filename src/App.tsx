import type React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {

  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  )
}

export default App;
