export const textBase = {
  fontFamily: "Raleway",
  fontWeight: "normal" as "normal",
  fontStyle: "normal",
  fontStretch: "normal",
  letterSpacing: "normal",
  color: "white",
  margin: 0,
};

export const headingOne = {
  ...textBase,
  fontFamily: "Libre Baskerville",
  fontSize: 48,
  fontWeight: "bold" as "bold",
  lineHeight: 1.27,
  letterSpacing: -0.1,
};

export const headingTwo = {
  ...textBase,
  fontFamily: "Libre Baskerville",
  fontSize: 22,
  fontWeight: "bold" as "bold",
  lineHeight: 1.45,
};

export const headingThree = {
  ...textBase,
  // fontFamily: 'Inter UI, sans-serif',
  fontSize: 17,
  fontWeight: 500,
  lineHeight: 1.24,
};

export const headingFour = {
  ...textBase,
  // fontFamily: 'Inter UI, sans-serif',
  fontSize: 15,
  lineHeight: 1.33,
  color: "white",
};

export const headingFive = {
  ...textBase,
  // fontFamily: 'Inter UI, sans-serif',
  fontSize: 11,
  lineHeight: 1.64,
};

export const paragraph = {
  ...textBase,
  // fontFamily: 'Inter UI, sans-serif',
  fontSize: 17,
  lineHeight: 1.29,
};

export const small = {
  ...headingFour,
  margin: 0,
  display: "block",
};

export const tiny = {
  ...headingFive,
  fontSize: 10,
  letterSpacing: 0,
};

export const label = headingFive;

export const largeButtonText = {
  ...textBase,
  fontFamily: "Verlag, sans-serif",
  fontSize: 18,
  fontWeight: "bold" as "bold",
  lineHeight: 1.22,
  marginBottom: 0,
};

export const smallButtonText = {
  ...paragraph,
  marginBottom: 0,
};

export const strong = {
  color: "white",
  fontWeight: "bold" as "bold",
};
