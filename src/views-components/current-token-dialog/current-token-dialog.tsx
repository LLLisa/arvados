// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, WithStyles, withStyles, StyleRulesCallback, Button, Typography } from '@material-ui/core';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { ArvadosTheme } from '~/common/custom-theme';
import { withDialog } from '~/store/dialog/with-dialog';
import { WithDialogProps } from '~/store/dialog/with-dialog';
import { connect, DispatchProp } from 'react-redux';
import { CurrentTokenDialogData, getCurrentTokenDialogData, CURRENT_TOKEN_DIALOG_NAME } from '~/store/current-token-dialog/current-token-dialog-actions';
import { DefaultCodeSnippet } from '~/components/default-code-snippet/default-code-snippet';
import { snackbarActions, SnackbarKind } from '~/store/snackbar/snackbar-actions';

type CssRules = 'link' | 'paper' | 'button' | 'copyButton';

const styles: StyleRulesCallback<CssRules> = (theme: ArvadosTheme) => ({
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        margin: '0px 4px'
    },
    paper: {
        padding: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2,
        backgroundColor: theme.palette.grey["200"],
        border: `1px solid ${theme.palette.grey["300"]}`
    },
    button: {
        fontSize: '0.8125rem',
        fontWeight: 600
    },
    copyButton: {
        boxShadow: 'none',
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    }
});

type CurrentTokenProps = CurrentTokenDialogData & WithDialogProps<{}> & WithStyles<CssRules> & DispatchProp;

export class CurrentTokenDialogComponent extends React.Component<CurrentTokenProps> {
    onCopy = (message: string) => {
        this.props.dispatch(snackbarActions.OPEN_SNACKBAR({
            message,
            hideDuration: 2000,
            kind: SnackbarKind.SUCCESS
        }));
    }

    getSnippet = ({ apiHost, currentToken }: CurrentTokenDialogData) =>
        `HISTIGNORE=$HISTIGNORE:'export ARVADOS_API_TOKEN=*'
export ARVADOS_API_TOKEN=${currentToken}
export ARVADOS_API_HOST=${apiHost}
unset ARVADOS_API_HOST_INSECURE`

    render() {
        const { classes, open, closeDialog, ...data } = this.props;
        return <Dialog
            open={open}
            onClose={closeDialog}
            fullWidth={true}
            maxWidth='md'>
            <DialogTitle>Current Token</DialogTitle>
            <DialogContent>
                <Typography paragraph={true}>
                    The Arvados API token is a secret key that enables the Arvados SDKs to access Arvados with the proper permissions.
                        <Typography component='span'>
                            For more information see
                            <a href='http://doc.arvados.org/user/reference/api-tokens.html' target='blank' className={classes.link}>
                                Getting an API token.
                            </a>
                        </Typography>
                </Typography>
                <Typography paragraph={true}>
                    Paste the following lines at a shell prompt to set up the necessary environment for Arvados SDKs to authenticate to your account.
                </Typography>
                <DefaultCodeSnippet lines={[this.getSnippet(data)]} />
                <CopyToClipboard text={this.getSnippet(data)} onCopy={() => this.onCopy('Token copied to clipboard')}>
                    <Button
                        color="primary"
                        size="small"
                        variant="contained"
                        className={classes.copyButton}
                    >
                        COPY TO CLIPBOARD
                    </Button>
                </CopyToClipboard>
                <Typography >
                    Arvados
                            <a href='http://doc.arvados.org/user/reference/api-tokens.html' target='blank' className={classes.link}>virtual machines</a>
                    do this for you automatically. This setup is needed only when you use the API remotely (e.g., from your own workstation).
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} className={classes.button} color="primary">CLOSE</Button>
            </DialogActions>
        </Dialog>;
    }
}

export const CurrentTokenDialog =
    withStyles(styles)(
        connect(getCurrentTokenDialogData)(
            withDialog(CURRENT_TOKEN_DIALOG_NAME)(CurrentTokenDialogComponent)));

