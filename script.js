v// Array to store CSV data
let studentData = [];

// Load CSV data
async function loadCSV() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) {
            throw new Error('Failed to fetch CSV');
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
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// Display student's name without "Welcome,"
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
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('welcome-message')) {
        displayStudentName();
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
        populateCertificates();
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

    const student = studentData.find(s =>
        s.LRN === lrn &&
        s.Grade === grade &&
        s.Assessment === assessment
    );

    const name = student ? student.Name : 'Student not found';
    const numeracy = student ? student.Numeracy : 'N/A';
    const date = "August 19–23, 2024";

    // Show/hide certificates based on assessment type
    document.querySelectorAll('.certificate-container').forEach(cert => {
        cert.classList.remove('active');
    });

    if (assessment === 'Pre-Test') {
        document.getElementById('preTestCertificate').classList.add('active');
        document.getElementById('studentNamePre').textContent = name;
        document.getElementById('numeracyStatusPre').textContent = numeracy;
        document.getElementById('certificateDatePre').textContent = date;
    } else if (assessment === 'Midyear') {
        document.getElementById('midYearCertificate').classList.add('active');
        document.getElementById('studentNameMid').textContent = name;
        document.getElementById('numeracyStatusMid').textContent = numeracy;
        document.getElementById('certificateDateMid').textContent = date;
    } else if (assessment === 'Post-Test') {
        document.getElementById('postTestCertificate').classList.add('active');
        document.getElementById('studentNamePost').textContent = name;
        document.getElementById('numeracyStatusPost').textContent = numeracy;
        document.getElementById('certificateDatePost').textContent = date;
    }
}
