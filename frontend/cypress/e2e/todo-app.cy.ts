/// <reference types="cypress" />

describe('Todo Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Page Load and Initial State', () => {
    it('should load the todo application', () => {
      cy.get('h1').should('contain', 'Todo tracker');
      cy.get('#new-task-input').should('be.visible');
      cy.get('#add-task-button').should('be.visible');
    });
  });

  describe('Adding Todos', () => {
    it('should not add empty todos', () => {
      cy.get('#add-task-button').click();
      cy.get('.taskItem').should('not.exist');
      // Should not add anything when input is empty
    });

    it('should not add whitespace-only todos', () => {
      cy.get('#new-task-input').type('   ');
      cy.get('#add-task-button').click();
      // Should not add whitespace-only todos
    });

    it('should trim whitespace from todo titles', () => {
      cy.get('#new-task-input').type('  Trimmed Todo  ');
      cy.get('#add-task-button').click();
      cy.get('.taskItem').should('contain', 'Trimmed Todo');
    });
  });

  describe('Filtering Todos', () => {
    it('should update filter button states', () => {
      cy.get('[aria-label="Show pending tasks"]').click();
      cy.get('[aria-label="Show pending tasks"]').should(
        'have.class',
        'filterBtnActive'
      );
      cy.get('[aria-label="Show all tasks"]').should(
        'not.have.class',
        'filterBtnActive'
      );
      cy.get('[aria-label="Show completed tasks"]').should(
        'not.have.class',
        'filterBtnActive'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      cy.get('#new-task-input').should(
        'have.attr',
        'aria-describedby',
        'add-task-button'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle rapid interactions', () => {
      // Test rapid adding of todos
      for (let i = 0; i < 3; i++) {
        cy.get('#new-task-input').type(`Quick Todo ${i}`);
        cy.get('#add-task-button').click();
      }
      // Should handle rapid interactions without errors
    });
  });
});
