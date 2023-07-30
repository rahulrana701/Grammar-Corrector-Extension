const btn = document.querySelector('.checkbutton');
const results = document.querySelector('.results');
const inputtext = document.querySelector('#inputtext');
const correctionHeading = document.getElementById('correction-heading');

inputtext.addEventListener('input', () => {
    results.innerHTML = '';
    correctionHeading.style.display = 'none'; // Hide the heading when the user types
});

btn.addEventListener('click', async () => {
    const userInput = inputtext.value;
    if (userInput.trim() === '') {
        results.innerHTML = 'Please enter a sentence to check.';
        correctionHeading.style.display = 'none'; // Hide the heading if there are no results
        return;
    }
    try {
        const correctedText = await getCorrectedText(userInput);
        results.innerHTML = correctedText;
        correctionHeading.style.display = 'block'; // Show the heading if there are results
    } catch (error) {
        results.innerHTML = 'Error while fetching data from Text Gears API.';
        correctionHeading.style.display = 'none'; // Hide the heading if there's an error
        console.error('Error while fetching data from Text Gears API:', error);
    }
});

async function getCorrectedText(text) {
    const apiKey = 'iL3QKsBguWhFKEWg';
    const encodedText = encodeURIComponent(text);
    const apiUrl = `https://api.textgears.com/grammar?text=${encodedText}&language=en-GB&whitelist=&dictionary_id=&ai=0&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data from Text Gears API.');
        }

        const data = await response.json();
        if (data.response && data.response.result) {
            let correctedText = text;
            for (const error of data.response.errors) {
                correctedText = applyCorrection(correctedText, error.bad, error.better);
            }
            return correctedText;
        } else {
            return text;
        }
    } catch (error) {
        throw error;
    }
}

function applyCorrection(text, incorrectWord, correctedWord) {
    return text.replace(new RegExp('\\b' + incorrectWord + '\\b', 'gi'), correctedWord);
}
