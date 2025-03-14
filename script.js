// Array to store CSV data
let studentData = [];

// Load CSV data
async function loadCSV() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) {
            throw new Error('Failed to fetch CSV data');
        }
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Skip header row
        studentData = rows.map(row => {
            const [LRN, Name, Grade, Assessment, Numeracy] = row.split(',');
            return {
                LRN: LRN?.trim(),
                Name: Name?.trim(),
                Grade: Grade?.trim(),
                Assessment: Assessment?.trim(),
                Numeracy: Numeracy?.trim()
            };
        }).filter(student => student.LRN); // Remove empty rows
        console.log('CSV Data Loaded:', studentData); // Debugging
    } catch (error) {
        console.error('Error loading CSV:', error);
        alert('Failed to load student data. Please try again.');
    }
}

// Display student's name
async function displayStudentName() {
    await loadCSV();
    const lrn = localStorage.getItem('studentLRN');
    const student = studentData.find(s => s.LRN === lrn);
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = student ? student.Name : 'Student';
    }
}

// Save selected grade and redirect to assessment.html
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('welcome-message')) {
        await displayStudentName();
    }

    // Grade selection
    document.querySelectorAll('.grade-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('selectedGrade', link.getAttribute('data-grade'));
            window.location.href = 'assessment.html';
        });
    });

    // Assessment type selection
    document.querySelectorAll('.assessment-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('assessmentType', link.getAttribute('data-assessment'));
            window.location.href = 'results.html';
        });
    });

    if (document.getElementById('gradeLevel')) {
        loadAssessmentOptions();
    }

    if (document.querySelector('.certificate-container')) {
        await populateCertificates();
    }
});

// Display grade on assessment.html
function loadAssessmentOptions() {
    const grade = localStorage.getItem('selectedGrade');
    const gradeLevelElement = document.getElementById('gradeLevel');
    if (gradeLevelElement) {
        gradeLevelElement.textContent = grade || 'N/A';
    }
}

// Populate certificates dynamically
async function populateCertificates() {
    await loadCSV();
    const lrn = localStorage.getItem('studentLRN');
    const grade = localStorage.getItem('selectedGrade');
    const assessment = localStorage.getItem('assessmentType');

    console.log('Assessment Type:', assessment); // Debugging

    const student = studentData.find(s =>
        s.LRN === lrn &&
        s.Grade === grade &&
        s.Assessment === assessment
    );

    console.log('Student data for certificate:', student); // Debugging

    const name = student ? student.Name : 'Student not found';
    const numeracy = student ? student.Numeracy : 'N/A';
    const date = "August 19–23, 2024";

    // Ensure all certificates start hidden
    document.querySelectorAll('.certificate-container').forEach(cert => {
        cert.style.display = 'none';
    });

    // Match the correct certificate by assessment type
    if (assessment === 'Pre-Test') {
        showCertificate('preTestCertificate', name, numeracy, date);
    } else if (assessment === 'Midyear') {
        showCertificate('midYearCertificate', name, numeracy, date);
    } else if (assessment === 'Post-Test') {
        showCertificate('postTestCertificate', name, numeracy, date);
    } else {
        console.warn('Invalid assessment type:', assessment);
    }
}

// Helper function to show certificates
function showCertificate(certId, name, numeracy, date) {
    const certificate = document.getElementById(certId);
    if (certificate) {
        certificate.style.display = 'block';
        certificate.querySelector('h2').textContent = name;
        certificate.querySelector('span').textContent = numeracy;
        certificate.querySelector('.date span').textContent = date;
    } else {
        console.error('Certificate not found:', certId);
    }
}
