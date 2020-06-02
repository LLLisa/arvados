// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const controllerURL = Cypress.env('controller_url');
const systemToken = Cypress.env('system_token');

Cypress.Commands.add(
    "doRequest", (method='GET', path='', data=null, qs=null,
                   token=systemToken, auth=false, followRedirect=true) => {
        return cy.request({
            method: method,
            url: `${controllerURL}/${path}`,
            body: data,
            qs: auth ? qs : Object.assign({api_token: token}, qs),
            auth: auth ? {bearer: `${token}`} : undefined,
            followRedirect: followRedirect
        })
    }
)

// This resets the DB removing all content and seeding it with the fixtures.
// TODO: Maybe we can add an optional param to avoid the loading part?
Cypress.Commands.add(
    "resetDB", () => {
        cy.request('POST', `${controllerURL}/database/reset?api_token=${systemToken}`);
    }
)

Cypress.Commands.add(
    "getUser", (username, first_name='', last_name='', is_admin=false, is_active=true) => {
        // Create user if not already created
        return cy.doRequest('POST', '/auth/controller/callback', {
            auth_info: JSON.stringify({
                email: `${username}@example.local`,
                username: username,
                first_name: first_name,
                last_name: last_name,
                alternate_emails: []
            }),
            return_to: ',https://example.local'
        }, null, systemToken, true, false) // Don't follow redirects so we can catch the token
        .its('headers.location').as('location')
        // Get its token and set the account up as admin and/or active
        .then(function() {
            this.userToken = this.location.split("=")[1]
            assert.isString(this.userToken)
            return cy.doRequest('GET', '/arvados/v1/users', null, {
                filters: `[["username", "=", "${username}"]]`
            })
            .its('body.items.0')
            .as('aUser')
            .then(function() {
                cy.doRequest('PUT', `/arvados/v1/users/${this.aUser.uuid}`, {
                    user: {
                        is_admin: is_admin,
                        is_active: is_active
                    }
                })
                .its('body')
                .as('theUser')
                .then(function() {
                    return {user: this.theUser, token: this.userToken};
                })
            })
        })
    }
)

Cypress.Commands.add(
    "createLink", (token, data) => {
        return cy.createResource(token, 'links', {
            link: JSON.stringify(data)
        })
    }
)

Cypress.Commands.add(
    "createGroup", (token, data) => {
        return cy.createResource(token, 'groups', {
            group: JSON.stringify(data),
            ensure_unique_name: true
        })
    }
)

Cypress.Commands.add(
    "createCollection", (token, data) => {
        return cy.createResource(token, 'collections', {
            collection: JSON.stringify(data),
            ensure_unique_name: true
        })
    }
)

Cypress.Commands.add(
    "createResource", (token, suffix, data) => {
        return cy.doRequest('POST', '/arvados/v1/'+suffix, data, null, token, true)
        .its('body').as('resource')
        .then(function() {
            return this.resource;
        })
    }
)

Cypress.Commands.add(
    "loginAs", (user) => {
        cy.visit(`/token/?api_token=${user.token}`);
        cy.url().should('contain', '/projects/');
        cy.get('div#root').should('contain', 'Arvados Workbench (zzzzz)');
        cy.get('div#root').should('not.contain', 'Your account is inactive');
    }
)