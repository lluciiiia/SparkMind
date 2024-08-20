'use server';

import { getErrorRedirect, getStatusRedirect, getURL } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuthTypes } from './settings';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get('pathName')).trim();

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  let toastMessage: { type: 'success' | 'error'; message: string };

  if (error) {
    return getErrorRedirect(
      pathName,
      'Hmm... Something went wrong.',
      'You could not be signed out.',
    );
    toastMessage = {
      type: 'error',
      message: 'Hmm... Something went wrong You could not be signed out.',
    };
  }

  return '/signin';
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;
  let toastMessage: { type: 'success' | 'error'; message: string };

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Invalid email address.',
      'Please try again.',
    );
    toastMessage = { type: 'error', message: 'Invalid email address. Please try again.' };
  }

  const supabase = createClient();
  const options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true,
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'You could not be signed in.',
      error.message,
    );
    toastMessage = { type: 'error', message: 'Sign in failed. Please try again.' };
  } else if (data) {
    cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
    redirectPath = getStatusRedirect(
      '/signin/email_signin',
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true,
    );
    toastMessage = {
      type: 'success',
      message: 'Please check your email for a password reset link.',
    };
  } else {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.',
    );
    toastMessage = {
      type: 'error',
      message: 'Something went wrong. Password reset email could not be sent.',
    };
  }

  return { redirectPath, toastMessage };
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email')).trim();
  let redirectPath: string;
  let toastMessage: { type: 'success' | 'error'; message: string };

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Invalid email address.',
      'Please try again.',
    );
    toastMessage = { type: 'error', message: 'Invalid email address. Please try again.' };
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL,
  });

  if (error) {
    redirectPath = getErrorRedirect('/signin/forgot_password', error.message, 'Please try again.');
    toastMessage = { type: 'error', message: 'Password reset failed. Please try again.' };
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/signin/forgot_password',
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true,
    );
    toastMessage = {
      type: 'success',
      message: 'Please check your email for a password reset link.',
    };
  } else {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.',
    );
    toastMessage = {
      type: 'error',
      message: 'Something went wrong. Password reset email could not be sent.',
    };
  }

  return { redirectPath, toastMessage };
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = cookies();

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;
  let toastMessage: { type: 'success' | 'error'; message: string };

  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    redirectPath = getErrorRedirect('/signin/password_signin', 'Sign in failed.', error.message);
    toastMessage = { type: 'error', message: 'Sign in failed. Please try again.' };
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', { path: '/' });
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
    toastMessage = { type: 'success', message: 'You are now signed in.' };
  } else {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.',
    );
    toastMessage = { type: 'error', message: 'Something went wrong. You could not be signed in.' };
  }

  return { redirectPath, toastMessage };
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  let toastMessage: { type: 'success' | 'error'; message: string };

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Invalid email address.',
      'Please try again.',
    );
    toastMessage = { type: 'error', message: 'Invalid email address. Please try again.' };
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (error) {
    redirectPath = getErrorRedirect('/signin/signup', 'Sign up failed.', error.message);
    toastMessage = { type: 'error', message: `Sign up failed: ${error.message}` };
  } else if (data.session) {
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
    toastMessage = { type: 'success', message: 'Success! You are now signed in.' };
  } else if (data.user && data.user.identities && data.user.identities.length == 0) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Sign up failed.',
      'There is already an account associated with this email address. Try resetting your password.',
    );
    toastMessage = {
      type: 'error',
      message:
        'There is already an account associated with this email address. Try resetting your password.',
    };
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Please check your email for a confirmation link. You may now close this tab.',
    );
    toastMessage = {
      type: 'success',
      message: 'Please check your email for a confirmation link. You may now close this tab.',
    };
  } else {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Hmm... Something went wrong.',
      'You could not be signed up.',
    );
    toastMessage = {
      type: 'error',
      message: 'Hmm... Something went wrong. You could not be signed up.',
    };
  }

  return { redirectPath, toastMessage };
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;
  let toastMessage: { type: 'success' | 'error'; message: string };

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Your password could not be updated.',
      'Passwords do not match.',
    );
    toastMessage = { type: 'error', message: 'Passwords do not match.' };
    return { redirectPath, toastMessage };
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Your password could not be updated.',
      error.message,
    );
    toastMessage = { type: 'error', message: 'Your password could not be updated.' };
  } else if (data.user) {
    redirectPath = getStatusRedirect('/', 'Success!', 'Your password has been updated.');
    toastMessage = { type: 'success', message: 'Your password has been updated.' };
  } else {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.',
    );
    toastMessage = {
      type: 'error',
      message: 'Something went wrong. Your password could not be updated.',
    };
  }

  return { redirectPath, toastMessage };
}
