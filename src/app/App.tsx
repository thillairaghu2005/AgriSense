import { AppProvider } from './providers';
import Router from './router';

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
