
(function() {
    'use strict';
    

    if (window.EmailJSInitialized) {
        return;
    }
    

    function initializeEmailJS() {
        if (typeof emailjs !== 'undefined' && !window.EmailJSInitialized) {
            try {
                emailjs.init('C697doILWoQENFK6H');
                window.EmailJSInitialized = true;
                console.log('EmailJS initialized successfully');
            } catch (error) {
                console.error('Error initializing EmailJS:', error);
            }
        }
    }
    

    if (typeof emailjs !== 'undefined') {
        initializeEmailJS();
    } else {

        document.addEventListener('DOMContentLoaded', function() {

            const checkEmailJS = setInterval(function() {
                if (typeof emailjs !== 'undefined') {
                    initializeEmailJS();
                    clearInterval(checkEmailJS);
                }
            }, 100);
            

            setTimeout(function() {
                clearInterval(checkEmailJS);
            }, 10000);
        });
    }
})();