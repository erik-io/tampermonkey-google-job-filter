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

(function() {
    'use strict';

    console.log('Google Job Filter ist aktiv!');

    const jobSelector = '.EimVGf';
    const jobElements = document.querySelectorAll(jobSelector);

    if (jobElements.length > 0) {
        console.log(`Es wurden ${jobElements.length} Stellenangebote mit dem "${jobSelector}"-Selektor gefunden!`);

        jobElements.forEach((jobElement, index) => {
            jobElement.style.border = '2px solid red'; // Behalten wir zum Testen erstmal bei

            // --- NEU: Informationen extrahieren ---
            const dateSelector = '.Yf9oye';
            const companySelector = '.a3jPc';

            const dateElement = jobElement.querySelector(dateSelector);
            const companyElement = jobElement.querySelector(companySelector);

            let dateText = 'Datum nicht gefunden';
            if (dateElement) {
                dateText = dateElement.innerText;
            }

            let companyText = 'Unternehmen nicht gefunden';
            if (companyElement) {
                companyText = companyElement.innerText;
            }

            console.log(`Stellenangebot ${index + 1}: Firma: "${companyText}", Datum: "${dateText}"`);
            // --- ENDE NEU ---
        })
    } else {
        console.log(`Keine Stellenangebote mit dem Selektor "${jobSelector} auf dieser Seite gefunden.`);
    }
})();