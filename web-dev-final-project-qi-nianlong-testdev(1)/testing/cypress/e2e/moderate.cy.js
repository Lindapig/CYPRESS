describe("Moderate Test", () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
      });
    
      afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      });

    it('1.1 | allows a user to moderate his/her question', () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();

        cy.contains("Test Question A").click();
        cy.contains("Modify Question").click();
        cy.get("#formTitleInput").clear();
        cy.get("#formTitleInput").type("Test Question B");
        cy.get("#formTextInput").clear();
        cy.get("#formTextInput").type("Test Question B Text");
        cy.contains("Change Question").click();
        
        cy.get(".postTitle").should("contain","Test Question B");
    });
});