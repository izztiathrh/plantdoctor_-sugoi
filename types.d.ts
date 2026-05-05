declare module 'jpeg-js' {
  type DecodeOptions = {
    useTArray?: boolean;
  };

  type DecodedJpeg = {
    width: number;
    height: number;
    data: Uint8Array;
  };

  const jpeg: {
    decode(data: Uint8Array, options?: DecodeOptions): DecodedJpeg;
  };

  export default jpeg;
}
