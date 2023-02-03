export interface Membro {
    id?: number;
    Name: string;
    cargo?: string;
    dataNascimento: string;
    sexo: string;
    rua: string;
    numero: number;
    bairro: string;
    cidade: string;
    telefone: string;
    flagAtivo?: boolean;
    status?: string;
}