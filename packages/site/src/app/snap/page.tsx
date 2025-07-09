import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DashboardContainer } from "@/components/index/DashboardContainer";
import { StateUpdater } from "@/components/index/StateUpdater";
import { MetaMaskButton } from "@/components/MetaMaskButton"
import { AccountStoreProvider } from "@/hooks/AccountStoreContext";
import { MetaMaskProvider } from "@/hooks/MetaMaskContext";

function DashboardHeader() {
  return (
    <span
      className="bg-gradient-to-r bg-clip-text text-transparent text-5xl font-semibold select-none"
      style={{
        backgroundImage: 'linear-gradient(to right in oklab, rgb(135, 41, 255) 0%, rgb(252, 252, 252) 100%)'
      }}
      >
      VSL Snap Dashboard
    </span>
  )
}

function Dashboard() {
  return (<div className="w-4/5 max-w-7xl mx-auto">
    <div className="flex flex-row items-center justify-between mt-8 mb-4">
      <DashboardHeader />
      <div className="flex flex-row items-center gap-4">
        <StateUpdater />
        <MetaMaskButton />
      </div>
    </div>
    <DashboardContainer />
    <div className="mt-8" />
  </div>)
}

export default function App() {
  return (<MetaMaskProvider>
    <AccountStoreProvider>
      <Header />
      <Dashboard />
      <Footer />
    </AccountStoreProvider>
  </MetaMaskProvider>);
}
