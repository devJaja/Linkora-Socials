export const WEB_URL =
  process.env.NEXT_PUBLIC_WEB_URL || 'https://linkora-socials.vercel.app'

export const APK_URL =
  process.env.NEXT_PUBLIC_APK_URL ||
  'https://expo.dev/accounts/devjaja/projects/linkora-socials/builds/3cfeba7e-a26c-495d-bbde-152c374d6800'

export const CONTACT_EMAIL = 'team@linkora.social'

export function externalProps(href: string) {
  const isMailto = href.startsWith('mailto:')
  return isMailto
    ? {}
    : { target: '_blank' as const, rel: 'noreferrer' as const }
}
