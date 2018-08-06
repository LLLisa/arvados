// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { collectionPanelActions, CollectionPanelAction } from "./collection-panel-action";
import { CollectionResource } from "../../models/collection";
import { LinkResource } from "../../models/link";

export interface CollectionPanelState {
    item: CollectionResource | null;
    tags: LinkResource[];
}

const initialState = {
    item: null,
    tags: []
};

export const collectionPanelReducer = (state: CollectionPanelState = initialState, action: CollectionPanelAction) =>
    collectionPanelActions.match(action, {
        default: () => state,
        LOAD_COLLECTION_SUCCESS: ({ item }) => ({ ...state, item }),
        LOAD_COLLECTION_TAGS_SUCCESS: ({ tags }) => ({...state, tags}),
        CREATE_COLLECTION_TAG_SUCCESS: ({ tag }) => ({...state, tags: [...state.tags, tag] })
    });
