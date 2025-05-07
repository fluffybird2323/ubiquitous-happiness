document.addEventListener('DOMContentLoaded', () => {
    const lines = document.querySelectorAll('.line:not(.visible)'); // Select only initially hidden lines
    const firstLine = document.querySelector('.line.visible'); // The first line
    const lastLine = document.querySelector('.line.final');
    const responseButtons = document.querySelector('.response-buttons');
    const scrollCue = document.querySelector('.scroll-cue');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const backgroundShapes = document.querySelectorAll('.shape'); // Get background shapes

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.8; // 80% from bottom of viewport
        const scrollY = window.scrollY;

        // Move background shapes (parallax effect)
        backgroundShapes.forEach((shape, index) => {
            // Adjust speed factor per shape (slower for elements further "back")
            const speedFactor = (index + 2) * 0.1;
            const moveY = scrollY * speedFactor;
            shape.style.transform = `translateY(${moveY}px)`;
        });

        // Reveal subsequent lines
        lines.forEach((line) => {
            const lineTop = line.getBoundingClientRect().top;
            if (lineTop < triggerBottom) {
                line.classList.add('visible');
            }
        });

        // Check if the last line is visible to show buttons
        if (lastLine.classList.contains('visible')) {
            responseButtons.classList.add('visible');
            scrollCue.style.display = 'none'; // Hide scroll cue
        } else {
            // Ensure buttons and cue are hidden if user scrolls back up
            responseButtons.classList.remove('visible');
            if (firstLine.classList.contains('visible')) { // Show cue only if first line is visible
                 scrollCue.style.display = 'block';
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    // Initial check for buttons/cue state in case the page loads scrolled

    // --- Heart Animation --- 
    const playHeartsAnimation = () => {
        const container = document.body; // Add hearts to the whole page
        const heartCount = 15;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            // Random horizontal position and animation delay/duration
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 1 + 1) + 's'; // 1-2 seconds
            heart.style.animationDelay = Math.random() * 0.5 + 's'; // 0-0.5 seconds delay
            container.appendChild(heart);

            // Remove heart after animation finishes to clean up DOM
            heart.addEventListener('animationend', () => {
                heart.remove();
            });
        }
    };
    // --- End Heart Animation ---

    // --- Google Sheets API Integration Placeholder --- 
    const sendResponseToSheet = async (response) => {
        console.log(`Sending response: ${response}`);
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzA1XPo_Fi9wGPoGyoi77s1BQ1XimrJFWHahixhhDOp3co8p8lCFIFYnG34UEoyhNTB9Q/exec';

        try {
            // Create a form element
            const form = document.createElement('form');
            form.method = 'GET';
            form.action = scriptURL;
            form.target = 'responseFrame'; // Target the iframe

            // Add response parameter
            const responseInput = document.createElement('input');
            responseInput.type = 'hidden';
            responseInput.name = 'response';
            responseInput.value = response;
            form.appendChild(responseInput);

            // Add timestamp parameter
            const timestampInput = document.createElement('input');
            timestampInput.type = 'hidden';
            timestampInput.name = 'timestamp';
            timestampInput.value = new Date().toISOString();
            form.appendChild(timestampInput);

            // Add form to document and submit
            document.body.appendChild(form);
            form.submit();
            
            // Remove form after submission
            setTimeout(() => {
                document.body.removeChild(form);
            }, 1000);

            console.log('Request sent successfully');
        } catch (error) {
            console.error('Error!', error.message);
            alert('エラーが発生しました。もう一度お試しください。');
        }
    };

    yesButton.addEventListener('click', async () => { // Make async
        yesButton.disabled = true;
        noButton.disabled = true;
        playHeartsAnimation(); // Play effect first
        // Optional: Wait a moment for the animation to be visible
        await new Promise(resolve => setTimeout(resolve, 500)); 
        await sendResponseToSheet('はい！'); // Wait for response sending
    });

    noButton.addEventListener('click', async () => { // Make async
        yesButton.disabled = true;
        noButton.disabled = true;
        await sendResponseToSheet('いいえ'); // Wait for response sending
        // Attempt to close the window - may be blocked by browser
        window.close();
        // Fallback message if close fails
        alert("ウィンドウを閉じてください。"); // Please close the window.
    });
}); 