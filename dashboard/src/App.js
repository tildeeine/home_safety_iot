import './index.css';
import StatusCard from './StatusCard';

function App() {
  return (
    <div className="App">
      <div className='lg:p-32 lg:px-48 md:p-18 p-10 h-auto flex flex-row flex-wrap justify-evenly'>
        <StatusCard></StatusCard>
        <StatusCard></StatusCard>
        <StatusCard></StatusCard>
        <StatusCard></StatusCard>
      </div>
    </div>
  );
}

export default App;
