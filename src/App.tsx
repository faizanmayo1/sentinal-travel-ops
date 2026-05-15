import { Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { CommandCenter } from "@/routes/CommandCenter"
import { Triage } from "@/routes/Triage"
import { Claims } from "@/routes/Claims"
import { MedicalCases } from "@/routes/MedicalCases"
import { CostContainment } from "@/routes/CostContainment"
import { RiskSurge } from "@/routes/RiskSurge"
import { Providers } from "@/routes/Providers"
import { Inbox } from "@/routes/Inbox"
import { Documents } from "@/routes/Documents"
import { TravelerPortal } from "@/routes/TravelerPortal"
import { Partners } from "@/routes/Partners"
import { Executive } from "@/routes/Executive"
import { Audit } from "@/routes/Audit"
// import { DemoSetup } from "@/routes/DemoSetup"  // internal presenter view — disabled during live demo
import { Placeholder } from "@/routes/Placeholder"

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<CommandCenter />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/claims/:id" element={<Claims />} />
        <Route path="/cases" element={<MedicalCases />} />
        <Route path="/cases/:id" element={<MedicalCases />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/:id" element={<Providers />} />
        <Route path="/cost-containment" element={<CostContainment />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/risk" element={<RiskSurge />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/partners/:id" element={<Partners />} />
        <Route path="/executive" element={<Executive />} />
        <Route path="/traveler-portal" element={<TravelerPortal />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/settings/access" element={<Audit />} />
        {/* <Route path="/admin/data" element={<DemoSetup />} /> */}
        <Route path="*" element={<Placeholder title="Not found" description="This route is not part of the Sentinel demo." />} />
      </Route>
    </Routes>
  )
}
