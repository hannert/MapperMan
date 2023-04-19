context('Actions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })
    it('login', () => {
      cy.get('#login-button').click()
      cy.get('#email').type('csh')
      cy.get('#password').type('asdfasdf')
      cy.get('#sign-in-button').click()
    })
  })