const patterns = [
  (service: string, place: string) => `${service} in ${place}`,
  (service: string, place: string) => `${place} ${service} installation`,
  (service: string, place: string) => `${service} for homes in ${place}`,
] as const;

export function generateTitle(input: {
  serviceName: string;
  placeName?: string;
  pattern?: number;
}): string {
  if (!input.placeName) {
    return input.serviceName;
  }

  const pattern = patterns[(input.pattern ?? 0) % patterns.length] ?? patterns[0];
  return pattern(input.serviceName, input.placeName);
}
