// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Dispatch } from "redux";
import { dialogActions } from "~/store/dialog/dialog-actions";

export const RICH_TEXT_EDITOR_DIALOG_NAME = 'richTextEditorDialogName';
export const openRichTextEditorDialog = (title: string, text: string) => 
    async (dispatch: Dispatch) => {
        dispatch(dialogActions.OPEN_DIALOG({ id: RICH_TEXT_EDITOR_DIALOG_NAME, data: { title, text } }));
    };