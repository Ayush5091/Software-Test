describe("FitBook - Navigation & Layout", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have a functional header with brand logo", () => {
    cy.get("header").should("be.visible");
    cy.get("header a").first().should("have.attr", "href", "/").and("contain.text", "FitBook");
  });

  it("should display guest authentication buttons when logged out", () => {
    cy.get("header").within(() => {
      cy.contains("a", "Log in").should("be.visible").and("have.attr", "href", "/login");
      cy.contains("a", "Join now").should("be.visible").and("have.attr", "href", "/register");
    });
  });

  it("should render footer properly", () => {
    cy.get("footer").should("be.visible");
    cy.get("footer").contains("FitBook").should("be.visible");
  });

  it("should adapt to mobile viewport layout", () => {
    cy.viewport("iphone-x");
    cy.visit("/");
    cy.get("header").should("be.visible");
    cy.get("header").contains("FitBook").should("be.visible");
    // Verify desktop-specific nav elements stay hidden or responsive
    cy.get("header nav.hidden.md\\:flex").should("not.be.visible");
  });
});
