export function byNumberAsc(value1: number, value2: number): number {
  return value1 - value2;
}

export function byNumberDesc(value1: number, value2: number): number {
  return byNumberAsc(value2, value1);
}

export function byStringAsc(value1: string, value2: string): number {
  return +(value1 > value2) || -(value2 > value1);
}

export function byStringDesc(value1: string, value2: string): number {
  return byStringAsc(value2, value1);
}

export function byBooleanAsc(value1: boolean, value2: boolean): number {
  if (value1 && !value2) return -1;
  if (!value1 && value2) return 1;
  return 0;
}

export function byBooleanDesc(value1: boolean, value2: boolean): number {
  return byBooleanAsc(value2, value1);
}
