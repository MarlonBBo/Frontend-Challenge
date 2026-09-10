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

export function percentageOfDecimal(value: string, percentage: number, precision = 3) {
  const [integer, fraction = ""] = value.split(".")
  const sourceScale = 10n ** BigInt(fraction.length)
  const targetScale = 10n ** BigInt(precision)
  const units = BigInt(`${integer}${fraction}`)
  const result = units * BigInt(percentage) * targetScale / (100n * sourceScale)
  const resultInteger = result / targetScale
  const resultFraction = (result % targetScale).toString().padStart(precision, "0")
  return precision ? `${resultInteger}.${resultFraction}` : resultInteger.toString()
}

export function compareDecimals(left: string, right: string) {
  const precision = Math.max(left.split(".")[1]?.length ?? 0, right.split(".")[1]?.length ?? 0)
  const toUnits = (value: string) => {
    const [integer, fraction = ""] = value.split(".")
    return BigInt(`${integer}${fraction.padEnd(precision, "0")}`)
  }
  const difference = toUnits(left) - toUnits(right)
  return difference === 0n ? 0 : difference > 0n ? 1 : -1
}
