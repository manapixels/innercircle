
import ProfileForm from './_components/profile-form'
import { createClient } from '../_utils/supabase/server';
import EmailForm from './_components/email-form';
import PasswordForm from './_components/password-form';

export default async function Profile() {

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">Profile</h3>
      <ProfileForm userId={user?.id} />
      <h3 className="text-lg font-medium mt-8 mb-4">Account</h3>
      <EmailForm currEmail={user?.email} />
      <div className="mb-6"></div>
      <PasswordForm />
      
      </div>
    </div>
  );
}
