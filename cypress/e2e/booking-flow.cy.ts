/// <reference types="cypress" />

/**
 * Happy-path E2E teszt: registráció → login után automatikus → szolgáltatás
 * kiválasztása → foglalás → megjelenés a profilon.
 *
 * Előfeltétel: a json-server-auth fut a 3000-es porton (npm run server),
 *              és az Angular dev server a 4200-on (npm start).
 */

describe('Booking happy-path flow', () => {
  // Egyedi email minden futáshoz, hogy ne ütközzön a meglévő userekkel
  const uniqueEmail = `e2e_${Date.now()}@test.hu`;
  const password = 'Password123!';

  it('registers, books an appointment, and sees it in the profile', () => {
    // 1. Regisztráció
    cy.visit('/register');
    cy.get('[data-cy=reg-fullname]').type('E2E Tester');
    cy.get('[data-cy=reg-email]').type(uniqueEmail);
    cy.get('[data-cy=reg-phone]').type('+36301234567');
    cy.get('[data-cy=reg-password]').type(password);
    cy.get('[data-cy=reg-password-confirm]').type(password);
    cy.get('[data-cy=reg-submit]').click();

    // Sikeres regisztráció után automatikus login + átirányítás kezdőlapra
    cy.url().should('match', /\/$/);
    cy.get('[data-cy=nav-user]').should('be.visible');

    // 2. Szolgáltatások oldal — válasszunk egy szolgáltatást
    cy.contains('Szolgáltatások').click();
    cy.url().should('include', '/services');
    cy.contains('Kiválasztom').first().click();

    // 3. Foglalás form
    cy.url().should('include', '/booking');
    // A user adatait előtöltöttük; csak a dátum kell
    const future = new Date(Date.now() + 7 * 86400000);
    const iso = future.toISOString().slice(0, 16); // yyyy-mm-ddThh:mm
    cy.get('input[formControlName="appointmentDate"]').type(iso);
    cy.get('button[type=submit]').click();

    // 4. Profil → ott van a foglalás
    cy.url().should('include', '/profile');
    cy.contains('Közelgő foglalások');
    cy.get('.appointment').should('have.length.at.least', 1);
  });
});
