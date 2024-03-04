
// import ProfileForm from './profile-form'
import { createClient } from '../_utils/supabase/server';

export default async function Profile() {

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <ProfileForm user={user} /> */}
      profile form
      {user?.email}
    </div>
  );
}
