import { Achilles } from './components/achilles/achilles';
import InsertionSort from './components/achilles/implementations/insertion_sort';

function App() {

  return (
    <>
      <h1>Hello, World!</h1>
      <Achilles stageClass={InsertionSort} />
    </>
  )
}

export default App
