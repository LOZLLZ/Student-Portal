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
        const rows = data.split('\n').slice(1); // Skip the header row
        studentData = rows.map(row => {
            const [LRN, Name, Grade, Assessment, Numeracy] = row.split(',');
            return {
                LRN: LRN?.trim(),
                Name: Name?.trim(),
                Grade: Grade?.trim(),
                Assessment: Assessment?.trim(),
                Numeracy: Numeracy?.trim()
            };
        });
        console.log('Loaded student data:', studentData); // Confirm data is loaded
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// Display student info
function loadStudentInfo() {
    const lrn = localStorage.getItem('studentLRN');
    const student = studentData.find(s => s.LRN === lrn);

    if (student) {
        document.getElementById('studentName').textContent = `Welcome, ${student.Name}!`;
    } else {
        document.getElementById('studentName').textContent = 'Student not found.';
    }
}

// Display grade on assessment page
function loadAssessmentOptions() {
    const grade = localStorage.getItem('selectedGrade');
    document.getElementById('gradeLevel').textContent = grade || 'N/A';
}

// Display results on the results page
async function displayResults() {
    await loadCSV(); // Ensure CSV is fully loaded before displaying data

    const lrn = localStorage.getItem('studentLRN');
    const grade = localStorage.getItem('selectedGrade');
    const assessment = localStorage.getItem('assessmentType');

    console.log('LRN:', lrn);
    console.log('Grade:', grade);
    console.log('Assessment:', assessment);

    document.getElementById('gradeLevel').textContent = grade || 'N/A';
    document.getElementById('assessmentType').textContent = assessment || 'N/A';

    const student = studentData.find(s => 
        s.LRN === lrn &&
        s.Grade === grade &&
        s.Assessment === assessment
    );

    if (student) {
        document.getElementById('numeracyStatus').textContent = student.Numeracy;
    } else {
        document.getElementById('numeracyStatus').textContent = 'No data available.';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadCSV();
    if (document.getElementById('studentName')) {
        loadStudentInfo();
    }
    if (document.getElementById('gradeLevel') && !document.getElementById('assessmentType')) {
        loadAssessmentOptions();
    }
    if (document.getElementById('numeracyStatus')) {
        displayResults();
    }
});
