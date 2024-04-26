describe("Login Test", () => {
  beforeEach(() => {
    // Seed the database before each test to ensure a consistent starting point
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

    it('1.1 | allows a user to register', () => {
      // test the registration process for a new user
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        // check for a successful registration message
        cy.get(".error").should("contain", "Successfully registered, please login.");
    });
  
    it('1.2 | prevents registration with existing username', () => {
      // verify that the system prevents duplicate username registrations
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.")
        // simulate attempting to register with the same username again
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        // expect an error indicating the username is already taken
        cy.get(".error").should("contain","User already exists, please login.");

    });
  
    // test the login functionality after registering a user
    it('2.1 | allows a user to login', () => {
      cy.visit("http://localhost:3000");
      cy.get("button").contains("Register").click();
      cy.get("#username").type("elephantCDE");
      cy.get("#password").type("123456");
      cy.get("button").contains("Register").click();
      cy.contains("Successfully registered, please login.");
      cy.get("button").contains("Login").click();
      // verify the welcome message post-login
      cy.get("#welcome").should("contain","Welcome, elephantCDE");
    });
  
    it('2.2 | prevents login with wrong credentials', () => {
      // ensure the incorrect login credentials do not allow user login
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
  
    // test the UI switch from the login to the registration form
    it('2.3 | allows switching from login to register form', () => {
      cy.visit("http://localhost:3000");
      cy.contains('Register').click();
      cy.get('h1').should('contain', 'Register');
    });
  
    // test the UI switch back from the registration to the lgoin form
    it('2.4 | allows switching from register to login form', () => {
      cy.visit("http://localhost:3000");
      cy.contains('Register').click();
      cy.contains('Back to Login').click();
      cy.get('h1').should('contain', 'Login');
    });
});
