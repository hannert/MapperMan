context('Actions', () => {
    beforeEach(() => {
      cy.visit('https://mapperman.netlify.app/')
    })
    it('guest', () => {
      cy.get('#continue-as-guest').click()
    })
  })