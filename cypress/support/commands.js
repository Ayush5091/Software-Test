// Custom commands for FitBook Cypress testing

// Command to fill and submit login form via UI
Cypress.Commands.add("loginViaUI", (email, password) => {
  cy.visit("/login");
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
});

// Command to fill and submit registration form via UI
Cypress.Commands.add("registerViaUI", ({ name, email, password, goal = "general_fitness" }) => {
  cy.visit("/register");
  cy.contains("label", "Full name").parent().find("input").clear().type(name);
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password);
  if (goal) {
    cy.get("select").select(goal);
  }
  cy.get('button[type="submit"]').click();
});

// Command to set authenticated session cookie directly
Cypress.Commands.add("setAuthSession", (userOverrides = {}) => {
  const payload = {
    id: "user-test-id",
    role: "member",
    name: "Alex Mercer",
    email: "alex@fitbook.com",
    ...userOverrides,
  };
  cy.task("generateToken", payload).then((token) => {
    cy.setCookie("fitbook_token", token);
  });
});
