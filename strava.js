const FUNCION_STRAVA = 'https://orrfqvrsrjfddhuzleel.supabase.co/functions/v1/strava-token';
const STRAVA_CLIENT_ID = '295862';
const SUPABASE_KEY = 'sb_publishable_PJeYDWMoLoRnZAT3o3jGWw_eBh5uwSR';
const REDIRECT = 'https://alextrainerep.github.io/Alextrainingapp-resistencia/';

// Botón: lleva a Strava para autorizar
document.addEventListener('click', (ev) => {
  if (!ev.target.closest('#conectarStrava')) return;
  window.location = 'https://www.strava.com/oauth/authorize?client_id=' + STRAVA_CLIENT_ID +
    '&response_type=code&redirect_uri=' + encodeURIComponent(REDIRECT) +
    '&approval_prompt=force&scope=read,activity:read';
});

// Al volver de Strava con ?code=..., lo cambiamos por tokens
(async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) return;
  try {
    const r = await fetch(FUNCION_STRAVA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      },
      body: JSON.stringify({ code })
    });
    const datos = await r.json();
    if (!r.ok) throw new Error(datos.message || datos.error || 'Error ' + r.status);
    alert('Strava conectado correctamente');
    history.replaceState(null, '', window.location.pathname);
  } catch (e) {
    alert('No se pudo conectar con Strava: ' + e.message);
  }
})();
