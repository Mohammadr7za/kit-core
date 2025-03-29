import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { lucia } from '@/auth';
import { db } from '@/db';
import {
  LogStatus,
  NewLog,
  users,
  UserStatus,
  verificationTokens,
} from '@/db/schema';
import AuthenticationEmail from '@/email-templates/authentication-email';
import { LogService } from '@/server/service/log.service';
import { render } from '@react-email/render';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { createDate, TimeSpan } from 'oslo';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { validateRequest } from '@/lib/utils/auth';
import { compareHash } from '@/lib/utils/crypt';
import { sendEmail } from '@/lib/utils/email';

import { UserService } from './user.service';

export const AuthService = {
  signOut: async () => {
    const { session } = await validateRequest();
    if (!session) {
      return;
    }
    await lucia.invalidateSession(session?.id);
    redirect('/login');
  },
  magicLogin: async (email: string) => {
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    const tempName = email.split('@')[0];
    if (!user) {
      user = await UserService.create({
        name: tempName,
        email,
        status: UserStatus.Inactive,
      });
    }
    const token = await AuthService.createEmailVerificationToken(
      user.id,
      email
    );

    const link = `${env.SITE_URL}/login/verify?token=${token}`;

    const html = await render(AuthenticationEmail(link));

    await sendEmail({
      to: email,
      subject: MESSAGES.MAGIC_LINK_EMAIL_SUBJECT,
      html,
    });

    return { ok: true };
  },
  mobileLogin: async (mobile: string, password: string) => {
    const header = await headers();
    const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

    let user = await db.query.users.findFirst({
      // where: and(eq(users.mobile, mobile), eq(users.password, password)),
      where: eq(users.mobile, mobile),
    });

    if (user) {
      let canLogin = await AuthService.canLogin(user, password);
      if (canLogin) {
        const token = await AuthService.createEmailVerificationToken(
          user.id,
          mobile
        );

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        const cookieStore = await cookies();

        cookieStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );

        let log: NewLog = {
          userId: user.id,
          title: 'Logged In',
          message: 'user Logged In',
          context: JSON.stringify({ mobile }).toString(),
          ip_address: ip,
          request_url: 'login',
          request_method: 'server action',
          status: LogStatus.Info,
        };
        await LogService.create(log);

        return { ok: true };
      }
    }

    let log: NewLog = {
      userId: null,
      title: 'Attempting to login',
      message: 'cant not logged in',
      context: JSON.stringify({ mobile }).toString(),
      ip_address: ip,
      request_url: 'login',
      request_method: 'server action',
      status: LogStatus.Warning,
    };
    await LogService.create(log);

    return { ok: false };
  },
  //NOTE : This will only be used for demo purpose
  demoLogin: async (email: string) => {
    const cookieStore = await cookies();

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    try {
      if (!user) {
        return new Response(null, {
          status: 400,
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return { ok: true };
    } catch (e) {
      console.error(e);
      return new Response(null, {
        status: 500,
      });
    }
  },
  canLogin: async (user: any, password: string) => {
    let res = await compareHash(password, user.password);
    if (user.status === UserStatus.Active && res) {
      return true;
    }

    return false;
  },

  createEmailVerificationToken: async (userId: string, email: string) => {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.userId, userId))
      .execute();

    const tokenId = generateId(40);
    await db
      .insert(verificationTokens)
      .values({
        id: tokenId,
        email: email,
        userId: userId,
        expiresAt: createDate(new TimeSpan(2, 'h')),
      })
      .execute();
    return tokenId;
  },
};
