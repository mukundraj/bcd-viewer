
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

    cy.get('.sctable')
      .contains('td', 'Ex_Cyp26b1_Slc30a3_Ptprc_3')

    cy.get('.sctable')
      .contains('td', 'Ex_Rorb_Fibcd1_Syt6')

    cy.get('.sctable')
      .contains('td', 'Ex_Iqcj_Ms4a15_1')

    cy.get('.sctable')
      .contains('td', 'Ex_Iqcj_Ms4a15_2')

    cy.get('.sctable')
      .contains('td', 'Ex_Slc30a3_Scn5a')

    cy.get('.sctable')
      .contains('td', 'Ex_Ccn3_Fezf2_Mndal')

    cy.get('.sctable')
      .contains('td', 'Ex_Crym_Csf2rb2')

    cy.get('.sctable')
      .contains('td', 'Ex_Crym_Cldn22')

    cy.get('.sctable')
      .contains('td', 'Ex_Trabd2b_Slc30a3_Vgll3')

    cy.get('.sctable')
      .contains('td', 'Ex_Rorb_Scn5a_Rxrg')

    cy.wait(1000)
    cy.get('#maxCellTypesSlider')
      .then($el => $el[0].stepDown(1) )
      .trigger('change')
      
    cy.wait(1000)

    cy.get('.sctable')
      .contains('td', 'Ex_Rorb_Scn5a_Rxrg').should('not.exist')

 }) 

  it('Test Vip', () => {
    cy.get('.rbt-input-main').type('vip')
      .click()
      cy.wait(2000)
cy.get('.rbt-input-main')
      .type('{downarrow}')
      .type('{enter}')
    
    cy.get('.sctable')
      .contains('td', 'DopEx_Calb1_Col6a5')

    cy.get('.sctable')
      .contains('td', 'Inh_Vip_Sncg_Yjefn3')

    cy.get('.sctable')
      .contains('td', 'DopEx_Calb1_Npw_1')

    cy.get('.sctable')
      .contains('td', 'Inh_Vip_Crh_Sema5b')

    cy.get('.sctable')
      .contains('td', 'Inh_Vip_Sncg_Slit1')

    cy.get('.sctable')
      .contains('td', 'Inh_Vip_Grpr')

      cy.wait(1000)
    cy.get('#maxCellTypesSlider')
      .then($el => $el[0].stepDown(5) )
      .trigger('change')

      cy.wait(1000)
    cy.get('.sctable')
      .contains('td', 'Inh_Vip_Grpr').should('not.exist')

    cy.get('#rdts1-1').check() // selecting fiber tracts

    cy.get('.sctable')
      .contains('td', 'Ex_Pou4f1_Htr5b_7')

    cy.get('.sctable')
      .contains('td', 'Ex_Nxph4_Moxd1_Igfbp4')

    cy.get('.sctable')
      .contains('td', 'Inh_Lhx6_Sst_Ccna1_3')

    cy.get('.sctable')
      .contains('td', 'Ex_Nxph4_Ror1')
    
    cy.get('.sctable')
      .contains('td', 'Ex_Nxph4_Kynu')

  })
})
