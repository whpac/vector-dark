/// <reference types="cypress" />

describe('dark vector test', () => {
  beforeEach('login', () => {
    cy.login(Cypress.env('WIKI_PASSWORD'));
  });

  it('test discussion', () => {
    cy.visit('/wiki/Dyskusja_wikipedysty:Ciemny_vector_test');
    cy.dark_vector_wait();
    cy.matchImageSnapshot('discussion');
  });

  it('Covid-19 page', () => {
    cy.visit('/wiki/Wikipedysta:Ciemny_vector_test/Covid-19');
    cy.dark_vector_wait();
    cy.matchImageSnapshot('covid');
  });
});