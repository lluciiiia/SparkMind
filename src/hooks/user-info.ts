'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export const useUserInfo = (): {
  userName: string | null;
  userEmail: string | null;
  avatarUrl: string | null;
} => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user data:', error.message);
          return;
        }

        const name = data.user?.user_metadata.name;
        const avatar = data.user?.user_metadata.avatar_url;
        const email = data.user?.email;
        setUserEmail(email || 'johndoe@gmail.com');
        setUserName(name || 'johndoe');
        setAvatarUrl(avatar || null);
      } catch (err) {
        console.error('Error in getUserInfo:', (err as Error).message);
      }
    }

    getUserInfo();
  }, []);

  return { userName, userEmail, avatarUrl };
};
