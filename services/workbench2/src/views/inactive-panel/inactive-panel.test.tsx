// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";
import { CustomTheme } from 'common/custom-theme';
import { InactivePanelStateProps, CssRules, InactivePanelRoot } from './inactive-panel';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';

import { StyledComponentProps } from '@mui/styles';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


configure({ adapter: new Adapter() });

describe('InactivePanel', () => {
    let props: InactivePanelStateProps & StyledComponentProps<CssRules>;

    beforeEach(() => {
        props = {
            classes: {
                root: 'root',
                title: 'title',
                ontop: 'ontop',
            },
            isLoginClusterFederation: false,
            inactivePageText: 'Inactive page content',
        };
    });

    it('should render content and link account option', () => {
        // given
        const expectedMessage = "Inactive page content";
        const expectedLinkAccountText = 'If you would like to use this login to access another account click "Link Account"';

        // when
        const wrapper = mount(
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={CustomTheme}>
                    <InactivePanelRoot {...props} />
                </ThemeProvider>
            </StyledEngineProvider>
            );

        // then
        expect(wrapper.find('p').first().text()).toContain(expectedMessage);
        expect(wrapper.find('p').at(1).text()).toContain(expectedLinkAccountText);
    })

    it('should render content and link account warning on LoginCluster federations', () => {
        // given
        props.isLoginClusterFederation = true;
        const expectedMessage = "Inactive page content";
        const expectedLinkAccountText = 'If you would like to use this login to access another account, please contact your administrator';

        // when
        const wrapper = mount(
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={CustomTheme}>
                    <InactivePanelRoot {...props} />
                </ThemeProvider>
            </StyledEngineProvider>
            );

        // then
        expect(wrapper.find('p').first().text()).toContain(expectedMessage);
        expect(wrapper.find('p').at(1).text()).toContain(expectedLinkAccountText);
    })
});