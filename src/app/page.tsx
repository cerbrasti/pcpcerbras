'use client';
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { TypewriterEffect } from '@/app/components/ui/typewriter-effect';
import { FloatLabel } from 'primereact/floatlabel';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import Welcome from './components/internalBoard';
import { logarAction } from './actions/auth';


export default function LoginDesktop() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errors, setErrors] = useState<{ usuario?: string, senha?: string }>({});
  const [lembrarUsuario, setLembrarUsuario] = useState(false);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('usuario')) {
      setUsuario(localStorage.getItem('usuario') || '');
      setLembrarUsuario(true);
    }


  }, [])

  const logar = async () => {
    const newError: { usuario?: string; senha?: string } = {};
    if (!usuario) newError.usuario = "Usuário é obrigatório";
    if (!senha) newError.senha = "Senha é obrigatória";

    if (Object.keys(newError).length > 0) {
      setErrors(newError);
      return;
    }

    setErrors({});
    const result = await logarAction(usuario, senha);
    if (!result?.success) {
      const msg = result?.message || "Falha ao fazer login.";
      setErrors({ usuario: msg, senha: msg });
    }
    window.location.href = '/home';


  };
  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <Toast ref={toast} />
      <div className='z-10 absolute w-[400px]'>
        <Card className='h-screen relative  flex flex-col justify-center items-center ' onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter') { logar() } }}>
          <TypewriterEffect words={[
            { text: 'Login', className: 'text-green-500 text-4xl' },
          ]}
            className='' />

          <div className='mt-6'>
            <FloatLabel>
              <InputText
                id='usuario'
                type='text'
                value={usuario}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsuario(e.target.value)}
                style={{
                  borderColor: errors?.usuario ? 'red' : ''
                }}
                className='w-full' />
              <label htmlFor='usuario'>Informe seu usuário</label>
            </FloatLabel>
          </div>

          <div className='mt-6 w-full relative'>
            <FloatLabel>
              <InputText
                id='senha'
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                className='w-full pr-10'
                style={{
                  paddingRight: '2.5rem',
                  borderColor: errors?.senha ? 'red' : ''
                }} />
              <label htmlFor='senha'>Informe sua senha</label>
            </FloatLabel>
            <i className={`pi ${mostrarSenha ? 'pi-eye-slash' : 'pi-eye'} absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`}
              onClick={() => setMostrarSenha((prev) => !prev)}
              style={{
                fontSize: '1.2rem',
                color: '#666',
                pointerEvents: 'auto', // garante clique
                zIndex: 10 // se tiver overlay
              }}
            />
          </div>

          <div className='mt-6 flex justify-center w-full'>
            <Button
              label={loading ? 'Acessando...' : 'Acessar'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
              severity='success'
              className='w-full'
              onClick={() => { logar() }}
              disabled={loading} />
          </div>
        </Card>
      </div>
      <div className='pl-[400px] h-full'>
        <Welcome />
      </div>
    </div>
  )
}