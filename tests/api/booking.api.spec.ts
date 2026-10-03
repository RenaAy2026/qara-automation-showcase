import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';

const newBooking = {
  firstname: 'Test',
  lastname: 'User',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

async function createBooking(request: APIRequestContext): Promise<number> {
  const response = await request.post(`${BASE_URL}/booking`, { data: newBooking });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body.bookingid;
}

async function getToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${BASE_URL}/auth`, {
    data: { username: 'admin', password: 'password123' },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body.token;
}

test.describe('Booking API', () => {
  test('creating a booking returns an id and the data we sent @smoke', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/booking`, { data: newBooking });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe('Test');
    expect(body.booking.lastname).toBe('User');
  });

  test('a created booking can be fetched by id @regression', async ({ request }) => {
    const id = await createBooking(request);
    const response = await request.get(`${BASE_URL}/booking/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Test');
    expect(body.totalprice).toBe(150);
  });

  test('a booking can be updated with a valid token @regression', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);
    const response = await request.put(`${BASE_URL}/booking/${id}`, {
      headers: { Cookie: `token=${token}`, Accept: 'application/json' },
      data: { ...newBooking, firstname: 'Updated' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Updated');
  });

  test('updating without a token is rejected @regression', async ({ request }) => {
    const id = await createBooking(request);
    const response = await request.put(`${BASE_URL}/booking/${id}`, {
      headers: { Accept: 'application/json' },
      data: { ...newBooking, firstname: 'Intruder' },
    });
    expect(response.status()).toBe(403);
  });

  test('a deleted booking can no longer be fetched @regression', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);
    const deleteResponse = await request.delete(`${BASE_URL}/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteResponse.status()).toBe(201);
    const getResponse = await request.get(`${BASE_URL}/booking/${id}`);
    expect(getResponse.status()).toBe(404);
  });
});