const splitCsv = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const publicDnsTargetIp = import.meta.env.VITE_PUBLIC_DNS_TARGET_IP ?? '';

export const allowedInstanceIpPrefixes = splitCsv(import.meta.env.VITE_ALLOWED_INSTANCE_IP_PREFIXES);

export const instanceIpPlaceholder =
  allowedInstanceIpPrefixes.length > 0 ? allowedInstanceIpPrefixes.map((prefix) => `${prefix}x`).join(' / ') : '인스턴스 IP';

export const instanceIpDescription =
  allowedInstanceIpPrefixes.length > 0
    ? `인스턴스 IP는 ${allowedInstanceIpPrefixes.join(', ')} 대역을 사용합니다`
    : '라우팅할 인스턴스 IP를 입력합니다';

export const isAllowedInstanceIp = (value: string): boolean =>
  allowedInstanceIpPrefixes.length === 0 || allowedInstanceIpPrefixes.some((prefix) => value.startsWith(prefix));

export const allowedInstanceIpMessage =
  allowedInstanceIpPrefixes.length > 0
    ? `인스턴스 IP는 ${allowedInstanceIpPrefixes.join(', ')} 대역을 사용해야 합니다`
    : '올바른 IP 주소를 입력해주세요';
