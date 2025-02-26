// Fetch the LRN from local storage
const studentLRN = localStorage.getItem('studentLRN');
const studentNameElement = document.getElementById('studentName');
const numeracyStatusElement = document.getElementById('numeracyStatus');

let studentData = [];

// Load CSV data
fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        studentData = parseCSV(data);
        const student = studentData.find(row => row.LRN === studentLRN);
        if (student) {
            studentNameElement.textContent = `Welcome, ${student.Name}`;
        } else {
            studentNameElement.textContent = "Student not found";
        }
    })
    .catch(error => console.error('Error loading data:', error));

// Parse CSV data into an array of objects
function parseCSV(data) {
    const rows = data.split('\n').slice(1); // Remove headers
    return rows.map(row => {
        const [LRN, Name, Grade, Numeracy] = row.split(',');
        return { LRN, Name, Grade, Numeracy };
    });
}

// Show numeracy status by grade
function showNumeracy(grade) {
    const student = studentData.find(row => row.LRN === studentLRN && row.Grade === grade);
    if (student) {
        numeracyStatusElement.textContent = `Numeracy Status: ${student.Numeracy}`;
    } else {
        numeracyStatusElement.textContent = 'No data available for this grade.';
    }
}
