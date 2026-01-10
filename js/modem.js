// Modem dial-up sound effect for Play buttons
// Uses real modem dial-up MP3

let modemAudio = null;

function playModemSound() {
    // Create audio element if not exists
    if (!modemAudio) {
        modemAudio = new Audio('js/dialup.mp3');
        modemAudio.volume = 0.5;
    }

    // Reset and play
    modemAudio.currentTime = 0;
    modemAudio.play();

    // Return duration for navigation delay (use 2 seconds for effect)
    return 2;
}

// Reset all play buttons to their original state
function resetPlayButtons() {
    const playButtons = document.querySelectorAll('.btn-play');
    playButtons.forEach(function(btn) {
        const originalText = btn.getAttribute('data-original-text');
        if (originalText) {
            btn.textContent = originalText;
            btn.style.pointerEvents = 'auto';
        }
    });
}

// Attach to all play buttons
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.btn-play');

    playButtons.forEach(function(btn) {
        // Store original text for reset
        btn.setAttribute('data-original-text', btn.textContent);

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Play modem sound
            const duration = playModemSound();

            // Add connecting text effect
            this.textContent = '>>> CONNECTING... <<<';
            this.style.pointerEvents = 'none';

            // Navigate after sound
            setTimeout(function() {
                window.location.href = href;
            }, duration * 1000);
        });
    });
});

// Reset buttons when page becomes visible again (e.g., user pressed back)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        resetPlayButtons();
    }
});

// Also reset on pageshow event (handles bfcache)
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        resetPlayButtons();
    }
});
