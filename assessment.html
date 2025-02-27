// Array to store CSV data
let studentData = [];

// Load CSV data
async function loadCSV() {
    try {
        const response = await fetch('data.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Skip the header row
        studentData = rows.map(row => {
            const [LRN, Name, Grade, Assessment, Numeracy] = row.split(',');
            return {
                LRN: LRN.trim(),
                Name: Name.trim(),
                Grade: Grade.trim(),
                Assessment: Assessment.trim(),
                Numeracy: Numeracy.trim()
            };
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// Store LRN and redirect to student page
document.getElementById('lrnForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const lrn = document.getElementById('lrn').value.trim();
    localStorage.setItem('studentLRN', lrn);
    window.location.href = 'student.html';
});

// Display student name and load grade buttons
function loadStudentInfo() {
    const lrn = localStorage.getItem('studentLRN');
    const student = studentData.find(s => s.LRN === lrn);

    if (student) {
        document.getElementById('studentName').textContent = Welcome, ${student.Name}!;
    } else {
        document.getElementById('studentName').textContent = 'Student not found.';
    }
}

// Store selected grade and go to assessment page
function showAssessment(grade) {
    localStorage.setItem('selectedGrade', grade);
    window.location.href = 'assessment.html';
}

// Display assessment options (Pre, Mid, Post)
function loadAssessmentOptions() {
    const grade = localStorage.getItem('selectedGrade');
    document.getElementById('gradeLevel').textContent = grade;
}

// Store selected assessment and show numeracy level
function showNumeracy(assessment) {
    localStorage.setItem('assessmentType', assessment);
    window.location.href = 'result.html';
}

// Display numeracy status based on Grade and Assessment
function displayResults() {
    const lrn = localStorage.getItem('studentLRN');
    const grade = localStorage.getItem('selectedGrade');
    const assessment = localStorage.getItem('assessmentType');

    document.getElementById('gradeLevel').textContent = grade;
    document.getElementById('assessmentType').textContent = assessment;

    const student = studentData.find(s => s.LRN === lrn && s.Grade === grade && s.Assessment === assessment);

    if (student) {
        document.getElementById('numeracyStatus').textContent = student.Numeracy;
    } else {
        document.getElementById('numeracyStatus').textContent = 'No data available.';
    }
}

// Initialize data and event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCSV().then(() => {
        if (document.getElementById('studentName')) {
            loadStudentInfo();
        }
        if (document.getElementById('gradeLevel')) {
            loadAssessmentOptions();
        }
        if (document.getElementById('numeracyStatus')) {
            displayResults();
        }
    });
});
