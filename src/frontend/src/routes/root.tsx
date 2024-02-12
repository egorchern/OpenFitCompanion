
  import '@fontsource/roboto'
  import DataVisualiser from './Root/dataVisualiser';
  import Export from "./Root/export";
  import SecretTokenSetter from "./Root/SecretTokenSetter";
  

  
  function Root() {
    return (
  

        <main className="flex-vertical">
          <h1>Dashboard</h1>
          <SecretTokenSetter/>
          <DataVisualiser />
          <Export/>
        </main>
        
  
  

  
  
    );
  }
  
  export default Root;
  