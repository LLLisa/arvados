// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { unionize, ofType, UnionOf } from '~/common/unionize';
import { ContextMenuPosition } from "./context-menu-reducer";
import { ContextMenuKind } from '~/views-components/context-menu/context-menu';
import { Dispatch } from 'redux';
import { RootState } from '~/store/store';
import { getResource } from '../resources/resources';
import { ProjectResource } from '~/models/project';
import { UserResource } from '~/models/user';
import { isSidePanelTreeCategory } from '~/store/side-panel-tree/side-panel-tree-actions';
import { extractUuidKind, ResourceKind } from '~/models/resource';
import { Process } from '~/store/processes/process';
import { RepositoryResource } from '~/models/repositories';
import { SshKeyResource } from '~/models/ssh-key';
import { VirtualMachinesResource } from '~/models/virtual-machines';
import { KeepServiceResource } from '~/models/keep-services';
import { ProcessResource } from '~/models/process';

export const contextMenuActions = unionize({
    OPEN_CONTEXT_MENU: ofType<{ position: ContextMenuPosition, resource: ContextMenuResource }>(),
    CLOSE_CONTEXT_MENU: ofType<{}>()
});

export type ContextMenuAction = UnionOf<typeof contextMenuActions>;

export type ContextMenuResource = {
    name: string;
    uuid: string;
    ownerUuid: string;
    description?: string;
    kind: ResourceKind,
    menuKind: ContextMenuKind;
    isTrashed?: boolean;
    outputUuid?: string;
    workflowUuid?: string;
};

export const isKeyboardClick = (event: React.MouseEvent<HTMLElement>) => event.nativeEvent.detail === 0;

export const openContextMenu = (event: React.MouseEvent<HTMLElement>, resource: ContextMenuResource) =>
    (dispatch: Dispatch) => {
        event.preventDefault();
        const { left, top } = event.currentTarget.getBoundingClientRect();
        dispatch(
            contextMenuActions.OPEN_CONTEXT_MENU({
                position: {
                    x: event.clientX || left,
                    y: event.clientY || top,
                },
                resource
            })
        );
    };

export const openCollectionFilesContextMenu = (event: React.MouseEvent<HTMLElement>) =>
    (dispatch: Dispatch, getState: () => RootState) => {
        const isCollectionFileSelected = JSON.stringify(getState().collectionPanelFiles).includes('"selected":true');
        dispatch<any>(openContextMenu(event, {
            name: '',
            uuid: '',
            ownerUuid: '',
            kind: ResourceKind.COLLECTION,
            menuKind: isCollectionFileSelected ? ContextMenuKind.COLLECTION_FILES : ContextMenuKind.COLLECTION_FILES_NOT_SELECTED
        }));
    };

export const openRepositoryContextMenu = (event: React.MouseEvent<HTMLElement>, repository: RepositoryResource) =>
    (dispatch: Dispatch, getState: () => RootState) => {
        dispatch<any>(openContextMenu(event, {
            name: '',
            uuid: repository.uuid,
            ownerUuid: repository.ownerUuid,
            kind: ResourceKind.REPOSITORY,
            menuKind: ContextMenuKind.REPOSITORY
        }));
    };

export const openVirtualMachinesContextMenu = (event: React.MouseEvent<HTMLElement>, repository: VirtualMachinesResource) =>
    (dispatch: Dispatch, getState: () => RootState) => {
        dispatch<any>(openContextMenu(event, {
            name: '',
            uuid: repository.uuid,
            ownerUuid: repository.ownerUuid,
            kind: ResourceKind.VIRTUAL_MACHINE,
            menuKind: ContextMenuKind.VIRTUAL_MACHINE
        }));
    };

export const openSshKeyContextMenu = (event: React.MouseEvent<HTMLElement>, sshKey: SshKeyResource) =>
    (dispatch: Dispatch) => {
        dispatch<any>(openContextMenu(event, {
            name: '',
            uuid: sshKey.uuid,
            ownerUuid: sshKey.ownerUuid,
            kind: ResourceKind.SSH_KEY,
            menuKind: ContextMenuKind.SSH_KEY
        }));
    };

