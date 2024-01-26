
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import '@fontsource/roboto'
import DataVisualiser from './components/dataVisualiser';
import Export from "./components/export";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex-vertical">
        <DataVisualiser />
        <Export/>
      </main>
      


    </QueryClientProvider>


  );
}

export default App;
