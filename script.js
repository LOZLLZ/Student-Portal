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

// Initialize student page
async function initializeStudentPage() {
    await loadCSV(); // Ensure CSV loads fully before anything else
    loadStudentInfo();
}

// Find and display student info by LRN
function loadStudentInfo() {
    const lrn = localStorage.getItem('studentLRN');
    console.log('LRN from storage:', lrn); // Debug LRN retrieval

    const studentNameElement = document.getElementById('studentName');
    if (!lrn) {
        studentNameElement.textContent = 'No LRN found.';
        return;
    }

    const student = studentData.find(s => s.LRN === lrn?.trim());
    console.log('Matched student:', student); // Debug matched student

    studentNameElement.textContent = student ? `Welcome, ${student.Name}!` : 'Student not found.';
}

// Load assessment page options (grade level)
function loadAssessmentOptions() {
    const grade = localStorage.getItem('selectedGrade');
    const gradeLevelElement = document.getElementById('gradeLevel');
    if (gradeLevelElement) {
        gradeLevelElement.textContent = grade || 'N/A';
    }
}

// Display results page (grade, assessment, and numeracy)
async function displayResults() {
    await loadCSV(); // Ensure CSV is fully loaded before searching

    const lrn = localStorage.getItem('studentLRN');
    const grade = localStorage.getItem('selectedGrade');
    const assessment = localStorage.getItem('assessmentType');

    console.log('LRN:', lrn);
    console.log('Grade:', grade);
    console.log('Assessment:', assessment);

    document.getElementById('gradeLevel').textContent = grade || 'N/A';
    document.getElementById('assessmentType').textContent = assessment || 'N/A';

    const student = studentData.find(s => 
        s.LRN === lrn?.trim() &&
        s.Grade === grade?.trim() &&
        s.Assessment === assessment?.trim()
    );

    document.getElementById('numeracyStatus').textContent = student ? student.Numeracy : 'No data available.';
}

// Initialize the correct functions based on the page
document.addEventListener('DOMContentLoaded', async () => {
    await loadCSV();

    if (document.getElementById('studentName')) {
        initializeStudentPage();
    }
    if (document.getElementById('gradeLevel') && !document.getElementById('assessmentType')) {
        loadAssessmentOptions();
    }
    if (document.getElementById('numeracyStatus')) {
        displayResults();
    }
});
