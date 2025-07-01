const defaultData = {
  employees: [
    { id: 1, name: '김대표', role: '대표' },
    { id: 2, name: '이매니저', role: '매니저' },
    { id: 3, name: '박직원', role: '직원' }
  ],
  planned_schedule: {
    '2025-07-01': {
      morning: { employee_id: 1, start: '09:00', end: '14:00' },
      afternoon: { employee_id: 2, start: '14:00', end: '20:00' }
    }
  },
  schedule_requests: []
};

function loadData() {
  const data = JSON.parse(localStorage.getItem('cafeData') || 'null');
  if (data) return data;
  localStorage.setItem('cafeData', JSON.stringify(defaultData));
  return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
  localStorage.setItem('cafeData', JSON.stringify(data));
}

function renderSchedule() {
  const data = loadData();
  const scheduleDiv = document.getElementById('schedule');
  const table = document.createElement('table');
  const header = document.createElement('tr');
  header.innerHTML = '<th>날짜</th><th>오전</th><th>오후</th>';
  table.appendChild(header);
  Object.keys(data.planned_schedule).forEach(date => {
    const row = document.createElement('tr');
    const morning = data.planned_schedule[date].morning;
    const afternoon = data.planned_schedule[date].afternoon;
    row.innerHTML = `<td>${date}</td><td>${nameById(morning.employee_id)} ${morning.start}-${morning.end}</td><td>${nameById(afternoon.employee_id)} ${afternoon.start}-${afternoon.end}</td>`;
    table.appendChild(row);
  });
  scheduleDiv.innerHTML = '';
  scheduleDiv.appendChild(table);
}

function nameById(id) {
  const data = loadData();
  const emp = data.employees.find(e => e.id === id);
  return emp ? emp.name : '';
}

document.getElementById('requestBtn').addEventListener('click', () => {
  document.getElementById('requestForm').classList.toggle('hidden');
});

document.getElementById('submitRequest').addEventListener('click', () => {
  const date = document.getElementById('reqDate').value;
  const original = document.getElementById('reqOriginal').value;
  const shift = document.getElementById('reqShift').value;
  const reason = document.getElementById('reqReason').value;
  if (!date || !shift) {
    alert('날짜와 변경 요청을 입력하세요.');
    return;
  }
  const data = loadData();
  const id = Date.now();
  data.schedule_requests.push({ id, employee_id: 3, requested_date: date, original_shift: original, requested_shift: shift, reason, status: 'pending', request_date: new Date().toISOString() });
  saveData(data);
  alert('요청이 저장되었습니다.');
  document.getElementById('requestForm').classList.add('hidden');
});

renderSchedule();
