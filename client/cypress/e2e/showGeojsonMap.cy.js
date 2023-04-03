
context('Actions', () => {
    beforeEach(() => {
      cy.visit('https://mapperman.netlify.app/')
    })
    it('open map', () => {
      cy.get('#get-by-id-button').type('642a76b1a946889825d2cf1f')
      cy.get('#get-map-id').click()
    })
  })