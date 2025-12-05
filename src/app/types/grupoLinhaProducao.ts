export type grupoLinhaProducao = {
    ID: number | null;
    NOME_GRUPO_PRODUTOS: string;
    LINHA: number;
    PRODUCAO_DIARIA: number;
    ATIVO: boolean | null;
    USUARIO_CRIACAO: string | null;
    DATA_CRIACAO: Date | null;
    USUARIO_ALTERACAO: string | null;
    DATA_ALTERACAO: Date | null;
}