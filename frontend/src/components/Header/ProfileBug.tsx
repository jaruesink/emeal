import React from 'react';
import { useSession } from '../../state/session/SessionProvider';

export const ProfileBug = () => {
  const {
    state: {
      user: { avatar },
    },
  } = useSession();
  return (
    <div className='profile-bug'>
      <img src={avatar} alt='profile' />
    </div>
  );
};
