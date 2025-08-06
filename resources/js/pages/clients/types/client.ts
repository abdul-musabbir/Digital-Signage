// types/client.ts
export interface Role {
    id: number;
    name: string;
}

export interface Client {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

export interface PageProps {
    id: number;
    roles: Role[];
}
