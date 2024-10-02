const apiKey = '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'; // Replace with your actual Hugging Face API key
const maxChars = 1000; // Character limit

// Toggle between dark and light themes
function toggleTheme() {
    const body = document.body;
    const container = document.querySelector('.container');
    const h2 = document.querySelector('h2');
    const textArea = document.getElementById('input-text');
    const charCounter = document.getElementById('char-counter');
    const button = document.getElementById('summarize-btn');
    const output = document.querySelector('.output');
    const themeLabel = document.getElementById('theme-label');

    // Toggle class for dark mode
    body.classList.toggle('dark');
    container.classList.toggle('dark');
    h2.classList.toggle('dark');
    textArea.classList.toggle('dark');
    charCounter.classList.toggle('dark');
    button.classList.toggle('dark');
    output.classList.toggle('dark');

    // Update label text
    themeLabel.textContent = body.classList.contains('dark') ? 'Dark Mode' : 'Light Mode';
}

// Update character count and enable/disable button
function updateCharacterCount() {
    const inputText = document.getElementById('input-text').value;
    const charCounter = document.getElementById('char-counter');
    const summarizeBtn = document.getElementById('summarize-btn');

    // Update character count
    charCounter.textContent = `${inputText.length} / ${maxChars} characters`;

    // Check if character limit is exceeded
    if (inputText.length > maxChars) {
        charCounter.classList.add('exceeded');
        summarizeBtn.disabled = true; // Disable button
    } else {
        charCounter.classList.remove('exceeded');
        summarizeBtn.disabled = false; // Enable button
    }
}

async function summarizeText() {
    const inputText = document.getElementById('input-text').value;
    const outputDiv = document.getElementById('output');

    outputDiv.innerHTML = 'Summarizing...';

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                inputs: inputText,
                parameters: { 
                    max_length: 100, // Set the maximum length of the summary
                    min_length: 30   // Set the minimum length of the summary
                }
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const summary = data[0].summary_text;

            outputDiv.innerHTML = `<h4>Summary:</h4><p>${summary}</p>`;
        } else {
            outputDiv.innerHTML = '<p>There was an error summarizing the text. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = '<p>There was an error summarizing the text. Please try again later.</p>';
    }
}
