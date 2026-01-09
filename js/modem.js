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

// Attach to all play buttons
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.btn-play');

    playButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Play modem sound
            const duration = playModemSound();

            // Add connecting text effect
            const originalText = this.textContent;
            this.textContent = '>>> CONNECTING... <<<';
            this.style.pointerEvents = 'none';

            // Navigate after sound
            setTimeout(function() {
                window.location.href = href;
            }, duration * 1000);
        });
    });
});
