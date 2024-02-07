
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import '@fontsource/roboto'
import DataVisualiser from './components/dataVisualiser';
import Export from "./components/export";
import SecretTokenSetter from "./components/SecretTokenSetter";
import { Route, Routes } from "react-router-dom";
import Root from "./routes/root";

const queryClient = new QueryClient();

function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route index element={<Root/>}/>
      </Routes>
      <main className="flex-vertical">
        <SecretTokenSetter/>
        <DataVisualiser />
        <Export/>
      </main>
      


    </QueryClientProvider>


  );
}

export default App;
