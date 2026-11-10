import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from './app.js';

test('health responds with the public liveness contract', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok', service: 'pinpoint-api' });
  assert.equal(response.headers['x-powered-by'], undefined);
});
test('unknown routes return a JSON 404', async () => {
  const response = await request(app).get('/api/unknown');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Route not found' });
});
test('malformed JSON returns a safe client error', async () => {
  const response = await request(app).post('/api/unknown').set('Content-Type', 'application/json').send('{');
  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: 'Invalid JSON body' });
});
