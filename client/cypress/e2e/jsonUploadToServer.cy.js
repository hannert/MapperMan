context('Actions', () => {
  beforeEach(() => {
    cy.visit('https://mapperman.netlify.app/')
  })
  it('chooses files', () => {
    cy.get('#choose-file-button').selectFile('Africa_Med.json')
    cy.get('#upload-file-button').click()
    cy.get("#get-public-maps-button").click()
    cy.get("#get-public-maps-button").click()
  })
})