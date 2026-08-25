'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('')
  async function submit(e: FormEvent) { e.preventDefault(); setError(''); const result = await signIn.email({ email, password }); if (result.error) setError('Unable to sign in. Check your details.'); else { router.push('/'); router.refresh() } }
  return <main className="auth-shell"><form className="auth-card" onSubmit={submit}><div className="brand"><div className="brand-mark">✦</div><span>Mochi<span className="brand-accent">Mon</span></span></div><h1>Welcome back</h1><p>Sign in to keep your cozy progress synced.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<p className="form-error">{error}</p>}<button className="primary-button" type="submit">Sign in</button><a href="/sign-up">Create an account</a></form></main>
}
