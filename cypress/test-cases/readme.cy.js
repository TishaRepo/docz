context('Window', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/readme')
    })
  
    it('cy.window() - get the global window object', () => {
      
      cy.window().should('have.property', 'top')
    })
  
    it('cy.document() - get the document object', () => {
     
      cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
    })
})

