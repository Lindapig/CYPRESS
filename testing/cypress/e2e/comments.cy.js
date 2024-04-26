describe("Comment Test", () => {
    beforeEach(() => {
      // Seed the database before each test
      // clear any existing data and set up the database with default test data
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      // Clear the database after each test to ensure no data persists
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("1.1 | Created new comment should be displayed at the top of the comments page", () => {
        // pre-defined commets for testing  
        const comments = [
          "Test Comment 1",
          "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
          "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
        ];
        // test sequence for registering a user, posting a comment, and validating its appearance
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Comment").click();
        cy.contains("Comment").click();
        cy.get("#commentTextInput").type(comments[0]);
        cy.contains("Post Comment").click();
        // verify each comment is displayed correctly and in the correct order
        cy.get("#commentText").each(($el, index) => {
          cy.contains(comments[index]);
        });
        // check for immediate posting feedback
        cy.contains("0 seconds ago");
      });
    
      it("1.2 | Comment is mandatory when creating a new comment", () => {
        // test to ensure comments cannot be posted empty
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Comment").click();
        cy.contains("Comment").click();
        cy.contains("Post Comment").click();
        // verify the error message for empty comment submission
        cy.contains("Comment text cannot be empty");
      });
});