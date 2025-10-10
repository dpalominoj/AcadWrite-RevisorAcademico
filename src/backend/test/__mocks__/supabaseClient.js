import { jest } from '@jest/globals';

export const supabase = {
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn(() => ({
      data: {
        path: 'mock/path/to/file.pdf',
      },
      error: null,
    })),
    getPublicUrl: jest.fn(() => ({
      data: {
        publicUrl: 'http://example.com/mock-url',
      },
    })),
  },
};
