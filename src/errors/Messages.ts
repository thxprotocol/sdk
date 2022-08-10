import ErrorCode from './ErrorCode';

const MESSAGE: { [key: string]: string | Function } = {
  [ErrorCode.NOT_IMPLEMENTED]: (what: string, name: string) =>
    `Method ${what} not implemented on ${name}.`,
};

export default MESSAGE;
