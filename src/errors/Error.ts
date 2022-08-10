import ErrorCode from './ErrorCode';
import MESSAGE from './Messages';

export default class THXError extends Error {
  code: string;

  constructor(code: string, ...args: any) {
    super(message(code, args));
    this.code = code;
  }

  get name() {
    return `${super.name} [${this.code}]`;
  }
}

/**
 * Format the message for an error.
 * @param {string} code The error code
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 * @ignore
 */
function message(code: string, args: any): string {
  if (!(code in ErrorCode)) throw new Error('Error code must be a valid THXErrorCode');
  const msg = MESSAGE[code];
  if (!msg) throw new Error(`No message associated with error code: ${code}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args?.length) return msg;
  args.unshift(msg);
  return String(...args);
}
