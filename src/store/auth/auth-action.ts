// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { ofType, unionize, UnionOf } from '~/common/unionize';
import { Dispatch } from "redux";
import { RootState } from "../store";
import { ServiceRepository } from "~/services/services";
import { SshKeyResource } from '~/models/ssh-key';
import { User } from "~/models/user";
import { Session } from "~/models/session";
import { Config } from '~/common/config';
import { cancelLinking } from '~/store/link-account-panel/link-account-panel-actions';
import { matchTokenRoute, matchFedTokenRoute } from '~/routes/routes';
import { createServices, setAuthorizationHeader, removeAuthorizationHeader } from "~/services/services";

export const authActions = unionize({
    LOGIN: {},
    LOGOUT: ofType<{ deleteLinkData: boolean }>(),
    CONFIG: ofType<{ config: Config }>(),
    INIT: ofType<{ user: User, token: string }>(),
    USER_DETAILS_REQUEST: {},
    USER_DETAILS_SUCCESS: ofType<User>(),
    SET_SSH_KEYS: ofType<SshKeyResource[]>(),
    ADD_SSH_KEY: ofType<SshKeyResource>(),
    REMOVE_SSH_KEY: ofType<string>(),
    SET_HOME_CLUSTER: ofType<string>(),
    SET_SESSIONS: ofType<Session[]>(),
    ADD_SESSION: ofType<Session>(),
    REMOVE_SESSION: ofType<string>(),
    UPDATE_SESSION: ofType<Session>(),
    REMOTE_CLUSTER_CONFIG: ofType<{ config: Config }>(),
});

export const initAuth = (config: Config) => (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
    // Cancel any link account ops in progress unless the user has
    // just logged in or there has been a successful link operation
    const data = services.linkAccountService.getLinkOpStatus();
    if (!matchTokenRoute(location.pathname) && (!matchFedTokenRoute(location.pathname)) && data === undefined) {
        dispatch<any>(cancelLinking()).then(() => {
            dispatch<any>(init(config));
        });
    }
    else {
        dispatch<any>(init(config));
    }
};

const init = (config: Config) => (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
    const token = services.authService.getApiToken();
    let homeCluster = services.authService.getHomeCluster();
    if (homeCluster && !config.remoteHosts[homeCluster]) {
        homeCluster = undefined;
    }
    dispatch(authActions.CONFIG({ config }));
    dispatch(authActions.SET_HOME_CLUSTER(config.loginCluster || homeCluster || config.uuidPrefix));

    if (token && token !== "undefined") {
        dispatch<any>(saveApiToken(token));
    }
};

export const getConfig = (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository): Config => {
    const state = getState().auth;
    return state.remoteHostsConfig[state.localCluster];
};

export const saveApiToken = (token: string) => (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository): Promise<any> => {
    const config = dispatch<any>(getConfig);
    const svc = createServices(config, { progressFn: () => { }, errorFn: () => { } });
    setAuthorizationHeader(svc, token);
    return svc.authService.getUserDetails().then((user: User) => {
        dispatch(authActions.INIT({ user, token }));
    });
};

export const login = (uuidPrefix: string, homeCluster: string, loginCluster: string,
    remoteHosts: { [key: string]: string }) => (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        services.authService.login(uuidPrefix, homeCluster, loginCluster, remoteHosts);
        dispatch(authActions.LOGIN());
    };

export const logout = (deleteLinkData: boolean = false) => (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
    dispatch(authActions.LOGOUT({ deleteLinkData }));
};

export type AuthAction = UnionOf<typeof authActions>;
