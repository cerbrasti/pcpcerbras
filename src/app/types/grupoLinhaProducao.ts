export type grupoLinhaProducao = {
    ID: number | null;
    NOME_GRUPO_PRODUTOS: string;
    DESCRICAO: string | null;
    LINHA: number;
    PRODUCAO_DIARIA: number;
    ATIVO: boolean | null;
    CRIADAO_POR: string | null;
    CRIADAO_EM: Date | null;
    ALTERADO_POR: string | null;
    ALTERADO_EM: Date | null;
}