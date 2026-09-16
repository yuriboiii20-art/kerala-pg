import useScrollLock from '../hooks/useScrollLock';
import { useEffect, useRef, useState } from 'react';
import { Player } from '@remotion/player';
import { LOGO_DURATION, LogoAnimation } from './KeralamLogo';
import './keralam-intro.css';

export default function KeralamIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });

  const player = useRef(null);
  const overlay = useRef(null);
  useScrollLock(visible);

  const dismiss = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const instance = player.current;
    const onFrame = ({ detail }) => {
      if (overlay.current) overlay.current.style.opacity = String(Math.min(1, Math.max(0, (LOGO_DURATION - 1 - detail.frame) / 30)));
    };
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { if (preference.matches) dismiss(); };
    instance?.addEventListener('ended', dismiss);
    instance?.addEventListener('error', dismiss);
    instance?.addEventListener('frameupdate', onFrame);
    preference.addEventListener('change', onPreference);

    // Fail open safely after 2.1s max (increased speed by 1s)
    const timeout = window.setTimeout(dismiss, 2100);
    return () => {
      instance?.removeEventListener('ended', dismiss);
      instance?.removeEventListener('error', dismiss);
      instance?.removeEventListener('frameupdate', onFrame);
      preference.removeEventListener('change', onPreference);
      window.clearTimeout(timeout);
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div ref={overlay} className="keralam-intro" data-testid="keralam-intro">
      <div className="keralam-intro__ambient" aria-hidden="true"/>
      <div className="keralam-intro__content">
        <p className="keralam-intro__welcome">WELCOME HOME</p>
        <Player
          ref={player}
          component={LogoAnimation}
          durationInFrames={LOGO_DURATION}
          compositionWidth={1400}
          compositionHeight={600}
          fps={60}
          autoPlay
          initiallyMuted
          numberOfSharedAudioTags={0}
          controls={false}
          loop={false}
          moveToBeginningWhenEnded={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}


