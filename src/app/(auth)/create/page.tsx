'use client';

import Image from "next/image";
import '@/app/styles/login.css';

import { z } from "zod";
import toast from 'react-hot-toast';
import { createUser } from "@/app/libs/credentials";
import { LoginCredentials } from "../login/page";
import { redirect } from "next/navigation";

import f1logo from '@/assets/f1logo.png';
import icon from '@/assets/icon.png';
import padlock from '@/assets/padlock.png';

const CreateUserSchema = z.object({
    email: z.string().trim().email('Email com formato incorreto'),
    password: z.string({ message: 'Insira uma senha' }).trim().min(4, { message: 'Senha precisa no mínimo 4 caracteres' }),
    confPassword: z.string({ message: 'Insira uma confirmação de senha' }).trim().min(1, { message: 'O campo Confirmar Senha não pode ser vazia' }),
}).refine((data) => data.password === data.confPassword, {
    message: "Senhas não são iguais!",
    path: ["confPassword"]
});

export default function CreateUser() {
    const createUserClient = async (formData: FormData) => {
        const createUserData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confPassword: formData.get('conf-password') as string
        }

        const result = CreateUserSchema.safeParse(createUserData);

        if (!result.success) {
            let errorMsg = "";
            result.error.issues.forEach((issue) => {
                errorMsg = errorMsg + issue.message + '. ';
            })
            toast.error(errorMsg);
            return;
        }

        const retorno = await createUser(createUserData as LoginCredentials);

        if (retorno.error) {
            toast.error(retorno.error);
            return;
        } else if (retorno.success) {
            toast.success(retorno.success);
            redirect('/login');
        }
    }

    return (
        <div className='login-page'>
            <div className="login-form-wrapper">
                <form className="login-form" action={createUserClient}>
                    <div className="titles">
                        <h1 className="main-title">F1 PILOT MANAGER</h1>
                        <p className="subtitle">Crie sua conta</p>
                    </div>

                    <div className="f1-logo">
                        <Image
                            src={f1logo}
                            alt="Logo da Fórmula 1"
                            width={100}
                            height={100}
                        />
                    </div>

                    <div className="input-fields">
                        <div className="input-field">
                            <div className="input-icon">
                                <Image
                                    src={icon}
                                    alt="Ícone de email"
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
                                required
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
                                required
                            />
                        </div>

                        <div className="input-field">
                            <div className="input-icon">
                                <Image
                                    src={padlock}
                                    alt="Ícone de confirmar senha"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <input
                                type="password"
                                name="conf-password"
                                id="conf-password"
                                placeholder="CONFIRMAR SENHA"
                                className="form-input"
                                aria-label="Confirmar Senha"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        CADASTRAR
                    </button>

                    <div className="register-section">
                        <p className="register-text">
                            Já tem conta?{' '}
                            <a href="/login" className="register-link">Voltar para login</a>  
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}