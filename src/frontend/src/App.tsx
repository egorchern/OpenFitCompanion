
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import '@fontsource/roboto'
import DataVisualiser from './components/dataVisualiser';
import Export from "./components/export";
import SecretTokenSetter from "./components/SecretTokenSetter";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex-vertical">
        <SecretTokenSetter/>
        <DataVisualiser />
        <Export/>
      </main>
      


    </QueryClientProvider>


  );
}

export default App;
