// DOM Elements
const form = document.getElementById('enrollmentForm');
const submitBtn = document.querySelector('.submit-btn');
const btnText = document.querySelector('.btn-text');
const loadingSpinner = document.querySelector('.loading-spinner');
const successMessage = document.getElementById('successMessage');
const pastWorkRadios = document.querySelectorAll('input[name="pastWork"]');
const pastWorkDetails = document.getElementById('pastWorkDetails');

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    // Handle past work involvement toggle
    pastWorkRadios.forEach(radio => {
        radio.addEventListener('change', togglePastWorkDetails);
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmission);

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', formatPhoneNumber);

    // File input handling
    const fileInput = document.getElementById('profilePicture');
    fileInput.addEventListener('change', handleFileUpload);
}

// Toggle past work details section
function togglePastWorkDetails() {
    const selectedValue = document.querySelector('input[name="pastWork"]:checked')?.value;
    if (selectedValue === 'yes') {
        pastWorkDetails.style.display = 'block';
        pastWorkDetails.querySelector('textarea').required = true;
    } else {
        pastWorkDetails.style.display = 'none';
        pastWorkDetails.querySelector('textarea').required = false;
        pastWorkDetails.querySelector('textarea').value = '';
    }
}

// Format phone number
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
}

// Handle file upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showFieldError(e.target, 'File size must be less than 5MB');
            e.target.value = '';
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showFieldError(e.target, 'Please upload a valid image file (JPG, PNG, GIF)');
            e.target.value = '';
            return;
        }
        
        clearFieldError(e);
    }
}

// Form submission handler
async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission();
        
        // Show success message
        showSuccessMessage();
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('An error occurred while submitting the form. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Simulate form submission
function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    });
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

// Show success message
function showSuccessMessage() {
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Form validation
function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Clear all previous errors
    clearAllErrors();
    
    // Validate required fields
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Validate at least one language is selected
    const languages = form.querySelectorAll('input[name="languages[]"]:checked');
    if (languages.length === 0) {
        showFieldError(form.querySelector('input[name="languages[]"]'), 'Please select at least one language');
        isValid = false;
    }
    
    // Validate at least one team is selected
    const teams = form.querySelectorAll('input[name="teams[]"]:checked');
    if (teams.length === 0) {
        showFieldError(form.querySelector('input[name="teams[]"]'), 'Please select at least one team');
        isValid = false;
    }
    
    // Validate email format
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone number
    const phone = document.getElementById('phone');
    if (phone.value && phone.value.length < 10) {
        showFieldError(phone, 'Please enter a valid 10-digit phone number');
        isValid = false;
    }
    
    // Validate URL if provided
    const portfolio = document.getElementById('portfolio');
    if (portfolio.value && !isValidURL(portfolio.value)) {
        showFieldError(portfolio, 'Please enter a valid URL');
        isValid = false;
    }
    
    // Validate age (must be at least 16 years old)
    const dateOfBirth = document.getElementById('dateOfBirth');
    if (dateOfBirth.value) {
        const age = calculateAge(new Date(dateOfBirth.value));
        if (age < 16) {
            showFieldError(dateOfBirth, 'You must be at least 16 years old to apply');
            isValid = false;
        }
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const fieldType = field.type;
    const fieldValue = field.value.trim();
    
    // Clear previous error
    clearFieldError(e);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !fieldValue) {
        if (fieldType === 'radio' || fieldType === 'checkbox') {
            const groupName = field.name;
            const checkedInputs = form.querySelectorAll(`input[name="${groupName}"]:checked`);
            if (checkedInputs.length === 0) {
                showFieldError(field, 'This field is required');
                return false;
            }
        } else {
            showFieldError(field, 'This field is required');
            return false;
        }
    }
    
    // Validate email
    if (fieldType === 'email' && fieldValue && !isValidEmail(fieldValue)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Validate phone
    if (field.id === 'phone' && fieldValue && fieldValue.length < 10) {
        showFieldError(field, 'Please enter a valid 10-digit phone number');
        return false;
    }
    
    // Validate URL
    if (fieldType === 'url' && fieldValue && !isValidURL(fieldValue)) {
        showFieldError(field, 'Please enter a valid URL');
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Clear all errors
function clearAllErrors() {
    const errorFields = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function calculateAge(birthDate) {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
    }
    
    return age;
}

// Smooth scrolling for form sections (optional enhancement)
function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form progress indicator (optional enhancement)
function updateFormProgress() {
    const totalFields = form.querySelectorAll('[required]').length;
    const filledFields = form.querySelectorAll('[required]:valid').length;
    const progress = (filledFields / totalFields) * 100;
    
    // You can add a progress bar element and update it here
    console.log(`Form progress: ${progress.toFixed(1)}%`);
}

// Auto-save form data to sessionStorage (optional enhancement)
function saveFormData() {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Note: sessionStorage is not available in Claude artifacts
    // This would work in a real browser environment
    // sessionStorage.setItem('ragatsewa_form_data', JSON.stringify(data));
}

// Load saved form data (optional enhancement)
function loadFormData() {
    // Note: sessionStorage is not available in Claude artifacts
    // This would work in a real browser environment
    /*
    const savedData = sessionStorage.getItem('ragatsewa_form_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        // Populate form fields with saved data
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'radio' || field.type === 'checkbox') {
                    const value = Array.isArray(data[key]) ? data[key] : [data[key]];
                    value.forEach(val => {
                        const option = form.querySelector(`[name="${key}"][value="${val}"]`);
                        if (option) option.checked = true;
                    });
                } else {
                    field.value = data[key];
                }
            }
        });
    }
    */
}

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    // Allow Escape key to clear current field
    if (e.key === 'Escape') {
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA' || 
            document.activeElement.tagName === 'SELECT') {
            document.activeElement.blur();
        }
    }
});

// Print form data to console (for debugging)
function logFormData() {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    console.log('Form Data:', data);
}