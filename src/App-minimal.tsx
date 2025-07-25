import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Auth0ProviderWrapper } from './providers/Auth0Provider'
import TestAuth from './pages/TestAuth'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Auth0ProviderWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TestAuth />} />
          </Routes>
        </BrowserRouter>
      </Auth0ProviderWrapper>
    </QueryClientProvider>
  );
}

export default App;