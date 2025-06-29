// URL base da API (ajuste conforme o endereço do seu backend)
const API_URL = 'http://localhost:8080';

// Função para mostrar/esconder telas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Função para carregar alunos
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/student`);
        const students = await response.json();
        const studentList = document.getElementById('student-list');
        const studentSelect = document.getElementById('enrollment-student');
        studentList.innerHTML = '';
        studentSelect.innerHTML = '<option value="">Selecione um Aluno</option>';

        students.forEach(student => {
            // Lista de alunos
            const li = document.createElement('li');
            li.textContent = `ID: ${student.id} - Nome: ${student.name}`;
            studentList.appendChild(li);

            // Select de matrícula
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            studentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
    }
}

// Função para cadastrar aluno
document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('student-name').value;

    try {
        await fetch(`${API_URL}/student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        document.getElementById('student-form').reset();
        loadStudents();
    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);
    }
});

// Função para carregar matérias
async function loadSubjects() {
    try {
        const response = await fetch(`${API_URL}/subject`);
        const subjects = await response.json();
        const subjectList = document.getElementById('subject-list');
        const subjectSelect = document.getElementById('enrollment-subject');
        subjectList.innerHTML = '';
        subjectSelect.innerHTML = '<option value="">Selecione uma Matéria</option>';

        subjects.forEach(subject => {
            // Lista de matérias
            const li = document.createElement('li');
            li.textContent = `ID: ${subject.id} - Nome: ${subject.name} - Preço: R$${subject.price.toFixed(2)}`;
            subjectList.appendChild(li);

            // Select de matrícula
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = `${subject.name} (R$${subject.price.toFixed(2)})`;
            subjectSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar matérias:', error);
    }
}

// Função para cadastrar matéria
document.getElementById('subject-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('subject-name').value;
    const price = parseFloat(document.getElementById('subject-price').value);

    try {
        await fetch(`${API_URL}/subject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });
        document.getElementById('subject-form').reset();
        loadSubjects();
    } catch (error) {
        console.error('Erro ao cadastrar matéria:', error);
    }
});

// Função para carregar matrículas
async function loadEnrollments() {
    try {
        const response = await fetch(`${API_URL}/enrollment`);
        const enrollments = await response.json();
        const enrollmentList = document.getElementById('enrollment-list');
        enrollmentList.innerHTML = '';

        enrollments.forEach(enrollment => {
            const li = document.createElement('li');
            li.innerHTML = `
                ID: ${enrollment.id} - Aluno: ${enrollment.studentName} - 
                Matéria: ${enrollment.subjectName} (R$${enrollment.subjectPrice.toFixed(2)}) - 
                Pago: ${enrollment.paid ? 'Sim' : 'Não'}
                ${!enrollment.paid ? `<button onclick="payEnrollment(${enrollment.id})">Pagar</button>` : ''}
            `;
            enrollmentList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar matrículas:', error);
    }
}

// Função para criar matrícula
document.getElementById('enrollment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentId = parseInt(document.getElementById('enrollment-student').value);
    const subjectId = parseInt(document.getElementById('enrollment-subject').value);

    try {
        await fetch(`${API_URL}/enrollment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, subjectId })
        });
        document.getElementById('enrollment-form').reset();
        loadEnrollments();
    } catch (error) {
        console.error('Erro ao criar matrícula:', error);
    }
});

// Função para pagar matrícula
async function payEnrollment(enrollmentId) {
    try {
        await fetch(`${API_URL}/enrollment/${enrollmentId}/pay`, {
            method: 'POST'
        });
        loadEnrollments();
    } catch (error) {
        console.error('Erro ao pagar matrícula:', error);
    }
}

// Inicializar carregamento
showScreen('home');
loadStudents();
loadSubjects();
loadEnrollments();