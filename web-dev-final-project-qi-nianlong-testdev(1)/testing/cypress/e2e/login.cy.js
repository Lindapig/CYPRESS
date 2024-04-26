describe("Login Test", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

    it('1.1 | allows a user to register', () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.get(".error").should("contain", "Successfully registered, please login.");
    });
  
    it('1.2 | prevents registration with existing username', () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.")
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        
        cy.get(".error").should("contain","User already exists, please login.");

    });
  
    it('2.1 | allows a user to login', () => {
      cy.visit("http://localhost:3000");
      cy.get("button").contains("Register").click();
      cy.get("#username").type("elephantCDE");
      cy.get("#password").type("123456");
      cy.get("button").contains("Register").click();
      cy.contains("Successfully registered, please login.");
      cy.get("button").contains("Login").click();

      cy.get("#welcome").should("contain","Welcome, elephantCDE");
    });
  
    it('2.2 | prevents login with wrong credentials', () => {
      cy.visit("http://localhost:3000");
      cy.get("button").contains("Register").click();
      cy.get("#username").type("elephantCDE");
      cy.get("#password").type("123456");
      cy.get("button").contains("Register").click();
      cy.contains("Successfully registered, please login.");
      cy.get("#username").type("F");
      cy.get("button").contains("Login").click();
      cy.get(".error").should("contain","Invalid username or password");
    });
  
    it('2.3 | allows switching from login to register form', () => {
      cy.visit("http://localhost:3000");
      cy.contains('Register').click();
      cy.get('h1').should('contain', 'Register');
    });
  
    it('2.4 | allows switching from register to login form', () => {
      cy.visit("http://localhost:3000");
      cy.contains('Register').click();
      cy.contains('Back to Login').click();
      cy.get('h1').should('contain', 'Login');
    });
});
