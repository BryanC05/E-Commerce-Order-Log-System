import http from 'k6/http';
import { check, sleep } from 'k6';

// 50 Users
export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
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

  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction successful': (r) => r.body.includes('success'),
  });

  sleep(1);
}
