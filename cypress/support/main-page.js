// Accepts cookies when needed
Cypress.Commands.add('handleCookieConsent', () => {
  cy.get('body').then(($body) => {
    cy.get($body).click()
    if ($body.find('.borlabs-hide').length === 0) {
      cy.get('#CookieBoxSaveButton').click()
    }
  })
})

// Checks bookmarks in different levels of the menu.
Cypress.Commands.add('checkBookmark', (level, dropdownOption, bookmark) => {
  switch (level) {
    case 'dropdown':
      cy.get('.oxy-mega-dropdown').contains(dropdownOption)
        .should('be.visible')
      break

    case 'tab':
      cy.get('.oxy-mega-dropdown').contains(dropdownOption)
        .trigger('mouseover')
      cy.get('.oxy-tab').contains(bookmark)
        .should('be.visible')
      break

    case 'link':
      cy.get('.oxy-mega-dropdown').contains(dropdownOption)
        .trigger('mouseover')
      cy.get('.oxy-mega-dropdown_inner :visible')
        .should('contain', bookmark)
      break
  }
})

Cypress.Commands.add('clickMenuItem', (level, dropdownOption, bookmark) => {
  switch (level) {
    case 'dropdown':
      cy.get('.oxy-mega-dropdown').contains(dropdownOption)
        .click()
      break

    case 'tab':
      cy.get('.oxy-mega-dropdown').contains(dropdownOption)
        .trigger('mouseover')
      cy.get('.oxy-tab').contains(bookmark)
        .click()
      break

    case 'link':
      cy.get('.oxy-mega-dropdown').contains(dropdownOption)
        .trigger('mouseover')
      cy.get('.oxy-mega-dropdown_inner :visible').contains(bookmark)
        .click()
      break
  }
})

// Makes a search and checks that there are results when expected
Cypress.Commands.add('searchAndCheckResult', (expectResults, textToSearch) => {
  cy.get('[id*="open-header-search"]').click()
  cy.get('input[type="search"]')
    .should('be.visible')
    .and('have.attr', 'placeholder', 'Search...')
    .type(`${textToSearch}{enter}`)
  
  switch (expectResults) {
    case false:
      cy.get('.initialized').parent()
        .should('be.visible')
        .and('contain', 'Sorry, no results for:')
        .and('contain', textToSearch)
      break

    case true:
      cy.get('.initialized').parent()
        .should('be.visible')
        .and('contain', 'Search results for:')
        .and('contain', textToSearch)
      break
  }
})
