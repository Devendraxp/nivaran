import Services from "../components/Services"
import Servicing from "../components/Servicing"
export default function Home() {
  return (
    <div>
      <h1 className="font-extrabold text-2xl">Home</h1>
      <div>
      <Services />
      </div>
      <div className="mt-5 sm:mt-8">
      <Servicing />
      </div>
    </div>
  )
}
