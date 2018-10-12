// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { navigateTo } from '~/store/navigation/navigation-action';
import { SearchResultsPanelActionProps, SearchResultsPanelDataProps } from './search-results-panel-view';
import { RootState } from '~/store/store';
import { openContextMenu, resourceKindToContextMenuKind } from '~/store/context-menu/context-menu-actions';
import { ResourceKind } from '~/models/resource';
import { loadDetailsPanel } from '~/store/details-panel/details-panel-action';
import { SearchResultsPanelView } from '~/views/search-results-panel/search-results-panel-view';

const mapStateToProps = (state: RootState): SearchResultsPanelDataProps => ({
    data: {
        inTrash: false,
        dataFrom: '',
        dataTo: '',
        saveQuery: false,
        searchQuery: ''
    }
});

const mapDispatchToProps = (dispatch: Dispatch): SearchResultsPanelActionProps => ({
    onContextMenu: (event, resourceUuid) => {
        const kind = resourceKindToContextMenuKind(resourceUuid);
        if (kind) {
            dispatch<any>(openContextMenu(event, {
                name: '',
                uuid: resourceUuid,
                ownerUuid: '',
                kind: ResourceKind.NONE,
                menuKind: kind
            }));
        }
    },
    onDialogOpen: (ownerUuid: string) => { return; },
    onItemClick: (resourceUuid: string) => {
        dispatch<any>(loadDetailsPanel(resourceUuid));
    },
    onItemDoubleClick: uuid => {
        dispatch<any>(navigateTo(uuid));
    }
});

export const SearchResultsPanel = connect(mapStateToProps, mapDispatchToProps)(SearchResultsPanelView);