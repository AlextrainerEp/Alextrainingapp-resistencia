const FUNCION_STRAVA = 'https://xnqksbpwsqdgngaskbpx.supabase.co/functions/v1/strava-funcion-ts';
const STRAVA_CLIENT_ID = '295862';
const SUPABASE_KEY = 'sb_publishable_3cFWXykjHyxsdo65c2CZkA_8dM6U-HF';
const REDIRECT = 'https://alextrainerep.github.io/Alextrainingapp-resistencia/';

// Token de la sesión del entrenador/atleta (lo guarda supabase-js en sessionStorage)
function tokenSesion() {
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
      try { return JSON.parse(sessionStorage.getItem(k)).access_token; } catch (e) {}
    }
  }
  return null;
}

document.getElementById('conectarStrava').addEventListener('click', () => {
  if (!tokenSesion()) return alert('Entra en la app con tu cuenta antes de conectar Strava.');
  const url = 'https://www.strava.com/oauth/authorize?client_id=' + STRAVA_CLIENT_ID +
    '&response_type=code' +
    '&redirect_uri=' + encodeURIComponent(REDIRECT) +
    '&approval_prompt=force&scope=read,activity:read';
  window.location = url;
});

(async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) return;
  const sesion = tokenSesion();
  if (!sesion) return alert('Entra en la app con tu cuenta y vuelve a pulsar "Conectar con Strava".');
  try {
    const r = await fetch(FUNCION_STRAVA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + sesion
      },
      body: JSON.stringify({ code })
    });
    const datos = await r.json();
    if (!r.ok) throw new Error(datos.message || datos.error || 'Error ' + r.status);
    alert('Strava conectado correctamente' + (datos.athlete ? ', ' + datos.athlete : ''));
    history.replaceState(null, '', window.location.pathname);
  } catch (e) {
    alert('No se pudo conectar con Strava: ' + e.message);
  }
})();
