// ==UserScript==
// @name         Google Job Filter
// @namespace    https://github.com/erik-io
// @version      0.1
// @description  Markiert und filtert Stellenangebote
// @author       erik-io
// @match        https://www.google.de/search*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

function getPostAge(dateText) {
    // Wenn das Datum nicht gefunden wird, geben wir Infinity zurück
    if (dateText === 'Datum nicht gefunden' || !dateText) {
        return Infinity; // Oder eine andere große Zahl
    }

    dateText.toLowerCase(); // Um "Vor" und "vor" gleich zu behandeln

    const daysMatch = dateText.match(/vor\s+(\d+)\s+tag/); // Sucht nach "vor X Tag(en)"
    if (daysMatch) {
        // daysMatch[1] enthält die Zahl, die durch den regulären Ausdruck extrahiert wurde
        // parseInt(..., 10) wandelt diesen String in eine Ganzzahl im Dezimalsystem um (Radix 10).
        return parseInt(daysMatch[1], 10);
    }
}

// Immediately Invoked Function Expression (IIFE)
(function() {
    'use strict';

    console.log('Google Job Filter ist aktiv!');

    const jobSelector = '.EimVGf';
    const jobElements = document.querySelectorAll(jobSelector);

    if (jobElements.length > 0) {
        console.log(`Es wurden ${jobElements.length} Stellenangebote mit dem "${jobSelector}"-Selektor gefunden!`);

        jobElements.forEach((jobElement, index) => {
            jobElement.style.border = '2px solid red'; // Behalten wir zum Testen erstmal bei

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

            // --- NEU: Alter prüfen und hervorheben ---
            const postAge = getPostAge(dateText);

            if (postAge < 7) { // Jünger als 7 Tage
                jobElement.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                jobElement.style.borderLeft = '5px solid gold';
                console.log(`   -> Hervorgehoben! Alter: ${postAge} Tag(e)`);
            }
            // --- Ende NEU ---
        })
    } else {
        console.log(`Keine Stellenangebote mit dem Selektor "${jobSelector} auf dieser Seite gefunden.`);
    }
})();