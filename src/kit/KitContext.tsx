import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_KIT, type KitBuild } from './catalog'

type KitApi = {
  kit: KitBuild
}

const KitContext = createContext<KitApi | null>(null)

export function KitProvider({ children }: { children: ReactNode }) {
  return <KitContext.Provider value={{ kit: DEFAULT_KIT }}>{children}</KitContext.Provider>
}

export function useKit() {
  const ctx = useContext(KitContext)
  if (!ctx) throw new Error('useKit must be inside KitProvider')
  return ctx
}
