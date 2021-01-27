// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { WrappedFieldProps, Field, formValues, FormName } from 'redux-form';
import { compose } from 'redux';
import { Autocomplete } from '~/components/autocomplete/autocomplete';
import { Vocabulary, isStrictTag, getTagValues, getTagValueID } from '~/models/vocabulary';
import { PROPERTY_KEY_FIELD_ID, PROPERTY_KEY_FIELD_NAME } from '~/views-components/resource-properties-form/property-key-field';
import { handleSelect, handleBlur, VocabularyProp, ValidationProp, connectVocabulary, buildProps, handleChange } from '~/views-components/resource-properties-form/property-field-common';
import { TAG_VALUE_VALIDATION } from '~/validators/validators';
import { escapeRegExp } from '~/common/regexp.ts';

interface PropertyKeyProp {
    propertyKeyId: string;
    propertyKeyName: string;
}

interface PropertyValueInputProp {
    disabled: boolean;
}

type PropertyValueFieldProps = VocabularyProp & PropertyKeyProp & ValidationProp & PropertyValueInputProp;

export const PROPERTY_VALUE_FIELD_NAME = 'value';
export const PROPERTY_VALUE_FIELD_ID = 'valueID';

const connectVocabularyAndPropertyKey = compose(
    connectVocabulary,
    formValues({
        propertyKeyId: PROPERTY_KEY_FIELD_ID,
        propertyKeyName: PROPERTY_KEY_FIELD_NAME,
    }),
);

export const PropertyValueField = connectVocabularyAndPropertyKey(
    ({ skipValidation, ...props }: PropertyValueFieldProps) =>
        <span data-cy='property-field-value'>
        <Field
            name={PROPERTY_VALUE_FIELD_NAME}
            component={PropertyValueInput}
            validate={skipValidation ? undefined : getValidation(props)}
            {...{...props, disabled: !props.propertyKeyName}} />
        </span>
);

const PropertyValueInput = ({ vocabulary, propertyKeyId, propertyKeyName, ...props }: WrappedFieldProps & PropertyValueFieldProps) =>
    <FormName children={data => (
        <Autocomplete
            label='Value'
            disabled={props.disabled}
            suggestions={getSuggestions(props.input.value, propertyKeyId, vocabulary)}
            onSelect={handleSelect(PROPERTY_VALUE_FIELD_ID, data.form, props.input, props.meta)}
            onBlur={handleBlur(PROPERTY_VALUE_FIELD_ID, data.form, props.meta, props.input, getTagValueID(propertyKeyId, props.input.value, vocabulary))}
            onChange={handleChange(PROPERTY_VALUE_FIELD_ID, data.form, props.input, props.meta)}
            {...buildProps(props)}
        />
    )} />;

const getValidation = (props: PropertyValueFieldProps) =>
    isStrictTag(props.propertyKeyId, props.vocabulary)
        ? [...TAG_VALUE_VALIDATION, matchTagValues(props)]
        : TAG_VALUE_VALIDATION;

const matchTagValues = ({ vocabulary, propertyKeyId }: PropertyValueFieldProps) =>
    (value: string) =>
        getTagValues(propertyKeyId, vocabulary).find(v => v.label === value)
            ? undefined
            : 'Incorrect value';

const getSuggestions = (value: string, tagName: string, vocabulary: Vocabulary) => {
    const re = new RegExp(escapeRegExp(value), "i");
    return getTagValues(tagName, vocabulary).filter(v => re.test(v.label) && v.label !== value);
};
