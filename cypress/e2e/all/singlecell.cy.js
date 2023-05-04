
describe('Single cell tab misc tests', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('/singlecell')
  })


  it('Test slc17a7', () => {
    cy.visit('/singlecell')
    cy.get('.rbt-input-main').type('slc17a7')
      .click()
    cy.wait(2000)
cy.get('.rbt-input-main')
      .type('{downarrow}')
      .type('{enter}')

    cy.get('.table')
      .contains('td', 'Ex-Cyp26b1-Slc30a3-Ptprc-3')

    cy.get('.table')
      .contains('td', 'Ex-Rorb-Fibcd1-Syt6')

    cy.get('.table')
      .contains('td', 'Ex-Iqcj-Ms4a15-1')

    cy.get('.table')
      .contains('td', 'Ex-Iqcj-Ms4a15-2')

    cy.get('.table')
      .contains('td', 'Ex-Slc30a3-Scn5a')

    cy.get('.table')
      .contains('td', 'Ex-Ccn3-Fezf2-Mndal')

    cy.get('.table')
      .contains('td', 'Ex-Crym-Csf2rb2')

    cy.get('.table')
      .contains('td', 'Ex-Crym-Cldn22')

    cy.get('.table')
      .contains('td', 'Ex-Trabd2b-Slc30a3-Vgll3')

    cy.get('.table')
      .contains('td', 'Ex-Rorb-Scn5a-Rxrg')

    cy.wait(1000)
    cy.get('#maxCellTypesSlider')
      .then($el => $el[0].stepDown(1) )
      .trigger('change')
      
    cy.wait(1000)

    cy.get('.table')
      .contains('td', 'Ex_Rorb_Scn5a_Rxrg').should('not.exist')

 }) 

  it('Test Vip', () => {
    cy.get('.rbt-input-main').type('vip')
      .click()
      cy.wait(2000)
cy.get('.rbt-input-main')
      .type('{downarrow}')
      .type('{enter}')
    
    cy.get('.table')
      .contains('td', 'DopEx-Calb1-Col6a5')

    cy.get('.table')
      .contains('td', 'Inh-Vip-Sncg-Yjefn3')

    cy.get('.table')
      .contains('td', 'DopEx-Calb1-Npw-1')

    cy.get('.table')
      .contains('td', 'Inh-Vip-Crh-Sema5b')

    cy.get('.table')
      .contains('td', 'Inh-Vip-Sncg-Slit1')

    cy.get('.table')
      .contains('td', 'Inh-Vip-Grpr')

      cy.wait(1000)
    cy.get('#maxCellTypesSlider')
      .then($el => $el[0].stepDown(5) )
      .trigger('change')

      cy.wait(1000)
    cy.get('.table')
      .contains('td', 'Inh-Vip-Grpr').should('not.exist')

    cy.get('#rdts1-1').check() // selecting fiber tracts

    cy.get('.table')
      .contains('td', 'Ex-Pou4f1-Htr5b-7')

    cy.get('.table')
      .contains('td', 'Ex-Nxph4-Moxd1-Igfbp4')

    cy.get('.table')
      .contains('td', 'Inh-Lhx6-Sst-Ccna1-3')

    cy.get('.table')
      .contains('td', 'Ex-Nxph4-Ror1')
    
    cy.get('.table')
      .contains('td', 'Ex-Nxph4-Kynu')

  })
})
