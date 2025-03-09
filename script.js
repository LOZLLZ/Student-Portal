// Array to store CSV data
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

// Display student's name on student.html
async function displayStudentName() {
    await loadCSV();
    const lrn = localStorage.getItem('studentLRN');
    const student = studentData.find(s => s.LRN === lrn);
    const welcomeMessage = document.getElementById('welcome-message');

    if (student) {
        welcomeMessage.textContent = `Welcome, ${student.Name}`;
    } else {
        welcomeMessage.textContent = 'Welcome, Student';
    }
}

// Save selected grade and redirect to assessment.html
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('welcome-message')) {
        displayStudentName(); // Show student's name on student.html
    }

    const gradeLinks = document.querySelectorAll('.grade-link');
    gradeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedGrade = link.getAttribute('data-grade');
            localStorage.setItem('selectedGrade', selectedGrade);
            window.location.href = 'assessment.html';
        });
    });

    if (document.getElementById('gradeLevel')) {
        loadAssessmentOptions();
    }

    if (document.getElementById('numeracyStatus')) {
        displayResults();
    }

    if (document.getElementById('certificateDate')) {
        populateCertificate();
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

// Display results on results.html
async function displayResults() {
    await loadCSV();
    const lrn = localStorage.getItem('studentLRN');
    const grade = localStorage.getItem('selectedGrade');
    const assessment = localStorage.getItem('assessmentType');

    const student = studentData.find(s => 
        s.LRN === lrn &&
        s.Grade === grade &&
        s.Assessment === assessment
    );

    document.getElementById('studentName').textContent = student ? `Student: ${student.Name}` : 'Student not found';
    document.getElementById('gradeLevel').textContent = grade || 'N/A';
    document.getElementById('assessmentType').textContent = assessment || 'N/A';
    document.getElementById('numeracyStatus').textContent = student ? student.Numeracy : 'No data available.';
}

// Populate certificate on certificate.html
async function populateCertificate() {
    await loadCSV();
    const lrn = localStorage.getItem('studentLRN');
    const student = studentData.find(s => s.LRN === lrn);

    if (student) {
        document.getElementById('studentName').textContent = student.Name;
        document.getElementById('numeracyStatus').textContent = student.Numeracy;
        document.getElementById('certificateDate').textContent = "August 19–23, 2024";
    } else {
        document.getElementById('studentName').textContent = 'Student not found';
        document.getElementById('numeracyStatus').textContent = 'N/A';
        document.getElementById('certificateDate').textContent = '';
    }
}
