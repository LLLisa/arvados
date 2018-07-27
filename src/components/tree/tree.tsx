// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { List, ListItem, ListItemIcon, Collapse, Checkbox } from "@material-ui/core";
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import { ReactElement } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import * as classnames from "classnames";

import { ArvadosTheme } from '../../common/custom-theme';
import { SidePanelRightArrowIcon } from '../icon/icon';

type CssRules = 'list'
    | 'listItem'
    | 'active'
    | 'loader'
    | 'toggableIconContainer'
    | 'iconClose'
    | 'renderContainer'
    | 'iconOpen'
    | 'toggableIcon'
    | 'checkbox';

const styles: StyleRulesCallback<CssRules> = (theme: ArvadosTheme) => ({
    list: {
        padding: '3px 0px'
    },
    listItem: {
        padding: '3px 0px',
    },
    loader: {
        position: 'absolute',
        transform: 'translate(0px)',
        top: '3px'
    },
    toggableIconContainer: {
        color: theme.palette.grey["700"],
        height: '14px',
        width: '14px',
    },
    toggableIcon: {
        fontSize: '14px'
    },
    renderContainer: {
        flex: 1
    },
    active: {
        color: theme.palette.primary.main,
    },
    iconClose: {
        transition: 'all 0.1s ease',
    },
    iconOpen: {
        transition: 'all 0.1s ease',
        transform: 'rotate(90deg)',
    },
    checkbox: {
        width: theme.spacing.unit * 3,
        height: theme.spacing.unit * 3,
        margin: `0 ${theme.spacing.unit}px`,
        color: theme.palette.grey["500"]
    }
});

export enum TreeItemStatus {
    INITIAL,
    PENDING,
    LOADED
}

export interface TreeItem<T> {
    data: T;
    id: string;
    open: boolean;
    active: boolean;
    selected?: boolean;
    status: TreeItemStatus;
    items?: Array<TreeItem<T>>;
}

interface TreeProps<T> {
    items?: Array<TreeItem<T>>;
    render: (item: TreeItem<T>, level?: number) => ReactElement<{}>;
    toggleItemOpen: (id: string, status: TreeItemStatus) => void;
    toggleItemActive: (id: string, status: TreeItemStatus) => void;
    level?: number;
    onContextMenu: (event: React.MouseEvent<HTMLElement>, item: TreeItem<T>) => void;
    showSelection?: boolean;
    onSelectionChange?: (event: React.ChangeEvent<HTMLInputElement>, item: TreeItem<T>) => void;
}

export const Tree = withStyles(styles)(
    class Component<T> extends React.Component<TreeProps<T> & WithStyles<CssRules>, {}> {
        render(): ReactElement<any> {
            const level = this.props.level ? this.props.level : 0;
            const { classes, render, toggleItemOpen, items, toggleItemActive, onContextMenu } = this.props;
            const { list, listItem, loader, toggableIconContainer, renderContainer } = classes;
            return <List component="div" className={list}>
                {items && items.map((it: TreeItem<T>, idx: number) =>
                    <div key={`item/${level}/${idx}`}>
                        <ListItem button className={listItem} style={{ paddingLeft: (level + 1) * 20 }}
                            onClick={() => toggleItemActive(it.id, it.status)}
                            onContextMenu={this.handleRowContextMenu(it)}>
                            {it.status === TreeItemStatus.PENDING ?
                                <CircularProgress size={10} className={loader} /> : null}
                            <i onClick={() => this.props.toggleItemOpen(it.id, it.status)}
                                className={toggableIconContainer}>
                                <ListItemIcon className={this.getToggableIconClassNames(it.open, it.active)}>
                                    {it.status !== TreeItemStatus.INITIAL && it.items && it.items.length === 0 ? <span /> : <SidePanelRightArrowIcon />}
                                </ListItemIcon>
                            </i>
                            {this.props.showSelection &&
                                <Checkbox
                                    checked={it.selected}
                                    className={classes.checkbox}
                                    color="primary"
                                    onChange={this.handleCheckboxChange(it)} />}
                            <div className={renderContainer}>
                                {render(it, level)}
                            </div>
                        </ListItem>
                        {it.items && it.items.length > 0 &&
                            <Collapse in={it.open} timeout="auto" unmountOnExit>
                                <Tree
                                    showSelection={this.props.showSelection}
                                    items={it.items}
                                    render={render}
                                    toggleItemOpen={toggleItemOpen}
                                    toggleItemActive={toggleItemActive}
                                    level={level + 1}
                                    onContextMenu={onContextMenu} />
                            </Collapse>}
                    </div>)}
            </List>;
        }

        getToggableIconClassNames = (isOpen?: boolean, isActive?: boolean) => {
            const { iconOpen, iconClose, active, toggableIcon } = this.props.classes;
            return classnames(toggableIcon, {
                [iconOpen]: isOpen,
                [iconClose]: !isOpen,
                [active]: isActive
            });
        }

        handleRowContextMenu = (item: TreeItem<T>) =>
            (event: React.MouseEvent<HTMLElement>) =>
                this.props.onContextMenu(event, item)

        handleCheckboxChange = (item: TreeItem<T>) => {
            const { onSelectionChange } = this.props;
            return onSelectionChange
                ? (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                    onSelectionChange(event, item);
                }
                : undefined;
        }
    }
);
