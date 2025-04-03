"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import i18n from "../../../i18n";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { headerStyles } from "../../../library/styles/splash/components/headerStyles";

export default function Header() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  return (
    <header className={headerStyles.header}>
      {!session ? (
        <button
          onClick={() => signIn("auth0")}
          className={headerStyles.loginButton}
        >
          {t("login")}
        </button>
      ) : (
        <div className={headerStyles.userContainer}>
          <Image
            src={session.user?.image || "/placeholder-avatar.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className={headerStyles.avatar}
          />
          <button
            onClick={() => signOut()}
            className={headerStyles.logoutButton}
          >
            {t("logout")}
          </button>
        </div>
      )}
    </header>
  );
}
