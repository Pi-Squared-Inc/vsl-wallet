import { describe, expect, it } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';

describe('onRpcRequest', () => {
  describe('Invalid method', () => {
    it('throws an error if the requested method does not exist', async () => {
      const { request } = await installSnap();

      const response = await request({
        method: 'foo',
      });

      expect(response).toRespondWithError({
        code: -32601,
        data: {
          cause: 'Invalid Snap RPC Method: foo',
          method: 'foo',
        },
        message: 'Invalid Snap RPC Method: foo',
        stack: expect.any(String),
      });
    });
  })

  describe('getBalance', () => {
    it('throws an error if there is no params', async () => {
      const { request } = await installSnap();

      const origin = 'Jest';
      const response = await request({
        method: 'getBalance',
        origin
      });

      expect(response).toRespondWithError({
        code: -32602,
        message: 'Invalid parameters for Snap method getBalance',
        data: {
          cause: 'Invalid parameters for Snap method getBalance',
          method: 'getBalance',
          issues: [{
            code: 'invalid_type',
            expected: 'object',
            message: expect.any(String),
            path: [],
          }]
        },
        stack: expect.any(String),
      });
    });

    it('throws an error if no address is supplied', async () => {
      const { request } = await installSnap();

      const origin = 'Jest';
      const response = await request({
        method: 'getBalance',
        params: {},
        origin
      })

      expect(response).toRespondWithError({
        code: -32602,
        message: 'Invalid parameters for Snap method getBalance',
        data: {
          cause: 'Invalid parameters for Snap method getBalance',
          method: 'getBalance',
          issues: [{
            code: 'invalid_type',
            expected: 'string',
            message: expect.any(String),
            path: ['address'],
          }],
        },
        stack: expect.any(String),
      })
    });

    it('retrieves the balance of 0 for an empty address', async () => {
      const { request } = await installSnap();

      const origin = 'Jest';
      const address = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';

      const response = await request({
        method: 'getBalance',
        params: { address },
        origin
      });

      expect(response).toRespondWith('0x0')
    })
  });
});
