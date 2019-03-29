// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { ServiceRepository } from '~/services/services';
import { MiddlewareAPI, Dispatch } from 'redux';
import { DataExplorerMiddlewareService, getDataExplorerColumnFilters } from '~/store/data-explorer/data-explorer-middleware-service';
import { RootState } from '~/store/store';
import { snackbarActions, SnackbarKind } from '~/store/snackbar/snackbar-actions';
import { getDataExplorer } from '~/store/data-explorer/data-explorer-reducer';
import { resourcesActions } from '~/store/resources/resources-actions';
import { FilterBuilder } from '~/services/api/filter-builder';
import { SortDirection } from '~/components/data-table/data-column';
import { OrderDirection, OrderBuilder } from '~/services/api/order-builder';
import { getSortColumn } from "~/store/data-explorer/data-explorer-reducer";
import { FavoritePanelColumnNames } from '~/views/favorite-panel/favorite-panel';
import { publicFavoritePanelActions } from '~/store/public-favorites-panel/public-favorites-action';
import { DataColumns } from '~/components/data-table/data-table';
import { serializeSimpleObjectTypeFilters } from '../resource-type-filters/resource-type-filters';
import { LinkResource } from '~/models/link';
import { GroupContentsResource, GroupContentsResourcePrefix } from '~/services/groups-service/groups-service';
import { progressIndicatorActions } from '~/store/progress-indicator/progress-indicator-actions';
import { loadMissingProcessesInformation } from '~/store/project-panel/project-panel-middleware-service';
import { updatePublicFavorites } from '~/store/public-favorites/public-favorites-actions';

export class PublicFavoritesMiddlewareService extends DataExplorerMiddlewareService {
    constructor(private services: ServiceRepository, id: string) {
        super(id);
    }

    async requestItems(api: MiddlewareAPI<Dispatch, RootState>) {
        const dataExplorer = getDataExplorer(api.getState().dataExplorer, this.getId());
        if (!dataExplorer) {
            api.dispatch(favoritesPanelDataExplorerIsNotSet());
        } else {
            const columns = dataExplorer.columns as DataColumns<string>;
            const sortColumn = getSortColumn(dataExplorer);
            const typeFilters = serializeSimpleObjectTypeFilters(getDataExplorerColumnFilters(columns, FavoritePanelColumnNames.TYPE));


            const linkOrder = new OrderBuilder<LinkResource>();
            const contentOrder = new OrderBuilder<GroupContentsResource>();

            if (sortColumn && sortColumn.name === FavoritePanelColumnNames.NAME) {
                const direction = sortColumn.sortDirection === SortDirection.ASC
                    ? OrderDirection.ASC
                    : OrderDirection.DESC;

                linkOrder.addOrder(direction, "name");
                contentOrder
                    .addOrder(direction, "name", GroupContentsResourcePrefix.COLLECTION)
                    .addOrder(direction, "name", GroupContentsResourcePrefix.PROCESS)
                    .addOrder(direction, "name", GroupContentsResourcePrefix.PROJECT);
            }
            try {
                api.dispatch(progressIndicatorActions.START_WORKING(this.getId()));
                const response = await this.services.favoriteService
                    .list(this.services.authService.getUuid()!, {
                        limit: dataExplorer.rowsPerPage,
                        offset: dataExplorer.page * dataExplorer.rowsPerPage,
                        linkOrder: linkOrder.getOrder(),
                        contentOrder: contentOrder.getOrder(),
                        filters: new FilterBuilder()
                            .addILike("name", dataExplorer.searchValue)
                            .addIsA("headUuid", typeFilters)
                            .getFilters(),

                    });
                api.dispatch(progressIndicatorActions.PERSIST_STOP_WORKING(this.getId()));
                api.dispatch(resourcesActions.SET_RESOURCES(response.items));
                await api.dispatch<any>(loadMissingProcessesInformation(response.items));
                api.dispatch(publicFavoritePanelActions.SET_ITEMS({
                    items: response.items.map(resource => resource.uuid),
                    itemsAvailable: response.itemsAvailable,
                    page: Math.floor(response.offset / response.limit),
                    rowsPerPage: response.limit
                }));
                api.dispatch<any>(updatePublicFavorites(response.items.map(item => item.uuid)));
            } catch (e) {
                api.dispatch(progressIndicatorActions.PERSIST_STOP_WORKING(this.getId()));
                api.dispatch(publicFavoritePanelActions.SET_ITEMS({
                    items: [],
                    itemsAvailable: 0,
                    page: 0,
                    rowsPerPage: dataExplorer.rowsPerPage
                }));
                api.dispatch(couldNotFetchPublicFavorites());
            }
        }
    }
}

const favoritesPanelDataExplorerIsNotSet = () =>
    snackbarActions.OPEN_SNACKBAR({
        message: 'Favorites panel is not ready.',
        kind: SnackbarKind.ERROR
    });

const couldNotFetchPublicFavorites = () =>
    snackbarActions.OPEN_SNACKBAR({
        message: 'Could not fetch public favorites contents.',
        kind: SnackbarKind.ERROR
    });