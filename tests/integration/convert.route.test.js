const request = require('supertest');
const app = require('../../src/app');

describe('Convert Route Integration Tests', () => {
  //
  // HEX → RGB
  //
  describe('GET /api/convert/hex-to-rgb', () => {
    test('should convert valid hex code successfully', async () => {
      const res = await request(app)
        .get('/api/convert/hex-to-rgb')
        .query({ hex: 'FF5733' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rgb).toEqual({ r: 255, g: 87, b: 51 });
      expect(res.body.data.hex).toBe('#FF5733');
      expect(res.body.data.css).toBe('rgb(255, 87, 51)');
    });

    test('should handle hex code with # prefix', async () => {
      const res = await request(app)
        .get('/api/convert/hex-to-rgb')
        .query({ hex: '#FFFFFF' });

      expect(res.status).toBe(200);
      expect(res.body.data.rgb).toEqual({ r: 255, g: 255, b: 255 });
    });

    test('should return 400 for missing hex parameter', async () => {
      const res = await request(app).get('/api/convert/hex-to-rgb');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Missing hex parameter');
    });

    test('should return 400 for invalid hex code', async () => {
      const res = await request(app)
        .get('/api/convert/hex-to-rgb')
        .query({ hex: 'INVALID' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid hex color code');
    });

    test('should handle shorthand hex codes', async () => {
      const res = await request(app)
        .get('/api/convert/hex-to-rgb')
        .query({ hex: 'F0F' });

      expect(res.status).toBe(200);
      expect(res.body.data.rgb).toEqual({ r: 255, g: 0, b: 255 });
    });
  });

  describe('POST /api/convert/hex-to-rgb', () => {
    test('should convert valid hex code from body', async () => {
      const res = await request(app)
        .post('/api/convert/hex-to-rgb')
        .send({ hex: '00FF00' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rgb).toEqual({ r: 0, g: 255, b: 0 });
    });

    test('should return 400 for missing hex in body', async () => {
      const res = await request(app)
        .post('/api/convert/hex-to-rgb')
        .send({})
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  //
  // RGB → HEX
  //
  describe('GET /api/convert/rgb-to-hex', () => {
    test('should convert valid rgb query to hex', async () => {
      const res = await request(app)
        .get('/api/convert/rgb-to-hex')
        .query({ r: 3, g: 100, b: 60 }); // #03643C

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hex).toBe('#03643C');
      expect(res.body.data.rgb).toEqual({ r: 3, g: 100, b: 60 });
    });

    test('should return 400 for out-of-range values', async () => {
      const res = await request(app)
        .get('/api/convert/rgb-to-hex')
        .query({ r: 300, g: -1, b: 60 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Invalid RGB/i);
    });
  });

  describe('POST /api/convert/rgb-to-hex', () => {
    test('should convert valid rgb body to hex', async () => {
      const res = await request(app)
        .post('/api/convert/rgb-to-hex')
        .send({ r: 255, g: 87, b: 51 })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hex).toBe('#FF5733');
    });

    test('should return 400 for missing body fields', async () => {
      const res = await request(app)
        .post('/api/convert/rgb-to-hex')
        .send({ r: 255 })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  //
  // API docs + 404
  //
  describe('GET /api', () => {
    test('should return API documentation', async () => {
      const res = await request(app).get('/api');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('HEX to RGB Conversion API');
      expect(res.body.endpoints).toBeDefined();
    });
  });

  describe('404 Error handling', () => {
    test('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Route not found');
    });
  });
});
