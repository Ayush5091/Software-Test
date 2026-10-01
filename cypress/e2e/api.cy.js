describe("FitBook - Backend API Endpoints (Cypress cy.request)", () => {
  it("POST /api/workouts/recommend - returns recommended schedule", () => {
    cy.request({
      method: "POST",
      url: "/api/workouts/recommend",
      body: {
        goal: "build_muscle",
        daysPerWeek: 4,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("plan");
      expect(response.body.plan).to.have.property("goal", "build_muscle");
      expect(response.body.plan).to.have.property("daysPerWeek", 4);
      expect(response.body.plan.days).to.be.an("array").with.lengthOf(4);
      expect(response.body.plan.days[0]).to.have.property("day");
      expect(response.body.plan.days[0]).to.have.property("exercises");
    });
  });

  it("POST /api/workouts/recommend - handles default fallback", () => {
    cy.request({
      method: "POST",
      url: "/api/workouts/recommend",
      body: {},
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.plan.goal).to.eq("general_fitness");
      expect(response.body.plan.daysPerWeek).to.eq(3);
      expect(response.body.plan.days).to.be.an("array").with.lengthOf(3);
    });
  });

  it("POST /api/auth/login - rejects request with missing fields", () => {
    cy.request({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "missing-pass@example.com",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 401, 500]);
    });
  });
});
