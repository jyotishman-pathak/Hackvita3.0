import { ModeToggle } from '@/components/providers/mode-toggle'
import AppSideBar from '@/components/Sidebar/app-sidebar'
import { Card } from '@/components/ui/card'
import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'

const SideBarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        
        {/* Sidebar */}
        <AppSideBar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-4 p-4">
          
          {/* Top Bar */}
          <div className="flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4">
            <div className="">Search</div>
            <div className="ml-auto flex items-center gap-3">
              <UserButton />
              <ModeToggle />
            </div>
          </div>

          {/* Content Area (Full Width & Height) */}
          <div className="border-sidebar-border bg-sidebar shadow rounded-md overflow-y-auto 
              h-[calc(100vh-6rem)] p-4 w-full">
            {children}
          </div>

        </main>
      </div>
    </SidebarProvider>
  )
}

export default SideBarLayout
