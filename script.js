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
                Numeracy: Numeracy?.trim() || 'Not Assessed'
            };
        }).filter(student => student.LRN); // Remove empty rows
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

    document.querySelectorAll('.grade-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('selectedGrade', link.getAttribute('data-grade'));
            window.location.href = 'assessment.html';
        });
    });

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

// Dates for each assessment type
const assessmentDates = {
    'Pre': 'August 19–23, 2024',
    'Mid': 'December 2–6, 2024',
    'Post': 'March 10–14, 2025'
};

// Populate certificates dynamically
async function populateCertificates() {
    await loadCSV();
    const lrn = localStorage.getItem('studentLRN');
    const grade = localStorage.getItem('selectedGrade');
    const assessment = localStorage.getItem('assessmentType');

    // Ensure CSV "Pre", "Mid", "Post" map correctly
    const assessmentMapping = {
        'Pre': 'Pre',
        'Mid': 'Mid',
        'Post': 'Post'
    };

    const mappedAssessment = assessmentMapping[assessment];

    const student = studentData.find(s =>
        s.LRN === lrn &&
        s.Grade === grade &&
        s.Assessment === mappedAssessment
    );

    const name = student ? student.Name : 'Student not found';
    const numeracy = student ? student.Numeracy : 'N/A';
    const date = assessmentDates[mappedAssessment] || 'N/A';

    document.querySelectorAll('.certificate-container').forEach(cert => {
        cert.style.display = 'none';
    });

    // Show the correct certificate
    if (mappedAssessment === 'Pre') {
        showCertificate('preTestCertificate', name, numeracy, date);
    } else if (mappedAssessment === 'Mid') {
        showCertificate('midYearCertificate', name, numeracy, date);
    } else if (mappedAssessment === 'Post') {
        showCertificate('postTestCertificate', name, numeracy, date);
    } else {
        console.warn('Invalid assessment type:', mappedAssessment);
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
