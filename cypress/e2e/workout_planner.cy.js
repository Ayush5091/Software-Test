describe("FitBook - Workout Planner", () => {
  beforeEach(() => {
    cy.visit("/workout-planner");
  });

  it("should render the workout planner page controls", () => {
    cy.get("h1").should("contain.text", "Workout planner");
    cy.contains("Pick a goal and FitBook builds a weekly split").should("be.visible");
    cy.contains("label", "Goal").should("be.visible");
    cy.contains("label", "Days per week").should("be.visible");
    cy.contains("button", "Generate plan").should("be.visible");
  });

  it("should generate a recommended workout split using the API", () => {
    cy.intercept("POST", "/api/workouts/recommend").as("getPlan");

    // Select goal and days
    cy.get("select").first().select("build_muscle");
    cy.get("select").last().select("4");

    // Click Generate plan
    cy.contains("button", "Generate plan").click();

    cy.wait("@getPlan");

    // Verify weekly split section renders
    cy.contains("h2", /Your \d-day .* split/i).should("be.visible");
    cy.contains("DAY 1").should("be.visible");
    cy.contains("DAY 2").should("be.visible");
  });

  it("should expand and collapse exercise form steps", () => {
    // Scroll to the exercise library
    cy.contains("h2", "Full exercise library").scrollIntoView();

    // Find the first "Show steps" button and click it
    cy.contains("button", "Show steps").first().as("toggleBtn");
    cy.get("@toggleBtn").click();

    // Button text should change to "Hide steps" and steps list should appear
    cy.contains("button", "Hide steps").should("be.visible");
    cy.get("ol").first().should("be.visible");

    // Click "Hide steps" to collapse
    cy.contains("button", "Hide steps").first().click();
    cy.contains("button", "Show steps").should("be.visible");
  });

  it("should display the full exercise library with exercises", () => {
    cy.contains("h2", "Full exercise library").should("be.visible");
    cy.contains("Bodyweight Squat").should("be.visible");
    cy.contains("Push-Up").should("be.visible");
    cy.contains("Plank Hold").should("be.visible");
    cy.contains("Forward Lunge").should("be.visible");
  });
});
