// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions, Theme } from '@material-ui/core/styles/createMuiTheme';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import red from '@material-ui/core/colors/red';

interface ArvadosThemeOptions extends ThemeOptions {
    customs: any;
}

export interface ArvadosTheme extends Theme {
    customs: {
        colors: Colors
    };
}

interface Colors {
    green700: string;
    yellow700: string;
}

const red900 = red["900"];
const purple800 = purple["800"];
const grey200 = grey["200"];
const grey300 = grey["300"];
const grey500 = grey["500"];
const grey600 = grey["600"];
const grey700 = grey["700"];
const grey900 = grey["900"];
const rocheBlue = '#06C';

const themeOptions: ArvadosThemeOptions = {
    customs: {
        colors: {
            green700: green["700"],
            yellow700: yellow["700"]
        }
    },
    overrides: {
        MuiTypography: {
            body1: {
                fontSize: '0.8125rem'
            }
        },
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: purple800
            }
        },
        MuiTabs: {
            root: {
                color: grey600
            },
            indicator: {
                backgroundColor: purple800
            }
        },
        MuiTab: {
            selected: {
                fontWeight: 700,
                color: purple800
            }
        },
        MuiList: {
            root: {
                color: grey900
            }
        },
        MuiListItemText: {
            root: {
                padding: 0
            }
        },
        MuiListItemIcon: {
            root: {
                fontSize: '1.25rem'
            }
        },
        MuiCardHeader: {
            avatar: {
                display: 'flex',
                alignItems: 'center'
            },
            title: {
                color: grey700,
                fontSize: '1.25rem'
            }
        },
        MuiMenuItem: {
            root: {
                padding: '8px 16px'
            }
        },
        MuiInput: {
            underline: {
                '&:after': {
                    borderBottomColor: purple800
                },
                '&:hover:not($disabled):not($focused):not($error):before': {
                    borderBottom: '1px solid inherit'
                }
            }
        },
        MuiFormLabel: {
            focused: {
                "&$focused:not($error)": {
                    color: purple800
                }
            }
        },
        MuiChip: {
            root: {
                color: 'white',
                backgroundColor: rocheBlue
            }
        }
    },
    mixins: {
        toolbar: {
            minHeight: '48px'
        }
    },
    palette: {
        primary: {
            main: rocheBlue,
            dark: blue.A100
        }
    }
};

export const CustomTheme = createMuiTheme(themeOptions);