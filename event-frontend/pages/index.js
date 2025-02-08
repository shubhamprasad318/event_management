// pages/index.js
import Layout from "../components/Layout";
import EventDashboard from "../components/EventDashboard";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <EventDashboard />
      </div>
    </Layout>
  );
}
