import 'react-native-url-polyfill/auto';
import { Session, User, createClient } from '@supabase/supabase-js';
import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { useTypedDispatch } from '../../store/store';
import { setUserID, selectUserID } from '../../store/systemSlice';
import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import { fetchProfile } from '../../store/profileSlice';

export interface AuthSessionState {
  session: Session | null
  user: User | null,
  isReady: boolean
  signIn: (email: string, pass: string) => Promise<void>
  signOut: () => Promise<void>
  getSession: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const initialState = {
  session: null as Session | null,
  user: null as User | null,
  isReady: false,
} as AuthSessionState


export const AuthSessionContext = createContext(initialState);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const dispatch = useTypedDispatch();

  return(
    <AuthSessionContext.Provider
      value={{
        ...state,
        signIn: async (email, password) => {

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            Alert.alert(error.message);
            return;
          }

          //console.log("User ID: ", data?.session?.user?.id) User ID is received from login, need to get profile using the ID

          // Update our Redux store with the new user ID and associated profile info
          dispatch(setUserID(data?.session?.user?.id));
          

          // Update our local context state
          setState({
            ...state,
            session: data.session,
            user: data.user,
            isReady: true
          });
        },
        signOut: async () => {
          await supabase.auth.signOut();

          // Update our Redux store with the new user ID
          dispatch(setUserID(null));

          // Update our local context state
          setState({
            ...state,
            session: null,
            user: null,
            isReady: true
          });
        },
        getSession: async () => {
          // Attempt to get the session from Supabase
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            Alert.alert(error.message);
            return;
          }

          // Update our Redux store with the new user ID
          dispatch(setUserID(data?.session?.user?.id));
          

          // Update our local context state
          setState({
            ...state,
            session: data.session,
            user: data?.session?.user ?? null,
            isReady: true
          });
        },
        forgotPassword: async (email) => {
          // Attempt to send user email reset link and redirect
          const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://osu-fsf.vercel.app/auth/resetPassword'
          });  

          if (error) {
            Alert.alert(error.message);
            return;
          }

        }
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthSessionContext);
  if (context === undefined)
    throw Error('useAuth must be used within AuthProvider');
  return context;
}