export const openKeepServiceContextMenu = (event: React.MouseEvent<HTMLElement>, keepService: KeepServiceResource) =>
    (dispatch: Dispatch) => {
        dispatch<any>(openContextMenu(event, {
            name: '',
            uuid: keepService.uuid,
            ownerUuid: keepService.ownerUuid,
            kind: ResourceKind.KEEP_SERVICE,
            menuKind: ContextMenuKind.KEEP_SERVICE
        }));
    };

export const openComputeNodeContextMenu = (event: React.MouseEvent<HTMLElement>, resourceUuid: string) =>
    (dispatch: Dispatch) => {
        dispatch<any>(openContextMenu(event, {
            name: '',
            uuid: resourceUuid,
            ownerUuid: '',
            kind: ResourceKind.NODE,
            menuKind: ContextMenuKind.NODE
        }));
    };

export const openApiClientAuthorizationContextMenu =
    (event: React.MouseEvent<HTMLElement>, resourceUuid: string) =>
        (dispatch: Dispatch) => {
            dispatch<any>(openContextMenu(event, {
                name: '',
                uuid: resourceUuid,
                ownerUuid: '',
                kind: ResourceKind.API_CLIENT_AUTHORIZATION,
                menuKind: ContextMenuKind.API_CLIENT_AUTHORIZATION
            }));
        };

export const openRootProjectContextMenu = (event: React.MouseEvent<HTMLElement>, projectUuid: string) =>
    (dispatch: Dispatch, getState: () => RootState) => {
        const res = getResource<UserResource>(projectUuid)(getState().resources);
        if (res) {
            dispatch<any>(openContextMenu(event, {
                name: '',
                uuid: res.uuid,
                ownerUuid: res.uuid,
                kind: res.kind,
                menuKind: ContextMenuKind.ROOT_PROJECT,
                isTrashed: false
            }));
        }
    };

export const openProjectContextMenu = (event: React.MouseEvent<HTMLElement>, projectUuid: string) =>
    (dispatch: Dispatch, getState: () => RootState) => {
        const res = getResource<ProjectResource>(projectUuid)(getState().resources);
        if (res) {
            dispatch<any>(openContextMenu(event, {
                name: res.name,
                uuid: res.uuid,
                kind: res.kind,
                menuKind: ContextMenuKind.PROJECT,
                ownerUuid: res.ownerUuid,
                isTrashed: res.isTrashed
            }));
        }
    };

export const openSidePanelContextMenu = (event: React.MouseEvent<HTMLElement>, id: string) =>
    (dispatch: Dispatch, getState: () => RootState) => {
        if (!isSidePanelTreeCategory(id)) {
            const kind = extractUuidKind(id);
            if (kind === ResourceKind.USER) {
                dispatch<any>(openRootProjectContextMenu(event, id));
            } else if (kind === ResourceKind.PROJECT) {
                dispatch<any>(openProjectContextMenu(event, id));
            }
        }
    };

export const openProcessContextMenu = (event: React.MouseEvent<HTMLElement>, process: Process) =>
    (dispatch: Dispatch, getState: () => RootState) => {
        const res = getResource<ProcessResource>(process.containerRequest.uuid)(getState().resources);
        if (res) {
            dispatch<any>(openContextMenu(event, {
                uuid: res.uuid,
                ownerUuid: res.ownerUuid,
                kind: ResourceKind.PROCESS,
                name: res.name,
                description: res.description,
                outputUuid: res.outputUuid || '',
                workflowUuid: res.properties.workflowUuid || '',
                menuKind: ContextMenuKind.PROCESS
            }));
        }
    };

export const resourceKindToContextMenuKind = (uuid: string, isAdmin?: boolean) => {
    const kind = extractUuidKind(uuid);
    switch (kind) {
        case ResourceKind.PROJECT:
            return !isAdmin ? ContextMenuKind.PROJECT : ContextMenuKind.PROJECT_ADMIN;
        case ResourceKind.COLLECTION:
            return !isAdmin ? ContextMenuKind.COLLECTION_RESOURCE : ContextMenuKind.COLLECTION_ADMIN;
        case ResourceKind.PROCESS:
            return !isAdmin ? ContextMenuKind.PROCESS_RESOURCE : ContextMenuKind.PROCESS_ADMIN;
        case ResourceKind.USER:
            return ContextMenuKind.ROOT_PROJECT;
        case ResourceKind.LINK:
            return ContextMenuKind.LINK;
        default:
            return;
    }
};
