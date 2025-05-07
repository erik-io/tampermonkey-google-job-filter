// ==UserScript==
// @name         Google Job Filter
// @namespace    https://github.com/erik-io
// @version      0.2
// @description  Markiert und filtert Stellenangebote
// @author       erik-io
// @match        https://www.google.de/search*udm=8*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

console.log('--- GJF SCRIPT v0.2-test1 --- ' + new Date().toLocaleTimeString() + ' ---');

// --- Konfiguration ---
const HIDDEN_COMPANIES_KEY = 'googleJobFilter_hiddenCompanies';

// --- Hilfsfunktionen ---
function getHiddenCompanies() {
    return JSON.parse(GM_getValue(HIDDEN_COMPANIES_KEY, '[]'));
}

// --- NEU: Funktion zum Hinzufügen von Unternehmen zur Liste ---
function addCompanyToHiddenList(companyName) {
    const companyNameLower = companyName.toLowerCase(); // Für Speicherung und Vergleich normalisieren
    let hiddenCompanies = getHiddenCompanies(); // Holt die aktuelle Liste

    if (hiddenCompanies.includes(companyNameLower)) {
        console.log(`Firma "${companyName}" ist bereits auf der Liste.`);
        return false; // Firma ist bereits auf der Liste
    } else {
        hiddenCompanies.push(companyNameLower); // Zum Array hinzufügen
        GM_setValue(HIDDEN_COMPANIES_KEY, JSON.stringify(hiddenCompanies)); // Aktualisierte Liste speichern
        console.log(`Firma "${companyName}" wurde zur Liste hinzugefügt.`);
        return true; // Firma wurde erfolgreich hinzugefügt
    }
}
// --- Ende NEU ---

function getPostAge(dateText) {
    // Wenn das Datum nicht gefunden wird, geben wir Infinity zurück
    if (dateText === 'Datum nicht gefunden' || !dateText) {
        return Infinity; // Oder eine andere große Zahl
    }

    dateText = dateText.toLowerCase(); // Um "Vor" und "vor" gleich zu behandeln

    const daysMatch = dateText.match(/vor\s+(\d+)\s+tag/); // Sucht nach "vor X Tag(en)"
    if (daysMatch) {
        // daysMatch[1] enthält die Zahl, die durch den regulären Ausdruck extrahiert wurde
        // parseInt(..., 10) wandelt diesen String in eine Ganzzahl im Dezimalsystem um (Radix 10).
        return parseInt(daysMatch[1], 10);
    }

    return Infinity; // Wenn kein passendes Datum gefunden wird, geben wir Infinity zurück
}

// Immediately Invoked Function Expression (IIFE)
(function() {
    'use strict';

    console.log('Google Job Filter ist aktiv!');

    const testListe = getHiddenCompanies();
    console.log('Aktuelle Liste der versteckten Unternehmen:', testListe);

    const jobSelector = '.EimVGf';
    const jobElements = document.querySelectorAll(jobSelector);

    if (jobElements.length > 0) {
        console.log(`Es wurden ${jobElements.length} Stellenangebote mit dem "${jobSelector}"-Selektor gefunden!`);

        jobElements.forEach((jobElement, index) => {
            const dateSelector = '.Yf9oye[aria-label^="Gepostet:"]'; // Selector für das Datum mit dem Attribut "aria-label" das mit "Gepostet:" beginnt
            const companySelector = '.a3jPc'; // Selector für den Firmennamen

            const dateElement = jobElement.querySelector(dateSelector); // querySelector für das Datum statt querySelectorAll
            const companyElement = jobElement.querySelector(companySelector); // querySelector für den Firmennamen statt querySelectorAll

            // Falls das Datum nicht gefunden wird, setzen wir den Text auf "Datum nicht gefunden"
            let dateText = 'Datum nicht gefunden';
            if (dateElement) {
                dateText = dateElement.innerText;
            }

            // Falls die Firma nicht gefunden wird, setzen wir den Text auf "Unternehmen nicht gefunden"
            let companyText = 'Unternehmen nicht gefunden';
            if (companyElement) {
                companyText = companyElement.innerText;
            }

            // Stellenangebot X: Firma: "Unternehmen", Datum: "Datum"
            console.log(`Stellenangebot ${index + 1}: Firma: "${companyText}", Datum: "${dateText}"`);

            const postAge = getPostAge(dateText);

            if (postAge < 7) { // Jünger als 7 Tage
                jobElement.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
                jobElement.style.borderLeft = '5px solid gold';
                console.log(`   -> Hervorgehoben! Alter: ${postAge} Tag(e)`);
            }
        })
    } else {
        console.log(`Keine Stellenangebote mit dem Selektor "${jobSelector}" auf dieser Seite gefunden.`);
    }
})();