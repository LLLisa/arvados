// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { ResourceKind, TrashableResource } from "./resource";

export interface CollectionResource extends TrashableResource {
    kind: ResourceKind.COLLECTION;
    name: string;
    description: string;
    properties: any;
    portableDataHash: string;
    manifestText: string;
    replicationDesired: number;
    replicationConfirmed: number;
    replicationConfirmedAt: string;
    fileSize: number;
    fileCount: number;
}

export const getCollectionUrl = (uuid: string) => {
    return `/collections/${uuid}`;
};
