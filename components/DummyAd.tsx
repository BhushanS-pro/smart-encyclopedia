import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  size?: 'banner' | 'square' | 'large' | 'responsive';
  adUnitId?: string;
  pubId?: string;
  useRealAds?: boolean;
};

/**
 * DummyAd Component
 * ------------------
 * - On mobile/native: renders nothing
 * - On web and useRealAds=false → renders placeholder dummy ad
 * - On web and useRealAds=true → loads REAL Google AdSense ad
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
      // Load Google AdSense after element mounts
      const t = setTimeout(() => {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
          setLoaded(true);
        } catch (err) {
          console.warn("AdSense load error:", err);
          setLoaded(false);
        }
      }, 200);

      return () => clearTimeout(t);
    }

    // Dummy ad loading animation
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

  // ================================
  // REAL GOOGLE ADSENSE MODE
  // ================================
  if (useRealAds) {
    return (
      <View style={style as any}>
        <ins
          className="adsbygoogle"
          ref={(el: any) => (adRef.current = el)}
          style={
            size === 'banner'
              ? { display: 'block', width: '100%', height: 90 }
              : { display: 'block', width: '100%' }
          }
          // YOUR REAL PUBLISHER ID
          data-ad-client={pubId ?? 'ca-pub-8947922622346274'}
          data-ad-slot={adUnitId ?? '0000000000'}
          data-ad-format={size === 'banner' ? 'horizontal' : 'auto'}
          {...(size !== 'banner'
            ? { 'data-full-width-responsive': 'true' }
            : {})}
        />
        <Text style={styles.small}>
          {loaded ? 'Ad requested' : 'Requesting ad...'}
        </Text>
      </View>
    );
  }

  // ================================
  // PLACEHOLDER (DUMMY) MODE
  // ================================
  return (
    <View style={style as any}>
      <Text style={styles.label}>Sponsored</Text>
      <Text style={styles.title}>Sample Ad — Dummy AdSense</Text>
      <Text style={styles.small}>
        {adUnitId ? `adUnit: ${adUnitId}` : 'Test ad unit'}
      </Text>
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
