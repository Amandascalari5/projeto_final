'use client';

import '@/app/styles/login.css';
import Image from 'next/image';
import z from 'zod';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { validateCredentials } from '@/app/libs/credentials';

// Importando imagens diretamente de src/assets
import f1logo from '@/assets/f1logo.png';
import icon from '@/assets/icon.png';
import padlock from '@/assets/padlock.png';

export interface LoginCredentials {
  email: string;
  password: string;
}

const LoginSchema = z.object({
  email: z.string().trim().email('Email com formato incorreto'),
  password: z
    .string({ message: 'Insira uma senha' })
    .trim()
    .min(4, { message: 'Senha requer no mínimo 4 caracteres' })
});

export default function LoginPage() {
  const loginAction = async (formData: FormData) => {
    const loginData: LoginCredentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    const result = LoginSchema.safeParse(loginData);

    if (!result.success) {
      let errorMsg = '';
      result.error.issues.forEach((issue) => {
        errorMsg = errorMsg + issue.message + '. ';
      });
      toast.error(errorMsg);
      return;
    }

    const loginValidacao = await validateCredentials(loginData);

    if (loginValidacao) {
      toast.error(loginValidacao.error);
      return;
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-wrapper">
        <form className="login-form" action={loginAction}>
          <div className="titles">
            <h1 className="main-title">F1 PILOT MANAGER</h1>
            <p className="subtitle">Gerencie sua coleção de pilotos</p>
          </div>

          <div className="f1-logo">
            <Image
              src={f1logo}
              alt="Logo da Formula 1"
              width={100}
              height={100}
              className="logo-image"
              priority
            />
          </div>

          <div className="input-fields">
            <div className="input-field">
              <div className="input-icon">
                <Image
                  src={icon}
                  alt="Ícone de usuário"
                  width={24}
                  height={24}
                />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="EMAIL"
                className="form-input"
                aria-label="Email"
              />
            </div>

            <div className="input-field">
              <div className="input-icon">
                <Image
                  src={padlock}
                  alt="Ícone de senha"
                  width={24}
                  height={24}
                />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="SENHA"
                className="form-input"
                aria-label="Senha"
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            ENTRAR
          </button>

          <div className="register-section">
            <p className="register-text">
              Não tem conta?{' '}
              <Link href="/create" className="register-link">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
