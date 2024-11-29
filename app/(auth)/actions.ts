'use server';

import { db } from '@/db';
import { userSelectSchema } from '@/db/schema/users';
import { env } from '@/env';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const AUTH_COOKIE_NAME = 'auth_cookie';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

type AuthCookiePayload = {
  userId: number;
};

async function createSession({ userId }: AuthCookiePayload) {
  const session = await getIronSession<{ userId: number }>(await cookies(), {
    cookieName: AUTH_COOKIE_NAME,
    password: env.SESSION_SECRET,
    ttl: AUTH_COOKIE_MAX_AGE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  });
  session.userId = userId;
  await session.save();
}

async function getUserSession() {
  const session = await getIronSession<AuthCookiePayload>(await cookies(), {
    cookieName: AUTH_COOKIE_NAME,
    password: env.SESSION_SECRET,
  });

  return session;
}

async function destroySession() {
  const session = await getIronSession<AuthCookiePayload>(await cookies(), {
    cookieName: AUTH_COOKIE_NAME,
    password: env.SESSION_SECRET,
  });

  await session.destroy();
}

async function updateSession({ userId }: AuthCookiePayload) {
  const session = await getIronSession<AuthCookiePayload>(await cookies(), {
    cookieName: AUTH_COOKIE_NAME,
    password: env.SESSION_SECRET,
  });

  session.userId = userId;
  await session.save();
}

const getUser = cache(async () => {
  const session = await getUserSession();
  if (session) {
    const user = await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, session.userId);
      },
    });

    if (user) {
      return userSelectSchema.parse(user);
    }
    return null;
  }
  return null;
});

async function requireUser() {
  const session = await getUserSession();
  if (!session.userId) {
    redirect('/login');
  }
  const user = await getUser();
  return user;
}

async function logOut() {
  await destroySession();
}

async function logoutAndRedirect() {
  await logOut();
  redirect('/login');
}

export {
  createSession,
  logOut,
  requireUser,
  getUser,
  logoutAndRedirect,
  updateSession,
};
