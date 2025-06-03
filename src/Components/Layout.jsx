// Shadcn Sidebar imports
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

import Header from "./Header";
import Footer from "./Footer";
import { SidebarTrigger } from '@/components/ui/sidebar'

// Layout component with sidebar
const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon" className="mt-14">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem className={"flex justify-left ml-1 mt-2"}> 
                <SidebarTrigger/>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <span>Ana Sayfa</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/home">
                    <span>Quiz</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/login">
                    <span>Giriş Yap</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/register">
                    <span>Kayıt Ol</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">   
            <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;