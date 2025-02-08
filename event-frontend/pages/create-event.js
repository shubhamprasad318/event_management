// pages/create-event.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import CreateEventForm from "../components/CreateEventForm";

export default function CreateEvent() {
  const router = useRouter();

  useEffect(() => {
    // Only registered users (with a token) may create events.
    const token = localStorage.getItem("token");
    const guest = localStorage.getItem("guest");
    if (!token || guest) {
      alert("Only registered users can create events.");
      router.push("/");
    }
  }, [router]);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <CreateEventForm />
      </div>
    </Layout>
  );
}
