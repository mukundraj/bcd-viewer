
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

    // screenshot and checks

    // uncheck GAD2

    // select select Midbrain raphe nuclei

    // jump to slide 62 using arrow next to checkbox
    
    // check for values in top bar of regionwise barplot (pid 62, cptkr 91)
    
    // goto slide 63 using carousel

    // check for values in for_Puck ID display - should be 063
    
    // come back to slide 62 using regionwise barplot
    
    // check for values in top bar of regionwise barplot

    // set region enrichment 0.15 and 0.010, select Tph2, ensure jump to puck74

    // screenshot and checks for top values in RegEnrich table
    
    // check for top value in top bar of regionwise barplot - should be pid: 76 and cptkr:43

  });

  it('Test singlecell', () => {
    cy.visit('/singlecell')

    // test rbfox3 with triangular nuclues of septum

    // check table values

    // in CellSpatial ensure Ex_Sln_Sost_2 appears on table

    // screenshot and checks
    
    // click on Ex_Sln_Sost_2, should jump to cell spatial automatically


  })

  it('Test cellspatial', () => {
    cy.visit('/cellspatial')

    // select Midbrain raphe nuclei, and RegEnrich vals 27% 139 shows SerEx

    // ensure serex is only option

    // click serex

    // screenshot and checks

  })

})

