const { createClient } = require('@supabase/supabase-js');

// Ensure env vars are present
function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const supabase = createClient(
  requireEnv('SUPABASE_URL'),
  requireEnv('SUPABASE_SERVICE_ROLE_KEY')
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { email, referrer, utm, userAgent, locale, tzOffsetMin } = req.body || {};

    const emailOk = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    let utmObj = {};
    try {
      const params = new URLSearchParams(typeof utm === 'string' ? utm : '');
      for (const [k, v] of params.entries()) utmObj[k] = v;
    } catch (_) {}

    const insert = {
      email,
      referrer: referrer || null,
      utm_params: Object.keys(utmObj).length ? utmObj : null,
      user_agent: userAgent || null,
      locale: locale || null,
      tz_offset_min: Number.isFinite(tzOffsetMin) ? tzOffsetMin : null
    };

    const { error } = await supabase.from('subscribers').insert(insert);
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ ok: false, error: 'DB error' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Subscribe handler error:', e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
