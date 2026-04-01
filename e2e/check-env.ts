export const checkIsDevelopment = () => {
  // if (process.env.NODE_ENV !== 'development') {
  //   throw new Error('NODE_ENV is not development');
  // }
  console.log(`>>>> Running in :: ${process.env.NODE_ENV}`);
};
