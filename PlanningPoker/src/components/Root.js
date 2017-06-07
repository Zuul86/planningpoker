import React, { PropTypes } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';

const Root = ({ store }) => (
    <Provider store={store}>
        <BrowserRouter>
            <Route path="/:id?" component={App} />
        </BrowserRouter>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;