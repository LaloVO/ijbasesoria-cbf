import { useEffect } from 'react';

const AnalyticsTracker = () => {
  useEffect(() => {
    const key = (import.meta.env.VITE_CBF_API_KEY as string | undefined)?.trim();
    if (!key || key === 'cbf_live_PENDING_UUID') return;
    if (document.querySelector('script[data-homepty-cbf-tracker]')) return;

    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://homepty-cbf-tite-testing-chi.vercel.app/track.js';
    script.dataset.key = key;
    script.dataset.homeptyCbfTracker = 'true';
    document.body.appendChild(script);

    return () => script.remove();
  }, []);

  return null;
};

export default AnalyticsTracker;
