import crypto from 'node:crypto';

export function verifyTelegramInitData(
  initData: string,
  botToken: string
):
  | { ok: true; user?: { id: bigint }; data: Record<string, string> }
  | { ok: false; reason: string } {
  const params = new URLSearchParams(initData);
  const data: Record<string, string> = {};
  for (const [k, v] of params.entries()) data[k] = v;

  const receivedHash = data['hash'];
  if (!receivedHash) return { ok: false, reason: 'hash is missing' };
  delete data['hash'];

  const keys = Object.keys(data).sort();
  const dataCheckString = keys.map((k) => `${k}=${data[k]}`).join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calcHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calcHash !== receivedHash) return { ok: false, reason: 'invalid hash' };

  const authDate = Number(data['auth_date']);
  if (!Number.isFinite(authDate))
    return { ok: false, reason: 'invalid auth_date' };
  const now = Math.floor(Date.now() / 1000);

  let user: any = undefined;
  if (data.user) {
    try {
      user = JSON.parse(decodeURIComponent(data.user));
    } catch {}
  }

  return { ok: true, user, data };
}
