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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

addMatchImageSnapshotCommand({
  failureThreshold: 0.03,
  failureThresholdType: 'percent'
});

Cypress.Commands.add('login', (pass) => {
  cy.visit('/w/index.php?title=Specjalna:Zaloguj');
  cy.get('#wpName1').type('Ciemny vector test');
  cy.get('#wpPassword1').type(pass);
  // Wikipedia sometimes redirects without submiting a form
  cy.url().then(url => {
    if (url.match(/Zaloguj/)) {
      cy.get('#userloginForm form').submit();
    }
  });
});

Cypress.Commands.add('dark_vector_wait', (pass) => {
  cy.get('.vector-menu-content-list > li:nth-child(7)', { timeout: 10000 }).should('be.visible');
});
