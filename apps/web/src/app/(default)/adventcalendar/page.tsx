import Kalender from "./_components/Kalender";
import { Banner } from "./_components/Banner";

export default function Adventcalendar() {
  return( 
    <>
    <Banner/>
    <main className="min-h-screen dark:bg-black bg-white p-4 ">
      
      <div>
        <h1 className="mb-4 text-center text-3x1 font-bold dark:text-white text-black">
          Julekalender
        </h1>
        <p></p>
        <div className="mx-auto max-w-3xl">
          <Kalender />
        </div>
      </div>
      
    </main>
    </>

);
    
}