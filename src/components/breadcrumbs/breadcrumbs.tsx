// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { Button, Grid, StyleRulesCallback, WithStyles, Typography, Tooltip } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core';

export interface Breadcrumb {
    label: string;
}

interface BreadcrumbsProps {
    items: Breadcrumb[];
    onClick: (breadcrumb: Breadcrumb) => void;
}

const Breadcrumbs: React.SFC<BreadcrumbsProps & WithStyles<CssRules>> = ({ classes, onClick, items }) => {
    return <Grid container alignItems="center" wrap="nowrap">
        {
            items.map((item, index) => {
                const isLastItem = index === items.length - 1;
                return (
                    <React.Fragment key={index}>
                        <Tooltip title={item.label}>
                            <Button
                                color="inherit"
                                className={isLastItem ? classes.currentItem : classes.item}
                                onClick={() => onClick(item)}
                            >
                                <Typography
                                    noWrap
                                    color="inherit"
                                    className={classes.label}
                                >
                                    {item.label}
                                </Typography>
                            </Button>
                        </Tooltip>
                        {
                            !isLastItem && <ChevronRightIcon color="inherit" className={classes.item} />
                        }
                    </React.Fragment>
                );
            })
        }
    </Grid>;
};

type CssRules = "item" | "currentItem" | "label";

const styles: StyleRulesCallback<CssRules> = theme => {
    const { unit } = theme.spacing;
    return {
        item: {
            opacity: 0.6
        },
        currentItem: {
            opacity: 1
        },
        label: {
            textTransform: "none"
        }
    };
};

export default withStyles(styles)(Breadcrumbs);

