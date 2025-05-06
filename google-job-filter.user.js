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

        jobElements.forEach((element, index) => {
            console.log('Stellenangebot ' + (index + 1) + ':', element);

            // --- HIER STARTEN WIR MIT MANIPULATIONEN ---
            // Als ersten Test: Lass uns jedem gefundenen Job einen roten Rahmen geben
            // Damit sehen wir direkt auf der Seite, welche Elemente wir erwischt haben.
            element.style.border = '2px solid red';
        })
    } else {
        console.log(`Keine Stellenangebote mit dem Selektor "${jobSelector} auf dieser Seite gefunden.`);
    }
})();