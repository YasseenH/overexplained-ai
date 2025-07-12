export type Code = keyof typeof errors;

const errors = {
  "ERR-001": "{#key} is required.",
  "ERR-002": "{#key} is invalid.",
  "ERR-003": "Invalid Pubsub payload.",
};

export const getErrorDescription = (code: Code, key?: string) => {
  const template = errors[code as Code];
  const description = `${code}: ${template}`;

  if (key) {
    return description.replace("{#key}", key);
  }
  return description;
};

export class ErrorCode extends Error {
  code: Code;

  constructor(code: Code, key?: string) {
    const message = getErrorDescription(code, key);
    super(message);
    this.code = code;
  }
}
