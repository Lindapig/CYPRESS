// additional test cases follow a similar structure:
// each test navigates to the application, performs registration and login, and then tests specific tag-related functionalities
// test cases check functionality such as navigating to specific tags and verifying associated questions

describe("Tag Test", () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
      });
    
      afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      });

    // test for adding and verifying tags on a new question
      it("1.1 | Adds a question with tags, checks the tags existied", () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

    
        // add a question with multiple tags
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1 test2 test3");
        cy.contains("Post Question").click();
    
        // check if tags are correctly displayed on the tags page
        cy.contains("Tags").click();
        cy.contains("test1");
        cy.contains("test2");
        cy.contains("test3");
      });
    
      // test to verify all pre defined tags are present
      it("1.2 | Checks if all tags exist", () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        // all tags exist in the page
        cy.contains("Tags").click();
        cy.contains("react", { matchCase: false });
        cy.contains("javascript", { matchCase: false });
        cy.contains("android-studio", { matchCase: false });
        cy.contains("shared-preferences", { matchCase: false });
        cy.contains("storage", { matchCase: false });
        cy.contains("website", { matchCase: false });
        cy.contains("Flutter", { matchCase: false });
      });
    
      it("1.3 | Checks if all questions exist inside tags", () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("7 Tags");
        cy.contains("1 question");
        cy.contains("2 question");
        cy.contains("0 question");
      });
    
      it("2.1 | go to question in tag react", () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("react").click();
        cy.contains("Programmatically navigate using React router");
      });
    
      it("2.2 | go to questions in tag storage", () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("storage").click();
        cy.contains("Quick question about storage on android");
        cy.contains("Object storage for a web application");
      });
    
      it("2.3 | create a new question with a new tag and finds the question through tag", () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

    
        // add a question with tags
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1-tag1");
        cy.contains("Post Question").click();
    
        // clicks tags
        cy.contains("Tags").click();
        cy.contains("test1-tag1").click();
        cy.contains("Test Question A");
      });

      it("3.1 | Clicks on a tag and verifies the tag is displayed", () => {
        const tagNames = "javascript";
    
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();
        cy.contains("Tags").click();
    
        cy.contains(tagNames).click();
        cy.get(".question_tags").each(($el, index, $list) => {
          cy.wrap($el).should("contain", tagNames);
        });
      });
    
      it("3.2 | Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
        const tagNames = "storage";
    
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();
    
        //clicks the 3rd tag associated with the question.
        cy.get(".question_tag_button").eq(2).click();
    
        cy.get(".question_tags").each(($el, index, $list) => {
          cy.wrap($el).should("contain", tagNames);
        });
      });
});