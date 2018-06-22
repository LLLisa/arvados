// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { Grid, Paper, Toolbar, StyleRulesCallback, withStyles, Theme, WithStyles, TablePagination, Table } from '@material-ui/core';
import ContextMenu, { ContextMenuActionGroup, ContextMenuAction } from "../../components/context-menu/context-menu";
import ColumnSelector from "../../components/column-selector/column-selector";
import DataTable from "../../components/data-table/data-table";
import { mockAnchorFromMouseEvent } from "../../components/popover/helpers";
import { DataColumn, toggleSortDirection } from "../../components/data-table/data-column";
import { DataTableFilterItem } from '../../components/data-table-filters/data-table-filters';
import SearchInput from '../search-input/search-input';

interface DataExplorerProps<T> {
    items: T[];
    columns: Array<DataColumn<T>>;
    contextActions: ContextMenuActionGroup[];
    searchValue: string;
    rowsPerPage: number;
    page: number;
    onSearch: (value: string) => void;
    onRowClick: (item: T) => void;
    onColumnToggle: (column: DataColumn<T>) => void;
    onContextAction: (action: ContextMenuAction, item: T) => void;
    onSortToggle: (column: DataColumn<T>) => void;
    onFiltersChange: (filters: DataTableFilterItem[], column: DataColumn<T>) => void;
    onChangePage: (page: number) => void;
    onChangeRowsPerPage: (rowsPerPage: number) => void;
}

interface DataExplorerState<T> {
    contextMenu: {
        anchorEl?: HTMLElement;
        item?: T;
    };
}

class DataExplorer<T> extends React.Component<DataExplorerProps<T> & WithStyles<CssRules>, DataExplorerState<T>> {
    state: DataExplorerState<T> = {
        contextMenu: {}
    };

    render() {
        return <Paper>
            <ContextMenu
                anchorEl={this.state.contextMenu.anchorEl}
                actions={this.props.contextActions}
                onActionClick={this.callAction}
                onClose={this.closeContextMenu} />
            <Toolbar className={this.props.classes.toolbar}>
                {this.props.items.length > 0 &&
                    <Grid container justify="space-between" wrap="nowrap" alignItems="center">
                        <div className={this.props.classes.searchBox}>
                            <SearchInput
                                value={this.props.searchValue}
                                onSearch={this.props.onSearch} />
                        </div>
                        <ColumnSelector
                            columns={this.props.columns}
                            onColumnToggle={this.props.onColumnToggle} />
                    </Grid>}

            </Toolbar>
            <DataTable
                columns={this.props.columns}
                items={this.props.items}
                onRowClick={(_, item: T) => this.props.onRowClick(item)}
                onRowContextMenu={this.openContextMenu}
                onFiltersChange={this.props.onFiltersChange}
                onSortToggle={this.props.onSortToggle} />
            <Toolbar>
                {this.props.items.length > 0 &&
                    <Grid container justify="flex-end">
                        <TablePagination
                            count={this.props.items.length}
                            rowsPerPage={this.props.rowsPerPage}
                            page={this.props.page}
                            onChangePage={this.changePage}
                            onChangeRowsPerPage={this.changeRowsPerPage}
                            component="div"
                        />
                    </Grid>}
            </Toolbar>
        </Paper>;
    }

    openContextMenu = (event: React.MouseEvent<HTMLElement>, item: T) => {
        event.preventDefault();
        this.setState({
            contextMenu: {
                anchorEl: mockAnchorFromMouseEvent(event),
                item
            }
        });
    }

    closeContextMenu = () => {
        this.setState({ contextMenu: {} });
    }

    callAction = (action: ContextMenuAction) => {
        const { item } = this.state.contextMenu;
        this.closeContextMenu();
        if (item) {
            this.props.onContextAction(action, item);
        }
    }

    changePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        this.props.onChangePage(page);
    }

    changeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
        this.props.onChangeRowsPerPage(parseInt(event.target.value, 10));
    }

}

type CssRules = "searchBox" | "toolbar";

const styles: StyleRulesCallback<CssRules> = (theme: Theme) => ({
    searchBox: {
        paddingBottom: theme.spacing.unit * 2
    },
    toolbar: {
        paddingTop: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(DataExplorer);
