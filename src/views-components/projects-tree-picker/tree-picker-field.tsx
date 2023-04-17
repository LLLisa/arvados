// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import React from "react";
import { Typography } from "@material-ui/core";
import { TreeItem } from "components/tree/tree";
import { WrappedFieldProps } from 'redux-form';
import { ProjectsTreePicker } from 'views-components/projects-tree-picker/projects-tree-picker';
import { ProjectsTreePickerItem } from 'store/tree-picker/tree-picker-middleware';
import { PickerIdProp } from 'store/tree-picker/picker-id';
import { CollectionFileType, getCollectionResourceCollectionUuid } from "models/collection-file";
import { ResourceKind } from "models/resource";

export const ProjectTreePickerField = (props: WrappedFieldProps & PickerIdProp) =>
    <div style={{ display: 'flex', minHeight: 0, flexDirection: 'column' }}>
        <div style={{ flexBasis: '275px', flexShrink: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ProjectsTreePicker
                pickerId={props.pickerId}
                toggleItemActive={handleChange(props)}
                options={{ showOnlyOwned: false, showOnlyWritable: true }} />
            {props.meta.dirty && props.meta.error &&
                <Typography variant='caption' color='error'>
                    {props.meta.error}
                </Typography>}
        </div>
    </div>;

const handleChange = (props: WrappedFieldProps) =>
    (_: any, { id }: TreeItem<ProjectsTreePickerItem>) =>
        props.input.onChange(id);

export const CollectionTreePickerField = (props: WrappedFieldProps & PickerIdProp) =>
    <div style={{ display: 'flex', minHeight: 0, flexDirection: 'column' }}>
        <div style={{ flexBasis: '275px', flexShrink: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ProjectsTreePicker
                pickerId={props.pickerId}
                toggleItemActive={handleChange(props)}
                options={{ showOnlyOwned: false, showOnlyWritable: true }}
                includeCollections />
            {props.meta.dirty && props.meta.error &&
                <Typography variant='caption' color='error'>
                    {props.meta.error}
                </Typography>}
        </div>
    </div>;

const handleDirectoryChange = (props: WrappedFieldProps) =>
    (_: any, data: TreeItem<ProjectsTreePickerItem>) => {
        if ('kind' in data.data && data.data.kind === ResourceKind.COLLECTION) {
            props.input.onChange({
                uuid: data.data.uuid,
                path: '/'
            });
        } else if ('type' in data.data && data.data.type === CollectionFileType.DIRECTORY) {
            props.input.onChange({
                uuid: getCollectionResourceCollectionUuid(data.data.id),
                path: [data.data.path, data.data.name].join('/')
            });
        } else {
            props.input.onChange('');
        }
    }

export const DirectoryTreePickerField = (props: WrappedFieldProps & PickerIdProp) =>
    <div style={{ display: 'flex', minHeight: 0, flexDirection: 'column' }}>
        <div style={{ flexBasis: '275px', flexShrink: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ProjectsTreePicker
                pickerId={props.pickerId}
                toggleItemActive={handleDirectoryChange(props)}
                options={{ showOnlyOwned: false, showOnlyWritable: true }}
                includeCollections
                includeDirectories />
            {props.meta.dirty && props.meta.error &&
                <Typography variant='caption' color='error'>
                    {props.meta.error}
                </Typography>}
        </div>
    </div>;
