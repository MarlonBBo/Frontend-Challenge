export function multiplyDecimal(value: string, multiplier: number) {
  const [integer, fraction = ""] = value.split(".")
  const scale = 10n ** BigInt(fraction.length)
  const units = BigInt(`${integer}${fraction}`) * BigInt(multiplier)
  const resultInteger = units / scale
  const resultFraction = (units % scale).toString().padStart(fraction.length, "0")

  return fraction.length ? `${resultInteger}.${resultFraction}` : resultInteger.toString()
}

export function addDecimals(values: string[]) {
  const precision = Math.max(0, ...values.map((value) => value.split(".")[1]?.length ?? 0))
  const scale = 10n ** BigInt(precision)
  const total = values.reduce((sum, value) => {
    const [integer, fraction = ""] = value.split(".")
    return sum + BigInt(`${integer}${fraction.padEnd(precision, "0")}`)
  }, 0n)
  const integer = total / scale
  const fraction = (total % scale).toString().padStart(precision, "0")

  return precision ? `${integer}.${fraction}` : integer.toString()
}
