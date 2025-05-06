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

    const jobSelector = '.MQUd2b';
    const jobElements = document.querySelectorAll(jobSelector);

    if (jobElements.length > 0) {
        console.log('Es wurden Stellenangebote gefunden!');
        console.log('Anzahl der Stellenangebote:', jobElements.length);
        jobElements.forEach((element, index) => {
            console.log('Stellenangebot ' + (index + 1) + ':', element);
        })
    } else {
        console.log('Keine Stellenangebote gefunden.');
    }
})();