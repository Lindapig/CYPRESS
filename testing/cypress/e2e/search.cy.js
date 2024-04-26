describe("Search Test", () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
      });
    
      afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      });

    // test case for searching text content that does not exist
      it("1.1 | Search for a question using text content that does not exist", () => {
        // define a search term that is expected to yield no results
        const searchText = "Web3";
    
        // register a new user
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        // perform a search and expect no results
        cy.get("#searchBar").type(`${searchText}{enter}`);
        // check that no posts are returned
        cy.get(".postTitle").should("have.length", 0);
      });
    
      // test case for confirming search capability by question text
      it("1.2 | Search string in question text", () => {
        // expected titles to appear in search results
        const qTitles = ["Object storage for a web application"];

        // register and search using a specific query
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        // perform a searcch using a text snippet
        cy.get("#searchBar").type("40 million{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          // verify each result title contains expected text
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      // similar test cases are structured for different search scenarios and tags
      // each test case follows the same pattern: set up, search, and verify results
      it("1.3 | earch string in question text", () => {
        const qTitles = ["Quick question about storage on android"];
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        cy.get("#searchBar").type("data remains{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("2.1 | Search a question by tag (t1)", () => {
        const qTitles = ["Programmatically navigate using React router"];
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        cy.get("#searchBar").type("[react]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("2.2 | Search a question by tag (t2)", () => {
        const qTitles = [
          "android studio save string shared preference, start activity and load the saved string",
          "Programmatically navigate using React router",
        ];
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        cy.get("#searchBar").type("[javascript]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("2.3 | Search a question by tag (t3)", () => {
        const qTitles = [
          "Quick question about storage on android",
          "android studio save string shared preference, start activity and load the saved string",
        ];
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        cy.get("#searchBar").type("[android-studio]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("2.4 | Search a question by tag (t4)", () => {
        const qTitles = [
          "Quick question about storage on android",
          "android studio save string shared preference, start activity and load the saved string",
        ];
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        cy.get("#searchBar").type("[shared-preferences]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("2.5 | Search for a question using a tag that does not exist", () => {
        cy.visit("http://localhost:3000");
        cy.get("button").contains("Register").click();
        cy.get("#username").type("elephantCDE");
        cy.get("#password").type("123456");
        cy.get("button").contains("Register").click();
        cy.contains("Successfully registered, please login.");
        cy.get("button").contains("Login").click();

        cy.get("#searchBar").type("[nonExistentTag]{enter}");
        cy.get(".postTitle").should("have.length", 0);
      });
});