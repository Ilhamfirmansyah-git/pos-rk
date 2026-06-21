import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

interface AllProvidersProps {
  children: React.ReactNode
  initialRoute?: string
}

function AllProviders({ children, initialRoute = '/' }: AllProvidersProps) {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialRoute?: string },
) {
  const { initialRoute, ...renderOptions } = options ?? {}
  return render(ui, {
    wrapper: ({ children }) => <AllProviders initialRoute={initialRoute}>{children}</AllProviders>,
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
