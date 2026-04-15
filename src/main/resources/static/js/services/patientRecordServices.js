import { getAllAppointments } from './appointmentRecordService.js';

export async function getPatientRecords(token) {
  return getAllAppointments(null, null, token);
}

export async function filterPatientRecords(status, name, date, token) {
  const dateParam = date && date !== 'null' ? date : null;
  const nameParam = name && name !== 'null' ? name : null;

  let records = await getAllAppointments(dateParam, nameParam, token);

  if (status && status !== 'null') {
    const statusMap = { scheduled: 0, completed: 1, cancelled: 2 };
    const statusNum = statusMap[status.toLowerCase()];
    if (statusNum !== undefined) {
      records = records.filter(r => r.status === statusNum);
    }
  }

  return records;
}