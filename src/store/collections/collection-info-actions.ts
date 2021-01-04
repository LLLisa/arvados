// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Dispatch } from "redux";
import { RootState } from "~/store/store";
import { ServiceRepository } from "~/services/services";
import { dialogActions } from '~/store/dialog/dialog-actions';

export const COLLECTION_WEBDAV_S3_DIALOG_NAME = 'collectionWebdavS3Dialog';

export interface WebDavS3InfoDialogData {
    uuid: string;
    token: string;
    downloadUrl: string;
    homeCluster: string;
    localCluster: string;
    username: string;
    activeTab: number;
    setActiveTab: (event: any, tabNr: number) => void;
}

export const openWebDavS3InfoDialog = (uuid: string, activeTab?: number) =>
    (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        dispatch(dialogActions.OPEN_DIALOG({
            id: COLLECTION_WEBDAV_S3_DIALOG_NAME,
            data: {
                title: 'Access Collection using WebDAV or S3',
                token: getState().auth.apiToken,
                downloadUrl: getState().auth.config.keepWebInlineServiceUrl,
                homeCluster: getState().auth.homeCluster,
                localCluster: getState().auth.localCluster,
                username: getState().auth.user!.username,
                activeTab: activeTab || 0,
                setActiveTab: (event: any, tabNr: number) => dispatch<any>(openWebDavS3InfoDialog(uuid, tabNr)),
                uuid
            }
        }));
    };
