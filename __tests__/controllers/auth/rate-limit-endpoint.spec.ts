import request from 'supertest';
import app from '@app';
import { API } from '../../utils';
import { RATE_LIMIT_MAX_REQUESTS } from '@config';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';

describe('calling multiple times an endpoint', () => {
  it('returns http code 429 with message too many requests', async () => {
    let response;
    for (
      let index = 0;
      index < Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100') + 1;
      index++
    ) {
      response = await request(app).post(`${API}/auth/signin`);
    }
    expect(response.status).toBe(429);
    expect(response.body).toStrictEqual({
      description: ErrorsMessages.TO_MANY_REQUESTS_ERROR,
      httpCode: HttpStatusCode.TO_MANY_REQUESTS,
      name: ErrorsMessages.TO_MANY_REQUESTS_ERROR
    });
  });
});
