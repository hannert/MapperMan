context('Actions', () => {
    beforeEach(() => {
      cy.visit('mapperman.netlify.app')
    })
    it('forgot-password', () => {
      cy.get('#login-button').click()
      cy.get('#forgot-password-link').click()
      cy.get('#confirm-change-password-button').click()
    })
  })