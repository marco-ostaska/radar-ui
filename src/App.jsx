import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/radar/app-sidebar";
import Badges from "@/components/radar/header";

export function App({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-100 text-white">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          
          <main className="flex-1 p-4">
            <SidebarTrigger className="text-slate-800"/>
            <Badges />  
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


// function App() {
//   return (
//     <> <Layout />

//     <div className="flex h-screen bg-slate-900 text-white">
//       {/* <AppSidebar /> */}
//       <main className="flex-1 p-6">
//         <Header />
//         <h1 className="text-2xl font-bold">Ativos</h1>
//       </main>
//     </div>
//         </>
//   // ) 
//   );
// }

export default App
