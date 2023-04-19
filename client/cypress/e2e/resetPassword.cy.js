context('Actions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })
    it('change password', () => {
      cy.get('#login-button').click()
      cy.get('#forgot-password-link').click()
      cy.get('#email').type('csh')
      cy.get('#new-password').type('aaaaaaaa')
      cy.get('#confirm-newpassword').type('aaaaaaaa')
      cy.get('#confirm-change-password-button').click()
      cy.get('#email').type('csh')
      cy.get('#password').type('aaaaaaaa')
      cy.get('#sign-in-button').click()
    })
  })