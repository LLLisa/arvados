// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { User } from "~/models/user";
import { AxiosInstance } from "axios";
import { ApiActions, ProgressFn } from "~/services/api/api-actions";
import * as uuid from "uuid/v4";

export const API_TOKEN_KEY = 'apiToken';
export const USER_EMAIL_KEY = 'userEmail';
export const USER_FIRST_NAME_KEY = 'userFirstName';
export const USER_LAST_NAME_KEY = 'userLastName';
export const USER_UUID_KEY = 'userUuid';
export const USER_OWNER_UUID_KEY = 'userOwnerUuid';
export const USER_IS_ADMIN = 'isAdmin';

export interface UserDetailsResponse {
    email: string;
    first_name: string;
    last_name: string;
    uuid: string;
    owner_uuid: string;
    is_admin: boolean;
}

export class AuthService {

    constructor(
        protected apiClient: AxiosInstance,
        protected baseUrl: string,
        protected actions: ApiActions) { }

    public saveApiToken(token: string) {
        localStorage.setItem(API_TOKEN_KEY, token);
    }

    public removeApiToken() {
        localStorage.removeItem(API_TOKEN_KEY);
    }

    public getApiToken() {
        return localStorage.getItem(API_TOKEN_KEY) || undefined;
    }

    public getUuid() {
        return localStorage.getItem(USER_UUID_KEY) || undefined;
    }

    public getOwnerUuid() {
        return localStorage.getItem(USER_OWNER_UUID_KEY) || undefined;
    }

    public getIsAdmin(): boolean {
        return localStorage.getItem(USER_IS_ADMIN) === 'true';
    }

    public getUser(): User | undefined {
        const email = localStorage.getItem(USER_EMAIL_KEY);
        const firstName = localStorage.getItem(USER_FIRST_NAME_KEY);
        const lastName = localStorage.getItem(USER_LAST_NAME_KEY);
        const uuid = this.getUuid();
        const ownerUuid = this.getOwnerUuid();
        const isAdmin = this.getIsAdmin();

        return email && firstName && lastName && uuid && ownerUuid
            ? { email, firstName, lastName, uuid, ownerUuid, isAdmin }
            : undefined;
    }

    public saveUser(user: User) {
        localStorage.setItem(USER_EMAIL_KEY, user.email);
        localStorage.setItem(USER_FIRST_NAME_KEY, user.firstName);
        localStorage.setItem(USER_LAST_NAME_KEY, user.lastName);
        localStorage.setItem(USER_UUID_KEY, user.uuid);
        localStorage.setItem(USER_OWNER_UUID_KEY, user.ownerUuid);
        localStorage.setItem(USER_IS_ADMIN, JSON.stringify(user.isAdmin));
    }

    public removeUser() {
        localStorage.removeItem(USER_EMAIL_KEY);
        localStorage.removeItem(USER_FIRST_NAME_KEY);
        localStorage.removeItem(USER_LAST_NAME_KEY);
        localStorage.removeItem(USER_UUID_KEY);
        localStorage.removeItem(USER_OWNER_UUID_KEY);
        localStorage.removeItem(USER_IS_ADMIN);
    }

    public login() {
        const currentUrl = `${window.location.protocol}//${window.location.host}/token`;
        window.location.assign(`${this.baseUrl || ""}/login?return_to=${currentUrl}`);
    }

    public logout() {
        const currentUrl = `${window.location.protocol}//${window.location.host}`;
        window.location.assign(`${this.baseUrl || ""}/logout?return_to=${currentUrl}`);
    }

    public getUserDetails = (): Promise<User> => {
        const reqId = uuid();
        this.actions.progressFn(reqId, true);
        return this.apiClient
            .get<UserDetailsResponse>('/users/current')
            .then(resp => {
                this.actions.progressFn(reqId, false);
                return {
                    email: resp.data.email,
                    firstName: resp.data.first_name,
                    lastName: resp.data.last_name,
                    uuid: resp.data.uuid,
                    ownerUuid: resp.data.owner_uuid,
                    isAdmin: resp.data.is_admin
                };
            })
            .catch(e => {
                this.actions.progressFn(reqId, false);
                this.actions.errorFn(reqId, e);
                throw e;
            });
    }

    public getRootUuid() {
        const uuid = this.getOwnerUuid();
        const uuidParts = uuid ? uuid.split('-') : [];
        return uuidParts.length > 1 ? `${uuidParts[0]}-${uuidParts[1]}` : undefined;
    }
}
