export function toString(
  number: number,
  locale = "default",
  decimals = 2,
): string {
  const formatter = getFormatter(locale, decimals);
  return formatter.numberFormat.format(Math.trunc(number * 100) / 100);
}

export function toNumber(
  number: string,
  locale = "default",
  decimals = 2,
): number {
  const formatter = getFormatter(locale, decimals);
  if (formatter.regexWithSeparator.test(number))
    return +number
      .replace(new RegExp(`\\${formatter.thousandSeparator}`, "g"), "")
      .replace(formatter.decimalSeparator, ".");

  if (formatter.regexWithoutSeparator.test(number))
    return +number.replace(formatter.decimalSeparator, ".");

  return NaN;
}

function findThousandSeparator(test: string, decimalSeparator: string): string {
  for (let i = 0; i < test.length; i++) {
    const character = test.charAt(i);
    if (!isNaN(+character)) continue;
    if (character === decimalSeparator) continue;
    return character;
  }
  return "";
}

function getFormatter(locale: string, decimals: number) {
  if (globalThis.__AGUSMGARCIA_REACT_CORE_FORMATTERS__ === undefined)
    globalThis.__AGUSMGARCIA_REACT_CORE_FORMATTERS__ = {};

  const formatter =
    globalThis.__AGUSMGARCIA_REACT_CORE_FORMATTERS__[`${locale}--${decimals}`];
  if (formatter !== undefined) return formatter;

  const numberFormat = new Intl.NumberFormat(
    locale !== "default" ? locale : undefined,
    {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    },
  );

  const test = numberFormat.format(1000.2);
  const decimalSeparator = test[test.length - 3];
  const thousandSeparator = findThousandSeparator(test, decimalSeparator);
  const patternWithSeparator = `^(\\d{1,3})(\\${thousandSeparator}\\d{3,3}){0,}(\\${decimalSeparator}\\d{${decimals},${decimals}}){0,1}$`;
  const patternWithoutSeparator = `^(\\d{1,})(\\${decimalSeparator}\\d{${decimals},${decimals}}){0,1}$`;

  return {
    decimalSeparator,
    numberFormat,
    regexWithoutSeparator: new RegExp(patternWithoutSeparator, "g"),
    regexWithSeparator: new RegExp(patternWithSeparator, "g"),
    thousandSeparator,
  };
}

declare global {
  var __AGUSMGARCIA_REACT_CORE_FORMATTERS__:
    | Record<
        string,
        {
          decimalSeparator: string;
          numberFormat: Intl.NumberFormat;
          pattern: string;
          regexWithoutSeparator: RegExp;
          regexWithSeparator: RegExp;
          thousandSeparator: string;
        }
      >
    | undefined;
}
