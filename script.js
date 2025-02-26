let studentData = [];

async function loadCSV() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) throw new Error('Failed to load CSV');
        
        const data = await response.text();
        console.log('Raw CSV data:', data); // Check the raw CSV content
        
        const rows = data.split('\n').slice(1);
        studentData = rows.map(row => {
            const [LRN, Name, Grade, Numeracy] = row.split(',');
            return {
                LRN: LRN ? LRN.trim() : '',
                Name: Name ? Name.trim() : '',
                Grade: Grade ? Grade.trim() : '',
                Numeracy: Numeracy ? Numeracy.trim() : ''
            };
        });

        console.log('Parsed student data:', studentData); // Check parsed data
        displayStudent();
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

function displayStudent() {
    const lrn = localStorage.getItem('studentLRN');
    console.log('Stored LRN:', lrn); // See what LRN is saved

    const student = studentData.find(s => s.LRN === lrn);
    console.log('Matched student:', student); // See the matching student
    
    if (student) {
        document.getElementById('studentName').textContent = `Welcome, ${student.Name}!`;
    } else {
        document.getElementById('studentName').textContent = 'Student not found.';
    }
}

function showNumeracy(grade) {
    const lrn = localStorage.getItem('studentLRN');
    const student = studentData.find(s => s.LRN === lrn && s.Grade === grade);
    console.log(`Searching for LRN: ${lrn}, Grade: ${grade}`, student);

    if (student) {
        document.getElementById('numeracyStatus').textContent = `Your numeracy status for ${grade}: ${student.Numeracy}`;
    } else {
        document.getElementById('numeracyStatus').textContent = 'No data available for this grade.';
    }
}

loadCSV();