import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import enLocale from 'react-intl/locale-data/en';
import deLocale from 'react-intl/locale-data/de';

import configureStore, { history } from 'configureStore';
import enMessages from 'lang/en.json';
import deMessages from 'lang/de.json';
import App from 'containers/common/App';
import registerServiceWorker from 'registerServiceWorker';

import 'assets/css/app.css';
import 'primereact/resources/primereact.min.css';

const store = configureStore();
addLocaleData([...enLocale, ...deLocale]);
const lang = navigator.language || 'en-US';
const messages = lang === 'de-DE' ? deMessages : enMessages;

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={lang} messages={messages}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
