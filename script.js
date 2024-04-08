document.addEventListener('DOMContentLoaded', function() {
    const searchTypeSelect = document.getElementById('searchType');
    const nameSearchSection = document.getElementById('nameSearchSection');
    const usernameSearchSection = document.getElementById('usernameSearchSection');

    searchTypeSelect.addEventListener('change', function() {
        const selectedOption = this.value;
        if (selectedOption === 'name') {
            nameSearchSection.style.display = 'block';
            usernameSearchSection.style.display = 'none';
        } else if (selectedOption === 'username') {
            nameSearchSection.style.display = 'none';
            usernameSearchSection.style.display = 'block';
        }
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        const searchType = searchTypeSelect.value;
        const searchNamesInput = document.getElementById('searchNamesInput');
        const searchListInput = document.getElementById('searchListInput');
        const searchUsernameInput = document.getElementById('searchUsernameInput');
        const searchResultsDiv = document.getElementById('searchResults');

        // Clear previous search results
        searchResultsDiv.innerHTML = '';

        // Get the entered names and list as arrays
        const searchNames = searchNamesInput.value.split('\n').map(name => name.trim().toLowerCase());
        const searchList = searchListInput.value.split('\n').map(name => name.trim().toLowerCase());
        const searchUsernameLines = searchUsernameInput.value.split('\n').map(username => username.trim().toLowerCase());

        // Create an ordered list for the search results
        const resultList = document.createElement('ol');
        resultList.style.listStyleType = 'none'; // Remove default numbering

        // Perform the search based on the selected search type
        if (searchType === 'name') {
            // Add search by name functionality
            searchNames.forEach(name => {
                if (searchList.includes(name)) {
                    const resultItem = document.createElement('li');
                    resultItem.textContent = `${name}:`;
                    resultItem.style.color = 'green'; // Found names are green
                    resultList.appendChild(resultItem);
                } else {
                    const resultItem = document.createElement('li');
                    resultItem.textContent = `${name}: Not Found`;
                    resultItem.style.color = 'red'; // Not found names are red
                    resultList.appendChild(resultItem);
                }
            });
        } else if (searchType === 'username') {
            // Add search by username functionality
            searchUsernameLines.forEach(usernameLine => {
                const [firstName, surnameInitial] = usernameLine.split(' ');
                const searchUsername = (firstName + (surnameInitial ? surnameInitial[0] : '')).toLowerCase();
                const matchingUsernames = searchList.filter(name => {
                    const [nameFirst, nameSurnameInitial] = name.split(' ');
                    const nameUsername = (nameFirst + (nameSurnameInitial ? nameSurnameInitial[0] : '')).toLowerCase();
                    const similarity = calculateSimilarity(searchUsername, nameUsername);
                    return similarity >= 0.6; // Adjust similarity threshold as needed (60% in this case)
                });

                if (matchingUsernames.length > 0) {
                    matchingUsernames.forEach(matchingUsername => {
                        const similarity = calculateSimilarity(searchUsername, matchingUsername.toLowerCase());
                        const resultItem = document.createElement('li');
                        resultItem.textContent = `${searchUsername} (Similarity: ${Math.round(similarity * 100)}%): Matched with ${matchingUsername}`;
                        resultItem.style.color = 'green'; // Matched usernames are green
                        resultList.appendChild(resultItem);
                    });
                } else {
                    const resultItem = document.createElement('li');
                    resultItem.textContent = `${searchUsername}: Not Found`;
                    resultItem.style.color = 'red'; // Not found usernames are red
                    resultList.appendChild(resultItem);
                }
            });
        }

        // Append the ordered list to the search results div
        searchResultsDiv.appendChild(resultList);

        // Show the search results div
        searchResultsDiv.style.display = 'block';
    });

    // Function to calculate similarity index between two strings
    function calculateSimilarity(str1, str2) {
        const length = Math.max(str1.length, str2.length);
        const distance = Array.from({ length }, (_, i) => (str1[i] === str2[i] ? 0 : 1)).reduce((acc, val) => acc + val, 0);
        return 1 - distance / length;
    }

    // Limit the number of characters in the textareas
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => {
        textArea.addEventListener('input', function() {
            const maxLength = parseInt(textArea.getAttribute('maxlength'));
            if (textArea.value.length > maxLength) {
                textArea.value = textArea.value.slice(0, maxLength);
            }
        });
    });
});
