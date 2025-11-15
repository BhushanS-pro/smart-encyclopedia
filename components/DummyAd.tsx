import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  /** 'banner' | 'square' | 'large' - controls visual size */
  size?: 'banner' | 'square' | 'large' | 'responsive';
  /** ad slot id (AdSense `data-ad-slot`) */
  adUnitId?: string;
  /** AdSense publisher id (ca-pub-...) - if not provided a placeholder is used */
  pubId?: string;
  /** When true, render the real AdSense markup (`ins`) and call adsbygoogle.push - web only */
  useRealAds?: boolean;
};

/**
 * DummyAd
 * - Renders a visual placeholder by default (web only).
 * - When `useRealAds` is true, renders the real AdSense `ins` element and invokes
 *   `(adsbygoogle = window.adsbygoogle || []).push({})` to request the ad.
 * - On native platforms it renders nothing.
 */
export function DummyAd({
  size = 'responsive',
  adUnitId,
  pubId,
  useRealAds = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const adRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (useRealAds) {
      // Attempt to (re)load AdSense slot after the element mounts.
      // Ensure `adsbygoogle` exists and then push.
      const t = setTimeout(() => {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
          setLoaded(true);
        } catch (err) {
          // ignore - AdSense script might not be present or blocked
          setLoaded(false);
        }
      }, 50);

      return () => clearTimeout(t);
    }

    // If not using real ads, simulate load for visual placeholder
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, [useRealAds]);

  if (Platform.OS !== 'web') return null;

  const style: ViewStyle = [
    styles.container,
    size === 'banner' && styles.banner,
    size === 'square' && styles.square,
    size === 'large' && styles.large,
  ];

  if (useRealAds) {
    // Render real AdSense markup. NOTE: you must replace the placeholder
    // publisher id with your real `ca-pub-XXXXXXXX` in `app/+html.tsx` or
    // pass `pubId` prop to this component.
    return (
      <View style={style as any}>
        <ins
          className="adsbygoogle"
          ref={(el: any) => (adRef.current = el)}
          style={{ display: 'block', width: '100%' } as any}
          data-ad-client={pubId ?? 'ca-pub-REPLACE_WITH_YOUR_PUBID'}
          data-ad-slot={adUnitId ?? '0000000000'}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <Text style={styles.small}>{loaded ? 'Ad requested' : 'Requesting ad...'}</Text>
      </View>
    );
  }

  return (
    <View style={style as any}>
      <Text style={styles.label}>Sponsored</Text>
      <Text style={styles.title}>Sample Ad — Dummy AdSense</Text>
      <Text style={styles.small}>{adUnitId ? `adUnit: ${adUnitId}` : 'Test ad unit'}</Text>
      <Text style={styles.small}>{loaded ? 'Ad loaded' : 'Loading ad...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  banner: {
    width: '100%',
    height: 90,
  },
  square: {
    width: 300,
    height: 250,
  },
  large: {
    width: '100%',
    height: 300,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  small: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
  },
});

export default DummyAd;
