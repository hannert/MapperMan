context('Actions', () => {
    beforeEach(() => {
      cy.visit('mapperman.netlify.app')
    })
    it('login', () => {
      cy.get('#login-button').click()
      cy.get('#email').type('TestingAccount@gmail.com')
      cy.get('#password').type('12345678')
      cy.get('#sign-in-button').click()
    })
  })