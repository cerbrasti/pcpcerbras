'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import type { grupoDeProdutos } from '../types/grupoDeProdutos';
import type { Linhas } from '../types/Linhas';
import type { grupoLinhaProducao } from '../types/grupoLinhaProducao';
import * as API from '@/app/actions/api'
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';

type OrdemProducao = {
    id: string;
    produto: string;
    linha: string;
    turno: string;
    quantidadePlanejada: number;
    quantidadeProduzida: number;
    status: 'EM_PRODUCAO' | 'PARADO' | 'CONCLUIDO' | 'ATRASADO';
};

type AlertaProducao = {
    id: number;
    tipo: 'PARADA' | 'QUALIDADE' | 'MANUTENCAO';
    mensagem: string;
    linha: string;
    tempo: string;
};

const ordensMock: OrdemProducao[] = [
    {
        id: 'OP-2025-001',
        produto: 'Placa Cerâmica 60x60 Branco Fosco',
        linha: 'Linha 01',
        turno: 'Turno A',
        quantidadePlanejada: 1200,
        quantidadeProduzida: 850,
        status: 'EM_PRODUCAO'
    },
    {
        id: 'OP-2025-002',
        produto: 'Placa Cerâmica 80x80 Cinza Polido',
        linha: 'Linha 02',
        turno: 'Turno B',
        quantidadePlanejada: 900,
        quantidadeProduzida: 900,
        status: 'CONCLUIDO'
    },
    {
        id: 'OP-2025-003',
        produto: 'Placa Cerâmica 45x45 Bege',
        linha: 'Linha 01',
        turno: 'Turno B',
        quantidadePlanejada: 1500,
        quantidadeProduzida: 400,
        status: 'ATRASADO'
    },
    {
        id: 'OP-2025-004',
        produto: 'Revestimento 30x60 Branco',
        linha: 'Linha 03',
        turno: 'Turno A',
        quantidadePlanejada: 700,
        quantidadeProduzida: 0,
        status: 'PARADO'
    }
];

const alertasMock: AlertaProducao[] = [
    {
        id: 1,
        tipo: 'PARADA',
        mensagem: 'Parada não planejada por falta de matéria-prima.',
        linha: 'Linha 03',
        tempo: '00:18h'
    },
    {
        id: 2,
        tipo: 'QUALIDADE',
        mensagem: 'Índice de refugos acima do limite em Linha 01.',
        linha: 'Linha 01',
        tempo: 'Últimos 30 min'
    },
    {
        id: 3,
        tipo: 'MANUTENCAO',
        mensagem: 'Manutenção preventiva programada para Linha 02 às 14:00.',
        linha: 'Linha 02',
        tempo: 'Próximas 2h'
    }
];

function getStatusSeverity(status: OrdemProducao['status']) {
    switch (status) {
        case 'EM_PRODUCAO':
            return 'info';
        case 'CONCLUIDO':
            return 'success';
        case 'ATRASADO':
            return 'warning';
        case 'PARADO':
            return 'danger';
        default:
            return 'info';
    }
}

function getStatusLabel(status: OrdemProducao['status']) {
    switch (status) {
        case 'EM_PRODUCAO':
            return 'Em produção';
        case 'CONCLUIDO':
            return 'Concluído';
        case 'ATRASADO':
            return 'Atrasado';
        case 'PARADO':
            return 'Parado';
        default:
            return status;
    }
}

