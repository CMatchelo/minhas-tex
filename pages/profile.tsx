import Layout from "../src/components/template/Layout";
import Image from "next/image";
import React from "react";
import useAuth from "../src/data/hook/useAuth";
import Button from "../src/components/template/Button";
import userLogo from "../public/avatar.svg";
import { IconLogout } from "../src/components/icons";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <Layout title="Perfil" subtitle="Seus dados de acesso">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-white dark:bg-gray-700 shadow p-6">
          <Image
            src={user?.imageUrl ?? userLogo.src}
            alt={user?.name ?? "Avatar"}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-yellow-500/30"
            unoptimized
          />
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {user?.name ?? "Usuário"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
          </div>

          <dl className="w-full text-sm divide-y divide-gray-200 dark:divide-gray-600">
            <div className="flex justify-between py-2">
              <dt className="text-gray-500 dark:text-gray-400">Provedor</dt>
              <dd className="font-medium">{user?.provider ?? "—"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-500 dark:text-gray-400">ID</dt>
              <dd className="font-mono text-xs break-all text-right ml-4">{user?.uid ?? "—"}</dd>
            </div>
          </dl>

          <Button color="red" className="w-full" onClick={logout}>
            {IconLogout} Sair da conta
          </Button>
        </div>
      </div>
    </Layout>
  );
}
