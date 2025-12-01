'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Welcome() {
    return (
        <div className="relative h-full w-full overflow-hidden">
            <Background />
            <BackgroundFX />
            <div className="relative z-10 h-full w-full p-6 md:p-10 pb-24 md:pb-28">
                <div className="mx-auto h-full max-w-7xl grid grid-cols-12 gap-8">
                 
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="col-span-12 xl:col-span-7 flex flex-col justify-center"
                    >
                      

                        <h1 className="text-white flex flex-col md:text-4xl font-extrabold leading-[1.05]">
                            Bem-vindo ao <span className="text-emerald-400 text-5xl">PCP - Cerbras</span>
                        </h1>

                        <p className="text-gray-200 mt-4 text-base md:text-lg max-w-2xl">
                           Sistema de Planejamento e Controle da Produção

                        </p>
                       
                    </motion.div>

                    {/* RIGHT */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="col-span-12 xl:col-span-5 flex items-center"
                    >
                        {/* <MockPanel /> */}
                    </motion.div>

                    {/* FOOTER */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="col-span-12 absolute bottom-0 left-0 w-full px-6 md:px-10 py-3
                        flex flex-wrap items-center justify-between
                        text-[11px] text-gray-300">
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-2px rounded bg-white/10 text-gray-100 ring-1 ring-white/20">
                                Enter
                            </kbd>
                            para acessar
                        </div>

                        <div className="opacity-90">SIC – PCP • Todos os direitos reservados.</div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

/* =============== Fundo com foto + overlays =============== */
function Background() {
    return (
        <div className="absolute inset-0 -z-20">
            {/* foto */}
            <Image
                src="/fabrica.jpg"
                alt="Frota Cerbras"
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            {/* escurecimento geral */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-transparent" />

            {/* gradiente sutil (mais escuro no canto superior direito) */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-black/70 via-black/30 to-transparent" />
        </div>
    );
}

/* =============== Efeitos de fundo (acima da foto) =============== */
function BackgroundFX() {
    const [dots, setDots] = useState<Array<{ top: number; left: number }>>([]);

    useEffect(() => {
        setDots(Array.from({ length: 30 }, () => ({ top: Math.random() * 100, left: Math.random() * 100 })));
    }, []);

    return (
        <>
            {/* glows */}
            <div className="absolute -top-28 -right-20 h-38rem w-38rem rounded-full blur-3xl -z-10"
                style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,.28), transparent 60%)' }} />
            <div className="absolute bottom-0 left-0 h-28rem w-28rem rounded-full blur-3xl -z-10"
                style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,.18), transparent 55%)' }} />

            {/* grid */}
            <div className="absolute inset-0 opacity-[.08] pointer-events-none -z-10"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.8) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,.95) 0%, rgba(0,0,0,.65) 60%, transparent 90%)',
                }} />

            {/* partículas */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                {dots.map((d, i) => (
                    <span key={i} className="absolute h-2px w-2px rounded-full bg-white/60"
                        style={{ top: `${d.top}%`, left: `${d.left}%` }} />
                ))}
            </div>
        </>
    );
}