export default function Home() {
    const toast = useRef<Toast>(null)
    const oeeGeral = 78;
    const planosCumpridos = 68;
    const eficienciaTurno = 84;
    const [showCadastroNovoPCP, setShowCadastroNovoPCP] = useState<boolean>(false)
    const [grupoDeProdutos, setGrupoDeProdutos] = useState<grupoDeProdutos[]>([])
    const [grupoDeProdutoSelecionado, setGrupoDeProdutoSelecionado] = useState<string>("")
    const [linhas, setLinhas] = useState<Linhas[]>([])
    const [linhaSelecionada, setLinhaSelecionada] = useState<number | null>(null)
    const get_Info_Cadastro = async () => {
        const getGrupoDeProdutos = await API.getGrupoDeProdutos()
        setGrupoDeProdutos(getGrupoDeProdutos)
        const getLinhas = await API.getLinhas()

        setLinhas(getLinhas)
    }
    const [producaoDiaria, setProducaoDiaria] = useState<number | null>()

    const post_Cadastro = async () => {
        if (!grupoDeProdutoSelecionado || !linhaSelecionada || !producaoDiaria) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Aviso.',
                detail: 'É necessário preencher todos os campos.',
                life: 1500,
            })
            return
        }

        const payload: grupoLinhaProducao = {
            ID: 0,
            NOME_GRUPO_PRODUTOS: grupoDeProdutoSelecionado,
            LINHA: linhaSelecionada,
            PRODUCAO_DIARIA: producaoDiaria,
            DESCRICAO: null,
            ATIVO: true,
            CRIADAO_POR: "teste",
            CRIADAO_EM: new Date(),
            ALTERADO_POR: null,
            ALTERADO_EM: null,
        }

        const postCadastro = await API.postGrupoLinhaProducao(payload)
        if (postCadastro) {
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso.',
                detail: 'Planejamento cadastrado com sucesso.',
                life: 1500,

            })
            setGrupoDeProdutoSelecionado('');
            setLinhaSelecionada(null);
            setProducaoDiaria(null);
            setShowCadastroNovoPCP(false);
            return
        }
    }

    const [grupoLinhaProducao, setGrupoLinhaProducao] = useState<grupoLinhaProducao[]>([])
    const [grupoLinhaProducaoSelecionado, setGrupoLinhaProducaoSelecionado] = useState<string>("")
    const get_Info_Planejamento = async () => {
        const getGrupoLinhaProducao = await API.getGrupoLinhaProducao()
        setGrupoLinhaProducao(getGrupoLinhaProducao)

    }
    const lista = grupoLinhaProducao.map(item => ({
        ...item,
        LABEL_COMPLETO: `${item.DESCRICAO} — Qtd: ${item.PRODUCAO_DIARIA} — Linha: ${item.LINHA}`
    }));
    const [showProgramacaoProducao, setShowProgramacaoProducao] = useState<boolean>(false)
    return (
        <PrimeReactProvider value={{ ripple: true }}>
            <Toast ref={toast} />
            <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
                            <i className="pi pi-cog text-sky-400 text-xl" />
                            <span>PCP - Controle de Produção</span>
                        </h2>
                        <span className="text-sm text-neutral-400">
                            Visão geral da produção em tempo real
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            icon="pi pi-bell"
                            className="p-button-rounded p-button-text"
                            tooltip="Notificações"
                        />
                        <div className="flex items-center gap-2 text-sm text-neutral-200">
                            <i className="pi pi-user text-neutral-400" />
                            <span>Coordenador PCP</span>
                        </div>
                    </div>
                </div>

                {/* KPIs SUPERIORES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Card className="h-full bg-neutral-800 border border-neutral-700 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-400">OEE Geral</span>
                            <i className="pi pi-chart-line text-sky-400 text-xl" />
                        </div>
                        <div className="text-3xl font-bold mb-2">{oeeGeral}%</div>
                        <ProgressBar value={oeeGeral} />
                        <small className="text-neutral-400">
                            Meta: <span className="font-bold text-neutral-100">85%</span>
                        </small>
                    </Card>

                    <Card className="h-full bg-neutral-800 border border-neutral-700 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-400">Planos Cumpridos</span>
                            <i className="pi pi-check-circle text-emerald-400 text-xl" />
                        </div>
                        <div className="text-3xl font-bold mb-2">{planosCumpridos}%</div>
                        <ProgressBar value={planosCumpridos} />
                        <small className="text-neutral-400">
                            Considerando as ordens planejadas para o dia
                        </small>
                    </Card>

                    <Card className="h-full bg-neutral-800 border border-neutral-700 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-400">Eficiência do turno atual</span>
                            <i className="pi pi-clock text-orange-400 text-xl" />
                        </div>
                        <div className="text-3xl font-bold mb-2">{eficienciaTurno}%</div>
                        <ProgressBar value={eficienciaTurno} />
                        <small className="text-neutral-400">
                            Baseado na produção x ritmo planejado
                        </small>
                    </Card>
                </div>

                <Divider className="my-4" />

                {/* GRID PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* ORDENS EM ANDAMENTO (ocupa 2/3) */}
                    <div className="lg:col-span-2">
                        <Panel
                            header={
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-list text-sky-400" />
                                    <span>Ordens em andamento</span>
                                </div>
                            }
                            className="h-full bg-neutral-800  shadow-lg"
                        >
                            <DataTable
                                value={ordensMock}
                                stripedRows
                                size="small"
                                paginator
                                rows={5}
                            >
                                <Column field="id" header="OP" style={{ width: '130px' }} />
                                <Column field="produto" header="Produto" />
                                <Column field="linha" header="Linha" style={{ width: '110px' }} />
                                <Column field="turno" header="Turno" style={{ width: '110px' }} />
                                <Column
                                    header="Progresso"
                                    body={(row: OrdemProducao) => {
                                        const progresso =
                                            (row.quantidadeProduzida / row.quantidadePlanejada) * 100;
                                        return (
                                            <div className="flex flex-col gap-1">
                                                <ProgressBar
                                                    value={Math.round(progresso)}
                                                    showValue={false}
                                                />
                                                <small className="text-xs text-neutral-400">
                                                    {row.quantidadeProduzida} / {row.quantidadePlanejada} un
                                                </small>
                                            </div>
                                        );
                                    }}
                                    style={{ width: '220px' }}
                                />
                                <Column
                                    header="Status"
                                    body={(row: OrdemProducao) => (
                                        <Tag
                                            value={getStatusLabel(row.status)}
                                            severity={getStatusSeverity(row.status)}
                                            icon={
                                                row.status === 'CONCLUIDO'
                                                    ? 'pi pi-check'
                                                    : row.status === 'PARADO'
                                                        ? 'pi pi-times'
                                                        : row.status === 'ATRASADO'
                                                            ? 'pi pi-exclamation-triangle'
                                                            : 'pi pi-spin pi-cog'
                                            }
                                        />
                                    )}
                                    style={{ width: '160px' }}
                                />
                                <Column
                                    header=""
                                    body={() => (
                                        <Button
                                            icon="pi pi-search"
                                            className="p-button-text p-button-sm"
                                            tooltip="Ver detalhes"
                                        />
                                    )}
                                    style={{ width: '70px' }}
                                />
                            </DataTable>
                        </Panel>
                    </div>

                    {/* ALERTAS E AÇÕES RÁPIDAS (1/3) */}
                    <div className="flex flex-col gap-4">
                        <Panel
                            header={
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-exclamation-triangle text-orange-400" />
                                    <span>Alertas de produção</span>
                                </div>
                            }
                            className="bg-neutral-800 "
                        >
                            <ul className="m-0 p-0 list-none flex flex-col gap-3">
                                {alertasMock.map((alerta) => (
                                    <li
                                        key={alerta.id}
                                        className="border border-neutral-700 rounded-lg p-2 flex flex-col gap-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <i
                                                    className={
                                                        alerta.tipo === 'PARADA'
                                                            ? 'pi pi-stop-circle text-red-400'
                                                            : alerta.tipo === 'QUALIDADE'
                                                                ? 'pi pi-flag text-yellow-400'
                                                                : 'pi pi-wrench text-sky-400'
                                                    }
                                                />
                                                <span className="text-sm font-medium">
                                                    {alerta.mensagem}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-neutral-400 mt-1">
                                            <span>
                                                <i className="pi pi-sitemap mr-1" />
                                                {alerta.linha}
                                            </span>
                                            <span>
                                                <i className="pi pi-clock mr-1" />
                                                {alerta.tempo}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Panel>

                        <Panel
                            header={
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-play-circle text-sky-400" />
                                    <span>Ações rápidas</span>
                                </div>
                            }
                            className="bg-neutral-800 "
                        >
                            <div className="flex flex-col gap-2">
                                <Button
                                    label="Configuração"
                                    icon="pi pi-cog"
                                    className="p-button-sm"
                                    onClick={() => {
                                        get_Info_Cadastro();
                                        setShowCadastroNovoPCP(true)
                                    }}
                                />
                                <Button
                                    label="Programar linha"
                                    icon="pi pi-directions"
                                    className="p-button-sm p-button-secondary"
                                    onClick={() => {
                                        get_Info_Planejamento();
                                        setShowProgramacaoProducao(true)
                                    }}
                                />
                                <Button
                                    label="Relatório do turno"
                                    icon="pi pi-file"
                                    className="p-button-sm p-button-help"
                                />
                            </div>
                        </Panel>
                    </div>
                </div>

                <Dialog
                    onHide={() => setShowCadastroNovoPCP(false)}
                    visible={showCadastroNovoPCP}
                    pt={{ mask: { className: 'backdrop-blur-sm' } }}
                    header={`Nova configuração`}
                >
                    <div className='flex justify-center gap-3 p-2'>
                        <Dropdown
                            value={grupoDeProdutoSelecionado}
                            options={grupoDeProdutos}
                            optionLabel='DESCRICAO'
                            optionValue='CODTB3FAT'
                            placeholder='Selecione o grupo de produtos'
                            onChange={(e: DropdownChangeEvent) => { setGrupoDeProdutoSelecionado(e.value) }}
                            checkmark={true}
                            highlightOnSelect={true}
                            className='w-full md:w-56' />
                        <Dropdown
                            value={linhaSelecionada}
                            options={linhas}
                            optionLabel='LINHA'
                            optionValue='LINHA'
                            placeholder='Selecione a linha'
                            onChange={(e: DropdownChangeEvent) => { setLinhaSelecionada(e.value) }}
                            className='w-full md:w-14rem'
                            checkmark={true}
                            highlightOnSelect={true}
                        />
                        <InputNumber
                            value={producaoDiaria}
                            onValueChange={(e) => setProducaoDiaria(e.value)}
                            mode="decimal"
                            locale="pt-BR"
                            minFractionDigits={0}
                            maxFractionDigits={2}
                            useGrouping={true}

                        />

                    </div>
                    <div className='flex justify-center mt-2'>
                        <Button
                            label='Confirmar'
                            icon='pi pi-check'
                            onClick={() => post_Cadastro()}
                        />
                    </div>
                </Dialog>

                <Dialog
                    onHide={() => setShowProgramacaoProducao(false)}
                    visible={showProgramacaoProducao}
                    pt={{ mask: { className: 'backdrop-blur-sm' } }}
                    header={`Novo planejamento`}>
                    <div className='flex justify-center gap-2 p-2'>
                        <Dropdown
                            value={grupoLinhaProducaoSelecionado}
                            options={lista}
                            optionLabel='LABEL_COMPLETO'
                            optionValue='ID'
                            placeholder='Selecione uma configuração'
                            onChange={(e: DropdownChangeEvent) => { setGrupoLinhaProducaoSelecionado(e.value) }}
                            checkmark={true}
                            highlightOnSelect={true}
                            className='w-full md:w-56'
                        />
                    </div>

                </Dialog>
            </div>
        </PrimeReactProvider>
    );
}
