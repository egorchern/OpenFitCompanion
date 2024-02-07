
  import '@fontsource/roboto'
  import DataVisualiser from '../components/dataVisualiser';
  import Export from "../components/export";
  import SecretTokenSetter from "../components/SecretTokenSetter";
  import { Route, Routes } from "react-router-dom";
  

  
  function Root() {
    return (
  

        <main className="flex-vertical">
          <SecretTokenSetter/>
          <DataVisualiser />
          <Export/>
        </main>
        
  
  

  
  
    );
  }
  
  export default Root;
  