import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

export interface ExternalLinkProps
  extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string;
}

export function ExternalLink({ href, ...rest }: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as unknown as React.ComponentProps<typeof Link>['href']}
      onPress={(event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          WebBrowser.openBrowserAsync(href);
        }
      }}
    />
  );
}
