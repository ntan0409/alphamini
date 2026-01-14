import { redirect } from 'next/navigation'

export default function SettingsPage() {
  // Redirect to token pricing by default
  redirect('/admin/settings/token-price')
}