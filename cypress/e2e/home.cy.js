describe("FitBook - Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should render the landing page hero header and subheader", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Train with intent.");
    cy.contains("span", "Book, track, repeat.").should("be.visible");
    cy.contains("FitBook replaces the front-desk clipboard").should("be.visible");
  });

  it("should display the 'Today at a glance' schedule section", () => {
    cy.contains("TODAY AT A GLANCE").should("be.visible");
    cy.contains("07:00").should("be.visible");
    cy.contains("HIIT with Marcus").should("be.visible");
    cy.contains("Strength coaching — Ariana").should("be.visible");
  });

  it("should display the StatTicker with metrics", () => {
    cy.contains(/active members/i).should("be.visible");
    cy.contains(/sessions booked today/i).should("be.visible");
    cy.contains(/trainers online/i).should("be.visible");
  });

  it("should display all core feature cards", () => {
    cy.contains("h2", "Everything the gym needs").should("be.visible");
    cy.contains("Book sessions & trainers").should("be.visible");
    cy.contains("AI workout planner").should("be.visible");
    cy.contains("QR check-in").should("be.visible");
    cy.contains("Progress dashboard").should("be.visible");
    cy.contains("Built for three roles").should("be.visible");
    cy.contains("Membership plans").should("be.visible");
  });

  it("should navigate to register page when clicking 'Start your membership'", () => {
    cy.contains("a", "Start your membership").click();
    cy.url().should("include", "/register");
    cy.get("h1").should("contain.text", "Create your account");
  });

  it("should navigate to workout planner when clicking 'Try the AI planner'", () => {
    cy.contains("a", "Try the AI planner").click();
    cy.url().should("include", "/workout-planner");
    cy.get("h1").should("contain.text", "Workout planner");
  });
});
