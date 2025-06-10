import { supabase } from '../lib/supabase'

export const testAuth = async () => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpassword123',
  })
  console.log('Sign up:', { signUpData, signUpError })

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'testpassword123',
  })
  console.log('Sign in:', { signInData, signInError })

  const { data: { session } } = await supabase.auth.getSession()
  console.log('Current session:', session)

  const { error: signOutError } = await supabase.auth.signOut()
  console.log('Sign out:', { signOutError })
}
