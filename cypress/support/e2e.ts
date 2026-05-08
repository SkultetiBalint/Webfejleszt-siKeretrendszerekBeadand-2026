// cypress/support/e2e.ts
// Globális Cypress konfiguráció és segédfüggvények.
// Itt is fel lehetne venni custom command-okat (pl. cy.login(...)).

beforeEach(() => {
  // Tisztítjuk az auth állapotot, hogy minden teszt szűz lapról induljon
  cy.window().then(win => win.localStorage.clear());
});
