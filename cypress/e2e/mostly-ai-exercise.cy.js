describe('Mostly AI e2e tests', () => {

  beforeEach(() => {
    cy.fixture('userDetails').as('userDetails')

    cy.visit('https://mostly.ai/')
    cy.handleCookieConsent()
  })
  it('should show bookmarks: Platform, Use Cases, Synthetic Data, Resources, Contact', () => {
    // check all dropdown options
    cy.checkBookmark('dropdown', 'Platform')
    cy.checkBookmark('dropdown', 'Synthetic Data')
    cy.checkBookmark('dropdown', 'Resources')
    cy.checkBookmark('dropdown', 'Company')

    // check remaining bookmarks from the list
    cy.checkBookmark('tab', 'Platform', 'Platform')
    cy.checkBookmark('tab', 'Platform', 'Use Cases')

    cy.checkBookmark('link', 'Company', 'Contact')
  })

  it('should search for something with no results', () => {
    cy.searchAndCheckResult(false, 'sythetic')
  })

  it('should navigate to contact form and fill in details', () => {
    cy.intercept('GET', 'https://forms.hubspot.com/collected-forms/**').as('getForms')

    cy.clickMenuItem('link', 'Company', 'Contact')

    // for some reason the form is not loaded unless we click on the form
    cy.contains('Ask us anything!')
      .should('be.visible')
      .click()

    // wait for form to be fully loaded
    cy.wait('@getForms')
    cy.get('.hs-loader')
      .should('not.be.visible')
    cy.url()
      .should('include', '/contact')

    // fill in the form
    cy.get('@userDetails').then(({ tester }) => {
      cy.fillInContactForm(tester)
    })

    // Opt in to Marketing offers & updates
    cy.get('input[id^="LEGAL_CONSENT"]')
      .click()

    // hover over submit button
    cy.get('input[type="submit"]').contains('SEND MESSAGE')
      .trigger('mouseover')
  })
})
