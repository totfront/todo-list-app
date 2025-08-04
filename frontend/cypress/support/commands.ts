/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add a new todo
       * @example cy.addTodo('Buy groceries')
       */
      addTodo(title: string): Chainable<void>;

      /**
       * Custom command to toggle todo completion
       * @example cy.toggleTodo('Buy groceries')
       */
      toggleTodo(title: string): Chainable<void>;

      /**
       * Custom command to delete a todo
       * @example cy.deleteTodo('Buy groceries')
       */
      deleteTodo(title: string): Chainable<void>;

      /**
       * Custom command to filter todos
       * @example cy.filterTodos('all')
       */
      filterTodos(filter: 'all' | 'pending' | 'completed'): Chainable<void>;
    }
  }
}

// Custom command to add a new todo
Cypress.Commands.add('addTodo', (title: string) => {
  cy.get('#new-task-input').type(title);
  cy.get('#add-task-button').click();
});

// Custom command to toggle todo completion
Cypress.Commands.add('toggleTodo', (title: string) => {
  cy.contains('.taskItem', title).find('.taskCheckbox').click();
});

// Custom command to delete a todo
Cypress.Commands.add('deleteTodo', (title: string) => {
  cy.contains('.taskItem', title).find('.deleteBtn').click();
});

// Custom command to filter todos
Cypress.Commands.add(
  'filterTodos',
  (filter: 'all' | 'pending' | 'completed') => {
    const filterMap = {
      all: 'Show all tasks',
      pending: 'Show pending tasks',
      completed: 'Show completed tasks',
    };
    cy.get(`[aria-label="${filterMap[filter]}"]`).click();
  }
);
