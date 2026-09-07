import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "./components/providers/query-provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { CitationDrawerProvider } from "./components/providers/citation-drawer-provider.tsx";

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <CitationDrawerProvider>
          <AppRoutes />
          <Toaster />
        </CitationDrawerProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
