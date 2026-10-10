import { test, expect, APIRequestContext } from '@playwright/test';

const BASE = 'https://restful-booker.herokuapp.com';

const newBooking = () => ({
  firstname: 'Adolfo',
  lastname: 'QA',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-04' },
  additionalneeds: 'Late checkout',
});

async function authToken(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${BASE}/auth`, { data: { username: 'admin', password: 'password123' } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.token).toBeTruthy();
  return body.token;
}

test.describe('Booking API', () => {
  test('health check responds 201', async ({ request }) => {
    const res = await request.get(`${BASE}/ping`);
    expect(res.status()).toBe(201);
  });

  test('creates, reads, updates and deletes a booking', async ({ request }) => {
    const token = await authToken(request);

    const created = await request.post(`${BASE}/booking`, { data: newBooking() });
    expect(created.status()).toBe(200);
    const { bookingid, booking } = await created.json();
    expect(bookingid).toEqual(expect.any(Number));
    expect(booking).toMatchObject(newBooking());

    const read = await request.get(`${BASE}/booking/${bookingid}`);
    expect(read.status()).toBe(200);
    expect(await read.json()).toMatchObject(newBooking());

    const updated = await request.patch(`${BASE}/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
      data: { totalprice: 300 },
    });
    expect(updated.status()).toBe(200);
    expect((await updated.json()).totalprice).toBe(300);

    const deleted = await request.delete(`${BASE}/booking/${bookingid}`, { headers: { Cookie: `token=${token}` } });
    expect(deleted.status()).toBe(201);

    const gone = await request.get(`${BASE}/booking/${bookingid}`);
    expect(gone.status()).toBe(404);
  });

  test('update without a token is forbidden', async ({ request }) => {
    const created = await request.post(`${BASE}/booking`, { data: newBooking() });
    const { bookingid } = await created.json();
    const res = await request.patch(`${BASE}/booking/${bookingid}`, { data: { totalprice: 1 } });
    expect(res.status()).toBe(403);
  });

  test('unknown booking returns 404', async ({ request }) => {
    const res = await request.get(`${BASE}/booking/999999999`);
    expect(res.status()).toBe(404);
  });
});
