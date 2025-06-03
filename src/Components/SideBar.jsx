import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Settings, User, Calendar, Mail } from "lucide-react"

export function AppSidebar() {
  // Menu items
  const items = [
    {
      title: "Ana Sayfa",
      url: "/",
      icon: Home,
    },
    {
      title: "Profil",
      url: "/profile",
      icon: User,
    },
    {
      title: "Takvim",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Mail",
      url: "/mail",
      icon: Mail,
    },
    {
      title: "Ayarlar",
      url: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">Uygulama</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 text-sm text-muted-foreground">
          © 2024 Uygulama
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

// Ana layout component'i
export function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Ana İçerik</h1>
          </div>
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

// Vite + React Router kullanımı için
export function SideBar() {
  return (
    <Layout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Hoş Geldiniz!</h2>
        <p>Bu bir Vite + React projesidir.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Özellik 1</h3>
            <p className="text-sm text-muted-foreground">Açıklama buraya...</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Özellik 2</h3>
            <p className="text-sm text-muted-foreground">Açıklama buraya...</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}