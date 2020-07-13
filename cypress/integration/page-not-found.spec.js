// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

describe('Page not found tests', function() {
    let adminUser;

    before(function() {
        cy.getUser('admin', 'Admin', 'User', true, true)
            .as('adminUser').then(function() {
                adminUser = this.adminUser;
            }
        );
    });

    beforeEach(function() {
        cy.clearCookies()
        cy.clearLocalStorage()
    });

    it('shows not found page', function() {
        // given
        const invalidUUID = '1212r12r12r12r12r12r21r'

        // when
        cy.loginAs(adminUser);
        cy.visit(`/collections/${invalidUUID}`);

        // then
        cy.get('[data-cy=not-found-page]').should('exist');
        cy.get('[data-cy=not-found-content]').should('exist');
    });


    it('shows not found popup', function() {
        // given
        const notExistingUUID = 'zzzzz-tpzed-5o5tg0l9a57gxxx';

        // when
        cy.loginAs(adminUser);
        cy.visit(`/projects/${notExistingUUID}`);

        // then
        cy.get('[data-cy=not-found-page]').should('not.exist');
        cy.get('[data-cy=not-found-content]').should('exist');
    });
})