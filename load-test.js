import http from 'k6/http';
import { check, sleep } from 'k6';

// SKENARIO: 
// 50 User virtual menyerbu serentak selama 30 detik
export const options = {
  vus: 50,    // Virtual Users (User simulasi)
  duration: '30s',
};

export default function () {
  // Arahkan ke endpoint Checkout Laravel Anda
  const url = 'http://localhost:8000/api/checkout';
  
  const payload = JSON.stringify({
    total: 150000,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  // KRITERIA SUKSES (ASSERTION):
  // 1. Status harus 200 (OK)
  // 2. Respon harus mengandung kata "success"
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction successful': (r) => r.body.includes('success'),
  });

  sleep(1); // User istirahat 1 detik sebelum belanja lagi
}