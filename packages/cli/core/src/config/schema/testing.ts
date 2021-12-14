export const testing = {
  type: 'object',
  additionalProperties: false,
  properties: {
    // 'babel-jest' | 'ts-jest'
    transformer: { type: 'string', enum: ['babel-test', 'ts-jest'] },
  },
};
