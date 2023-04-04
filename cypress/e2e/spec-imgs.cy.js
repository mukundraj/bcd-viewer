describe('My app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('/singlecell')
  })
  it('should look good', () => {
    // cy.get('body').should('have.class', 'finished-loading');
    cy.percySnapshot('SC page');

    // cy.get('button').click();
    // cy.percySnapshot('Clicked button');
  });
});
