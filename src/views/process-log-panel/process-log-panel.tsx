// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { RootState } from '~/store/store';
import { connect } from 'react-redux';
import { getProcess } from '~/store/processes/process';
import { Dispatch } from 'redux';
import { openProcessContextMenu } from '~/store/context-menu/context-menu-actions';
import { matchProcessLogRoute } from '~/routes/routes';
import { ProcessLogPanelRootDataProps, ProcessLogPanelRootActionProps, ProcessLogPanelRoot } from './process-log-panel-root';
import { getProcessPanelLogs } from '~/store/process-logs-panel/process-logs-panel';
import { setProcessLogsPanelFilter } from '~/store/process-logs-panel/process-logs-panel-actions';
import { getProcessLogsPanelCurrentUuid } from '../../store/process-logs-panel/process-logs-panel';

export interface Log {
    object_uuid: string;
    event_at: string;
    event_type: string;
    summary: string;
    properties: any;
}

export interface FilterOption {
    label: string;
    value: string;
}

const mapStateToProps = (state: RootState): ProcessLogPanelRootDataProps => {
    const { resources, processLogsPanel } = state;
    const uuid = getProcessLogsPanelCurrentUuid(state) || '';
    return {
        process: getProcess(uuid)(resources),
        selectedFilter: { label: processLogsPanel.selectedFilter, value: processLogsPanel.selectedFilter },
        filters: processLogsPanel.filters.map(filter => ({ label: filter, value: filter })),
        lines: getProcessPanelLogs(processLogsPanel)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ProcessLogPanelRootActionProps => ({
    onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
        dispatch<any>(openProcessContextMenu(event));
    },
    onChange: (filter: FilterOption) => {
        dispatch(setProcessLogsPanelFilter(filter.value));
    }
});

export const ProcessLogPanel = connect(mapStateToProps, mapDispatchToProps)(ProcessLogPanelRoot);
