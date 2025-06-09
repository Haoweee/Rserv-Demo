declare module 'creditcard.js' {
  interface CardType {
    type: string;
    niceType: string;
    patterns: number[];
    gaps: number[];
    lengths: number[];
    code: { name: string; size: number };
  }

  function creditCardType(cardNumber: string): CardType | undefined;

  export default creditCardType;
}
