// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import React from 'react';
import { StyleRulesCallback, WithStyles, withStyles, Grid, LinearProgress } from '@material-ui/core';
import { User } from "models/user";
import { ArvadosTheme } from 'common/custom-theme';
import { WorkbenchPanel } from 'views/workbench/workbench';
import { LoginPanel } from 'views/login-panel/login-panel';
import { InactivePanel } from 'views/inactive-panel/inactive-panel';
import { WorkbenchLoadingScreen } from 'views/workbench/workbench-loading-screen';
import { MainAppBar } from 'views-components/main-app-bar/main-app-bar';
import { toggleSidePanel } from 'store/store';

type CssRules = 'root';

const styles: StyleRulesCallback<CssRules> = (theme: ArvadosTheme) => ({
    root: {
        overflow: 'hidden',
        width: '100vw',
        height: '100vh'
    }
});

export interface MainPanelRootDataProps {
    user?: User;
    working: boolean;
    loading: boolean;
    buildInfo: string;
    uuidPrefix: string;
    isNotLinking: boolean;
    isLinkingPath: boolean;
    siteBanner: string;
    sessionIdleTimeout: number;
    sidePanelIsCollapsed: boolean;
}

type MainPanelRootProps = MainPanelRootDataProps & WithStyles<CssRules>;

export const MainPanelRoot = withStyles(styles)(
    (props: MainPanelRootProps | any) =>{
        const{ classes, loading, working, user, buildInfo, uuidPrefix,
            isNotLinking, isLinkingPath, siteBanner, sessionIdleTimeout, sidePanelIsCollapsed: sidePanelIsCollapsed } = props
            return loading
            ? <WorkbenchLoadingScreen />
            : <>
                {isNotLinking && <MainAppBar
                    user={user}
                    buildInfo={buildInfo}
                    uuidPrefix={uuidPrefix}
                    siteBanner={siteBanner}
                    sidePanelIsCollapsed={sidePanelIsCollapsed}
                    toggleSidePanel={props.toggleSidePanel}
                    >
                    {working
                        ? <LinearProgress color="secondary" data-cy="linear-progress" />
                        : null}
                </MainAppBar>}
                <Grid container direction="column" className={classes.root}>
                    {user
                        ? (user.isActive || (!user.isActive && isLinkingPath)
                        ? <WorkbenchPanel isNotLinking={isNotLinking} isUserActive={user.isActive} sessionIdleTimeout={sessionIdleTimeout} sidePanelIsCollapsed={sidePanelIsCollapsed}/>
                        : <InactivePanel />)
                        : <LoginPanel />}
                </Grid>
            </>
}
);
