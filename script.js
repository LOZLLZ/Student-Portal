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
        }).filter(student => student.LRN); // Ensure no empty rows
        console.log('Loaded student data:', studentData); // Debug CSV load
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// Load student info after CSV is fully loaded
async function loadStudentInfo() {
    await loadCSV(); // Ensure data is loaded

    const lrn = localStorage.getItem('studentLRN');
    console.log('LRN from storage:', lrn); // Debug

    const student = studentData.find(s => s.LRN === lrn);
    console.log('Matched student:', student); // Debug

    const studentNameElement = document.getElementById('studentName');
    const welcomeMessageElement = document.getElementById('welcome-message');

    if (student) {
        studentNameElement.textContent = student.Name;
        if (welcomeMessageElement) {
            welcomeMessageElement.textContent = `Welcome, ${student.Name}!`;
        }
    } else {
        studentNameElement.textContent = 'Student not found.';
        if (welcomeMessageElement) {
            welcomeMessageElement.textContent = 'Welcome, Student!';
        }
    }
}

// Display grade on assessment page
function loadAssessmentOptions() {
    const grade = localStorage.getItem('selectedGrade');
    const gradeLevelElement = document.getElementById('gradeLevel');
    if (gradeLevelElement) {
        gradeLevelElement.textContent = grade || 'N/A';
    }
}

// Display results on results.html (including student name)
async function displayResults() {
    await loadCSV(); // Ensure CSV data is loaded

    const lrn = localStorage.getItem('studentLRN');
    const grade = localStorage.getItem('selectedGrade');
    const assessment = localStorage.getItem('assessmentType');

    console.log('LRN:', lrn);
    console.log('Grade:', grade);
    console.log('Assessment:', assessment);

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

// Populate certificate with student name and numeracy status
async function populateCertificate() {
    await loadCSV(); // Ensure CSV is loaded

    const lrn = localStorage.getItem('studentLRN');
    console.log('LRN for certificate:', lrn); // Debug

    const student = studentData.find(s => s.LRN === lrn);
    console.log('Student data for certificate:', student); // Debug

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

// Initialize functions on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('studentName') && !document.getElementById('gradeLevel')) {
        await loadStudentInfo();
    }
    if (document.getElementById('gradeLevel') && !document.getElementById('assessmentType')) {
        loadAssessmentOptions();
    }
    if (document.getElementById('numeracyStatus') && document.getElementById('gradeLevel')) {
        displayResults();
    }
    if (document.getElementById('certificateDate')) {
        await populateCertificate();
    }
});
