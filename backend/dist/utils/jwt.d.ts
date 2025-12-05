export interface TokenPayload {
    userId: number;
    name: string;
    email: string;
    role: 'seller' | 'customer';
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload | null;
export declare const extractToken: (authHeader: string | undefined) => string | null;
//# sourceMappingURL=jwt.d.ts.map