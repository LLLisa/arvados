// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { createStore, applyMiddleware, compose, Middleware, combineReducers } from 'redux';
import { routerMiddleware, routerReducer, RouterState } from "react-router-redux";
import thunkMiddleware from 'redux-thunk';
import { History } from "history";

import { projectsReducer, ProjectState } from "./project/project-reducer";
import { sidePanelReducer, SidePanelState } from './side-panel/side-panel-reducer';
import { authReducer, AuthState } from "./auth/auth-reducer";
import { dataExplorerReducer, DataExplorerState } from './data-explorer/data-explorer-reducer';
import { projectPanelMiddleware } from './project-panel/project-panel-middleware';
import { detailsPanelReducer, DetailsPanelState } from './details-panel/details-panel-reducer';
import { contextMenuReducer, ContextMenuState } from './context-menu/context-menu-reducer';
import { favoritePanelMiddleware } from "./favorite-panel/favorite-panel-middleware";
import { reducer as formReducer } from 'redux-form';
import { FavoritesState, favoritesReducer } from './favorites/favorites-reducer';
import { snackbarReducer, SnackbarState } from './snackbar/snackbar-reducer';
import { CollectionPanelState, collectionPanelReducer } from './collection-panel/collection-panel-reducer';

const composeEnhancers =
    (process.env.NODE_ENV === 'development' &&
        window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

export interface RootState {
    auth: AuthState;
    projects: ProjectState;
    router: RouterState;
    dataExplorer: DataExplorerState;
    sidePanel: SidePanelState;
    collectionPanel: CollectionPanelState;
    detailsPanel: DetailsPanelState;
    contextMenu: ContextMenuState;
    favorites: FavoritesState;
    snackbar: SnackbarState;
}

const rootReducer = combineReducers({
    auth: authReducer,
    projects: projectsReducer,
    router: routerReducer,
    dataExplorer: dataExplorerReducer,
    sidePanel: sidePanelReducer,
    collectionPanel: collectionPanelReducer,
    detailsPanel: detailsPanelReducer,
    contextMenu: contextMenuReducer,
    form: formReducer,
    favorites: favoritesReducer,
    snackbar: snackbarReducer,
});


export function configureStore(history: History) {
    const middlewares: Middleware[] = [
        routerMiddleware(history),
        thunkMiddleware,
        projectPanelMiddleware,
        favoritePanelMiddleware
    ];
    const enhancer = composeEnhancers(applyMiddleware(...middlewares));
    return createStore(rootReducer, enhancer);
}
