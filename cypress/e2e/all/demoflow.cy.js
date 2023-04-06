
describe('demo flow tests', () => {
  // before(() => {
  //   // Cypress starts out with a blank slate for each test
  //   // so we must tell it to visit our website with the `cy.visit()` command.
  //   // Since we want to visit the same URL at the start of all our tests,
  //   // we include it in our beforeEach function so that it runs before each test
  //   cy.visit('/genex')
  // })

  it('Always passing test', () => {
    expect(3).to.equal(3);
  })

  it('Test genex', () => {

    cy.visit('/genex')
    cy.get('.react-multi-carousel-dot-list > [data-index="8"]')
      .click();
    expect(3).to.equal(3);

    // primary gene PCP4

    // second gene GAD2

    // screenshot

    // uncheck GAD2

    // select select Midbrain raphe nuclei

    // jump to slide 79 using arrow next to checkbox

    // screenshot


    // set region enrichment 0.15 and 0.010, select Tph2, ensure jump to puck74

    // screenshot



  });

  it('Test singlecell', () => {
    cy.visit('/singlecell')

    // test rbfox3 with triangular nuclues of septum, should jump to cellspatial automatically

    // in CellSpatial ensure Ex_Sln_Sost_2 selected

    // screenshot

  })

  it('Test cellspatial', () => {
    cy.visit('/cellspatial')

    // select Midbrain raphe nuclei, and RegEnrich vals 27% 139 shows SerEx

    // ensure serex is only option

    // click serex

    // screenshot

  })

})

