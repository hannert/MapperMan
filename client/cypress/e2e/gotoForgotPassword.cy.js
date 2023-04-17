context('Actions', () => {
    beforeEach(() => {
      cy.visit('https://mapperman.netlify.app/')
    })
    it('forgotpassword', () => {
      cy.get('#login-button').click()
      cy.get('#forgot-password-link').click()
    })
  })