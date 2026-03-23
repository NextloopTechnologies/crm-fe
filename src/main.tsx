// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { RouterProvider } from 'react-router-dom'
// import { QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { router } from '@/router'
// import { queryClient } from '@/lib/queryClient'
// import '@/index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={router} />
//       {/* Remove ReactQueryDevtools in production */}
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   </React.StrictMode>
// )



import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { router } from '@/router'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/stores/auth.store'
import '@/index.css'

// DEV ONLY — seed a fake user so UI renders without backend
useAuthStore.getState().login(
  'dev-token',
  'dev-refresh-token',
  { id: 1, name: 'Dev User', email: 'dev@nextloop.com', role: 'ADMIN' }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
