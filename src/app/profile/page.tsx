
import ProfileForm from './profile-form'
import { createClient } from '../_utils/supabase/server';
import EmailForm from './email-form';
import PasswordForm from './password-form';

export default async function Profile() {

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="p-24">
      <EmailForm _email={user?.email} />
      <PasswordForm />
      <ProfileForm userId={user?.id} />
    </div>
  );
}
