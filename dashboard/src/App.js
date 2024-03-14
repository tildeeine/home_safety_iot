import './index.css';
import StatusCard from './StatusCard';
import Sidebar from './Sidebar';
import { faFireBurner } from '@fortawesome/free-solid-svg-icons';


function App() {
  return (
    <div className="relative flex flex-row min-h-screen">
      <Sidebar></Sidebar>
      <div className='absolute inset-0 z-10 w-screen h-full xl:p-32 xl:pr-48 xl:pl-96 md:p-18 md:pl-52 p-10 h-auto flex flex-row flex-wrap justify-evenly bg-gray-800'>
        <StatusCard appliance="oven" icon={faFireBurner}></StatusCard>
        <StatusCard appliance="oven" icon={faFireBurner}></StatusCard>
        <StatusCard appliance="oven" icon={faFireBurner}></StatusCard>
        <StatusCard appliance="oven" icon={faFireBurner}></StatusCard>
      </div>
    </div>
  );
}

export default App;
