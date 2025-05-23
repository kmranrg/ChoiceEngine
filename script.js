document.addEventListener('DOMContentLoaded', () => {
    const spinner = document.getElementById('spinner');
    const wordInput = document.getElementById('word-input');
    const spinButton = document.getElementById('spin-button');
    const resultDisplay = document.getElementById('result-display');

    const itemHeight = 60; // Must match --item-height in CSS
    // *** UPDATED: Set to 3 items high ***
    const spinnerContainerHeight = itemHeight * 3;
    const repetitions = 10;
    let words = [];
    let isSpinning = false;

    // --- Populate Spinner ---
    function populateSpinner(inputWords) {
        spinner.innerHTML = '';
        if (inputWords.length === 0) {
            resultDisplay.textContent = 'Add Words!';
            return;
        }

        let fullList = [];
        for (let i = 0; i < repetitions; i++) {
            fullList = fullList.concat(inputWords);
        }

        fullList.forEach(word => {
            const item = document.createElement('div');
            item.classList.add('spinner-item');
            item.textContent = word;
            spinner.appendChild(item);
        });

        spinner.style.transition = 'none';
        // *** UPDATED: Center the first item initially ***
        const initialY = (spinnerContainerHeight / 2) - (itemHeight / 2);
        spinner.style.transform = `translateY(${initialY}px)`;
        resultDisplay.textContent = '?';
    }

    // --- Handle Spin ---
    spinButton.addEventListener('click', () => {
        const inputText = wordInput.value.trim();
        words = inputText.split('\n').filter(word => word.trim() !== '');

        if (words.length < 2 || isSpinning) {
            resultDisplay.textContent = words.length < 2 ? 'Need 2+ Words' : 'Spinning...';
            return;
        }

        isSpinning = true;
        spinButton.disabled = true;
        resultDisplay.textContent = 'Spinning...';
        populateSpinner(words);

        // Remove any previous active class
        const currentActive = spinner.querySelector('.active');
        if (currentActive) currentActive.classList.remove('active');

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * words.length);
            const selectedWord = words[randomIndex];

            const targetRepetition = Math.floor(repetitions / 2);
            let targetIndex = (targetRepetition * words.length) + randomIndex;

            const extraSpins = Math.floor(Math.random() * 3) + 2;
            targetIndex += extraSpins * words.length;

            // *** This calculation remains the same, but uses the updated
            //     spinnerContainerHeight, ensuring it centers in the 3-item view ***
            const targetY = -(targetIndex * itemHeight) + (spinnerContainerHeight / 2) - (itemHeight / 2);

            spinner.style.transition = 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)';
            spinner.style.transform = `translateY(${targetY}px)`;

            // --- Handle End of Spin ---
            spinner.addEventListener('transitionend', () => {
                isSpinning = false;
                spinButton.disabled = false;
                resultDisplay.textContent = selectedWord.toUpperCase() + '!';

                // Highlight the selected item
                const allItems = spinner.querySelectorAll('.spinner-item');
                if (allItems[targetIndex]) {
                   allItems[targetIndex].classList.add('active');
                }


                // Reset to a 'clean' position in the middle repetition
                // This prevents the transform value from getting huge over many spins
                // and makes subsequent spins smoother.
                setTimeout(() => {
                   const resetIndex = (Math.floor(repetitions / 2) * words.length) + randomIndex;
                   const resetY = -(resetIndex * itemHeight) + (spinnerContainerHeight / 2) - (itemHeight / 2);
                   spinner.style.transition = 'none'; // No transition for reset
                   spinner.style.transform = `translateY(${resetY}px)`;
                   // Re-highlight after reset
                   if (allItems[resetIndex]) {
                       allItems[resetIndex].classList.add('active');
                   }
                }, 50); // Short delay after spin ends

            }, { once: true });

        }, 100);
    });

    // Initial population
    populateSpinner(wordInput.value.trim().split('\n').filter(word => word.trim() !== ''));
});