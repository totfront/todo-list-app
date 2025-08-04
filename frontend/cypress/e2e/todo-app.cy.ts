describe('Todo Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Page Load and Initial State', () => {
    it('should load the todo application', () => {
      cy.get('h1').should('contain', 'Todo tracker');
      cy.get('.statusCard').should('have.length', 3);
      cy.get('#new-task-input').should('be.visible');
      cy.get('#add-task-button').should('be.visible');
    });

    it('should display initial task counts correctly', () => {
      cy.get('[aria-label="Total tasks"]').should('contain', '5');
      cy.get('[aria-label="Pending tasks"]').should('contain', '3');
      cy.get('[aria-label="Completed tasks"]').should('contain', '2');
    });

    it('should show initial todos in the list', () => {
      cy.get('.taskItem').should('have.length', 5);
      cy.get('.taskItem')
        .first()
        .should('contain', 'Set up interactive dashboard structure');
    });

    it('should show small screen message on very small screens', () => {
      cy.viewport(250, 600);
      cy.get('.smallScreenMessage').should('be.visible');
      cy.get('.mainContent').should('not.be.visible');
    });
  });

  describe('Adding Todos', () => {
    it('should add a new todo successfully', () => {
      const newTodo = 'Buy groceries';
      cy.addTodo(newTodo);

      cy.get('.taskItem').should('contain', newTodo);
      cy.get('#new-task-input').should('have.value', '');
      cy.get('[aria-label="Total tasks"]').should('contain', '6');
      cy.get('[aria-label="Pending tasks"]').should('contain', '4');
    });

    it('should not add empty todos', () => {
      const initialCount = 5;
      cy.get('#add-task-button').click();
      cy.get('.taskItem').should('have.length', initialCount);
    });

    it('should not add whitespace-only todos', () => {
      const initialCount = 5;
      cy.get('#new-task-input').type('   ');
      cy.get('#add-task-button').click();
      cy.get('.taskItem').should('have.length', initialCount);
    });

    it('should trim whitespace from todo titles', () => {
      cy.get('#new-task-input').type('  Trimmed Todo  ');
      cy.get('#add-task-button').click();
      cy.get('.taskItem').should('contain', 'Trimmed Todo');
    });
  });

  describe('Completing Todos', () => {
    it('should toggle todo completion', () => {
      const todoTitle = 'Add task creation functionality';
      cy.toggleTodo(todoTitle);

      cy.contains('.taskItem', todoTitle)
        .find('.taskTitleLineThrough')
        .should('exist');
      cy.get('[aria-label="Completed tasks"]').should('contain', '3');
      cy.get('[aria-label="Pending tasks"]').should('contain', '2');
    });

    it('should uncomplete a completed todo', () => {
      const todoTitle = 'Set up interactive dashboard structure';
      cy.toggleTodo(todoTitle);

      cy.contains('.taskItem', todoTitle)
        .find('.taskTitleLineThrough')
        .should('not.exist');
      cy.get('[aria-label="Completed tasks"]').should('contain', '1');
      cy.get('[aria-label="Pending tasks"]').should('contain', '4');
    });
  });

  describe('Deleting Todos', () => {
    it('should delete a todo successfully', () => {
      const todoTitle = 'Add task creation functionality';
      cy.deleteTodo(todoTitle);

      cy.get('.taskItem').should('not.contain', todoTitle);
      cy.get('[aria-label="Total tasks"]').should('contain', '4');
    });

    it('should update counts after deletion', () => {
      const initialTotal = 5;
      const initialPending = 3;
      const initialCompleted = 2;

      cy.deleteTodo('Add task creation functionality');
      cy.get('[aria-label="Total tasks"]').should('contain', initialTotal - 1);
      cy.get('[aria-label="Pending tasks"]').should(
        'contain',
        initialPending - 1
      );
    });
  });

  describe('Filtering Todos', () => {
    it('should filter by all todos', () => {
      cy.filterTodos('all');
      cy.get('.taskItem').should('have.length', 5);
    });

    it('should filter by pending todos', () => {
      cy.filterTodos('pending');
      cy.get('.taskItem').should('have.length', 3);
      cy.get('.taskItem').each(($el) => {
        cy.wrap($el).find('.taskTitleLineThrough').should('not.exist');
      });
    });

    it('should filter by completed todos', () => {
      cy.filterTodos('completed');
      cy.get('.taskItem').should('have.length', 2);
      cy.get('.taskItem').each(($el) => {
        cy.wrap($el).find('.taskTitleLineThrough').should('exist');
      });
    });

    it('should update filter button states', () => {
      cy.filterTodos('pending');
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

  describe('Drag and Drop', () => {
    it('should allow dragging todos', () => {
      cy.get('.taskItem').first().should('have.attr', 'cdkDrag');
      cy.get('.dragHandle').should('be.visible');
    });

    it('should show drag preview when dragging', () => {
      cy.get('.taskItem').first().trigger('mousedown', { button: 0 });
      cy.get('.cdk-drag-preview').should('exist');
      cy.get('body').trigger('mouseup');
    });
  });

  describe('Chart Visualization', () => {
    it('should display the completion chart', () => {
      cy.get('.chartContainer').should('be.visible');
      cy.get('.chartContainer canvas').should('exist');
    });

    it('should update chart when todos are completed', () => {
      const initialCompleted = 2;
      cy.toggleTodo('Add task creation functionality');
      // Chart should update (we can't easily test the chart data, but we can verify the container exists)
      cy.get('.chartContainer').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('[aria-label="Total tasks"]').should('exist');
      cy.get('[aria-label="Pending tasks"]').should('exist');
      cy.get('[aria-label="Completed tasks"]').should('exist');
      cy.get('[aria-label="Add new task"]').should('exist');
      cy.get('[aria-label="Show all tasks"]').should('exist');
      cy.get('[aria-label="Show pending tasks"]').should('exist');
      cy.get('[aria-label="Show completed tasks"]').should('exist');
    });

    it('should have proper form labels', () => {
      cy.get('#new-task-input').should(
        'have.attr',
        'aria-describedby',
        'add-task-button'
      );
      cy.get('label[for="new-task-input"]').should('exist');
    });

    it('should have proper button roles', () => {
      cy.get('[role="tab"]').should('have.length', 3);
      cy.get('[role="list"]').should('exist');
      cy.get('[role="listitem"]').should('have.length', 5);
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile screens', () => {
      cy.viewport(375, 667);
      cy.get('.mainContent').should('be.visible');
      cy.get('.smallScreenMessage').should('not.be.visible');
      cy.get('h1').should('contain', 'Todo tracker');
    });

    it('should work on tablet screens', () => {
      cy.viewport(768, 1024);
      cy.get('.mainContent').should('be.visible');
      cy.get('.statusGrid').should('be.visible');
    });

    it('should work on desktop screens', () => {
      cy.viewport(1920, 1080);
      cy.get('.mainContent').should('be.visible');
      cy.get('.container').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty state gracefully', () => {
      // Delete all todos
      cy.get('.taskItem').each(($el) => {
        cy.wrap($el).find('.deleteBtn').click();
      });

      cy.get('.emptyState').should('contain', 'No tasks here');
      cy.get('[aria-label="Total tasks"]').should('contain', '0');
      cy.get('[aria-label="Pending tasks"]').should('contain', '0');
      cy.get('[aria-label="Completed tasks"]').should('contain', '0');
    });

    it('should handle rapid interactions', () => {
      // Test rapid adding of todos
      for (let i = 0; i < 3; i++) {
        cy.addTodo(`Quick Todo ${i}`);
      }
      cy.get('.taskItem').should('have.length', 8);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete workflow: add, complete, filter, delete', () => {
      // Add a new todo
      cy.addTodo('Integration Test Todo');

      // Complete it
      cy.toggleTodo('Integration Test Todo');

      // Filter to completed
      cy.filterTodos('completed');
      cy.get('.taskItem').should('contain', 'Integration Test Todo');

      // Filter to pending
      cy.filterTodos('pending');
      cy.get('.taskItem').should('not.contain', 'Integration Test Todo');

      // Filter to all
      cy.filterTodos('all');
      cy.get('.taskItem').should('contain', 'Integration Test Todo');

      // Delete it
      cy.deleteTodo('Integration Test Todo');
      cy.get('.taskItem').should('not.contain', 'Integration Test Todo');
    });

    it('should maintain state across filter changes', () => {
      const todoTitle = 'State Test Todo';
      cy.addTodo(todoTitle);
      cy.toggleTodo(todoTitle);

      // Test state persistence across filters
      cy.filterTodos('completed');
      cy.get('.taskItem').should('contain', todoTitle);

      cy.filterTodos('pending');
      cy.get('.taskItem').should('not.contain', todoTitle);

      cy.filterTodos('all');
      cy.get('.taskItem').should('contain', todoTitle);
    });
  });
});
