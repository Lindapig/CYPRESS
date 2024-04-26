describe("Answer Test", () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
      });
    
      afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      });

    it("1.1 | Created new answer should be displayed at the top of the answers page", () => {
      // pre defined answers for testing answer posting functionality  
      const answers = [
          "Test Answer 1",
          "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
          "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
        ];
        // simulate the entire flow of posting an answer to a question
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type(answers[0]);
        cy.contains("Post Answer").click();
        // chech each posted answer to verify correct order and display
        cy.get(".answerText").each(($el, index) => {
          cy.contains(answers[index]);
        });
        // ensure the answer appears immediately after posting
        cy.contains("0 seconds ago");
      });
    
      it("1.2 | Answer is mandatory when creating a new answer", () => {
        // test to ensure that answers cannot be posted without content
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.contains("Post Answer").click();
        // check for the mandatory field validation message
        cy.contains("Answer text cannot be empty");
      });
});