export function createWarn(message: string) {
  return {
    content: 'warn',
    args: [
      {
        type: 'argument',
        content: [
          {
            type: 'string',
            content: message,
          },
        ],
      },
    ],
  };
}
