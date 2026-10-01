describe("FitBook - Authentication & Route Protection", () => {
  describe("Login Page", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should render the login form correctly", () => {
      cy.get("h1").should("contain.text", "Log in");
      cy.get('input[type="email"]').should("be.visible").and("have.attr", "required");
      cy.get('input[type="password"]').should("be.visible").and("have.attr", "required");
      cy.get('button[type="submit"]').should("contain.text", "Log in");
      cy.contains("a", "Create an account").should("have.attr", "href", "/register");
    });

    it("should display error message on failed login attempt", () => {
      cy.intercept("POST", "/api/auth/login", {
        statusCode: 401,
        body: { error: "Invalid email or password." },
      }).as("failedLogin");

      cy.get('input[type="email"]').type("unknown@fitbook.com");
      cy.get('input[type="password"]').type("WrongPassword123");
      cy.get('button[type="submit"]').click();

      cy.wait("@failedLogin").its("request.body").should("deep.equal", {
        email: "unknown@fitbook.com",
        password: "WrongPassword123",
      });

      cy.contains("Invalid email or password.").should("be.visible");
    });

    it("should handle network failure gracefully", () => {
      cy.intercept("POST", "/api/auth/login", { forceNetworkError: true }).as("networkFail");

      cy.get('input[type="email"]').type("user@fitbook.com");
      cy.get('input[type="password"]').type("Password123!");
      cy.get('button[type="submit"]').click();

      cy.wait("@networkFail");
      cy.contains("Network error. Please try again.").should("be.visible");
    });

    it("should navigate to register page when clicking 'Create an account'", () => {
      cy.contains("a", "Create an account").click();
      cy.url().should("include", "/register");
    });
  });

  describe("Register Page", () => {
    beforeEach(() => {
      cy.visit("/register");
    });

    it("should render the registration form with all required inputs", () => {
      cy.get("h1").should("contain.text", "Create your account");
      cy.contains("label", "Full name").parent().find("input").should("be.visible").and("have.attr", "required");
      cy.get('input[type="email"]').should("be.visible").and("have.attr", "required");
      cy.get('input[type="password"]').should("be.visible").and("have.attr", "required");
      cy.get("select").should("be.visible");
      cy.get("select option").should("have.length", 4);
      cy.get('button[type="submit"]').should("contain.text", "Create account");
    });

    it("should display error when registration fails", () => {
      cy.intercept("POST", "/api/auth/register", {
        statusCode: 400,
        body: { error: "An account with this email already exists." },
      }).as("failedRegister");

      cy.contains("label", "Full name").parent().find("input").type("Duplicate User");
      cy.get('input[type="email"]').type("existing@fitbook.com");
      cy.get('input[type="password"]').type("ValidPass123");
      cy.get('button[type="submit"]').click();

      cy.wait("@failedRegister").its("request.body").should("include", {
        email: "existing@fitbook.com",
        name: "Duplicate User",
      });

      cy.contains("An account with this email already exists.").should("be.visible");
    });

    it("should send chosen goal on registration", () => {
      cy.intercept("POST", "/api/auth/register", {
        statusCode: 400,
        body: { error: "Sample check" },
      }).as("registerCall");

      cy.contains("label", "Full name").parent().find("input").type("Alex Fit");
      cy.get('input[type="email"]').type("alexfit@fitbook.com");
      cy.get('input[type="password"]').type("Secret1234");
      cy.get("select").select("build_muscle");
      cy.get('button[type="submit"]').click();

      cy.wait("@registerCall").its("request.body").should("deep.include", {
        goal: "build_muscle",
        email: "alexfit@fitbook.com",
      });
    });

    it("should navigate to login page when clicking 'Log in'", () => {
      cy.contains("a", "Log in").click();
      cy.url().should("include", "/login");
    });
  });

  describe("Protected Route Middleware", () => {
    it("should redirect unauthenticated visitor from /dashboard to login with next param", () => {
      cy.clearCookies();
      cy.visit("/dashboard");
      cy.url().should("include", "/login?next=%2Fdashboard");
    });

    it("should redirect unauthenticated visitor from /bookings to login with next param", () => {
      cy.clearCookies();
      cy.visit("/bookings");
      cy.url().should("include", "/login?next=%2Fbookings");
    });

    it("should redirect unauthenticated visitor from /admin/users to login with next param", () => {
      cy.clearCookies();
      cy.visit("/admin/users");
      cy.url().should("include", "/login?next=%2Fadmin%2Fusers");
    });
  });
});
