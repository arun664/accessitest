// Dark mode toggle function
function toggleDarkMode() {
    const body = document.body;
    const checkbox = document.querySelector(".switch input");

    // Toggle between dark and light mode
    if (checkbox.checked) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
}

// Analyze button functionality for redirecting to analysis page
function analyzeUrl() {
    const urlInput = document.getElementById('url-input').value;

    // Validate that the URL is entered
    if (urlInput) {
        // Redirect to the results page with the URL as a query parameter
        window.location.href = `results.html?url=${encodeURIComponent(urlInput)}`;
    } else {
        alert("Please enter a valid URL");
    }
}

// Modal handling for login and signup
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('login-btn');
const signupLink = document.getElementById('signup-link');
const closeButtons = document.querySelectorAll('.close');

// Open login modal
loginBtn.onclick = function() {
    loginModal.style.display = 'block';
}

// Close modals when the close button is clicked
closeButtons.forEach(closeBtn => {
    closeBtn.onclick = function() {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    }
});

// Close modals if the user clicks outside of them
window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    } else if (event.target === signupModal) {
        signupModal.style.display = 'none';
    }
}

// Switch from login to signup modal
signupLink.onclick = function() {
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
}

// On the analysis page, load the URL into the iframe based on the query parameter
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    
    if (url && document.getElementById('url-frame')) {
        document.getElementById('url-frame').src = url;
    }
};
