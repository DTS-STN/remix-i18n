import { createContext } from 'react';

export interface NonceContextType {
  nonce?: string;
}

const NonceContext = createContext<NonceContextType>({});

export default NonceContext;
