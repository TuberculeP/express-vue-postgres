/**
 * TypeORM wraps the driver's unique-violation error without a portable way to
 * know which column caused it, so we fall back to matching the raw driver
 * message/detail against the candidate field names.
 */
export function getConflictingUniqueField(
  err: unknown,
  fields: string[],
): string | null {
  const detail = String(
    (err as { driverError?: { detail?: string } })?.driverError?.detail ??
      (err as { message?: string })?.message ??
      "",
  );

  return fields.find((field) => detail.includes(field)) ?? null;
}
