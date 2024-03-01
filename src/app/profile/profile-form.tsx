'use client'
import { useCallback, useEffect, useState } from 'react'

import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../_lib/definitions'

export default function ProfileForm({ user }: { user: User | null }) {
    const supabase = createClientComponentClient<Database>()
    const [loading, setLoading] = useState(true)
    const [fullname, setFullname] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [website, setWebsite] = useState<string | null>(null)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, avatar_url`)
                .eq('id', user?.id || "")
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFullname(data.full_name)
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert('Error loading user data!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])

    async function updateProfile({
        username,
        website,
        avatar_url,
    }: {
        username: string | null
        fullname: string | null
        website: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                full_name: fullname,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    // <div className="mb-5 w-full flex">
    //         <select {...register("birthyear", {
    //               required: true,
    //             })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //             required>
    //             {Array.from({ length: new Date().getFullYear() - 1970 - 20 + 1 }, (_, i) => 1970 + i).map(year => (
    //               <option key={year} value={year}>{year}</option>
    //             ))}
    //           </select>
    //           {errors.birthyear?.type === 'required' && (
    //             <p role="alert">Please enter your birthyear</p>
    //           )}    
    //           <select {...register("birthmonth", {
    //               required: true,
    //             })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //             required>
    //             <option value="Jan">Jan</option>
    //             <option value="Feb">Feb</option>
    //             <option value="Mar">Mar</option>
    //             <option value="Apr">Apr</option>
    //             <option value="May">May</option>
    //             <option value="Jun">Jun</option>
    //             <option value="Jul">Jul</option>
    //             <option value="Aug">Aug</option>
    //             <option value="Sep">Sep</option>
    //             <option value="Oct">Oct</option>
    //             <option value="Nov">Nov</option>
    //             <option value="Dec">Dec</option>
    //           </select>
    //           {errors.birthmonth?.type === 'required' && (
    //             <p role="alert">Please enter your birthmonth</p>
    //           )}
    //         </div>

    return (
        <div className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user?.email} disabled />
            </div>
            <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                    id="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button
                    className="button primary block"
                    onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <form action="/auth/logout" method="post">
                    <button className="button block" type="submit">
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    )
}