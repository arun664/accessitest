import Layout from "@/components/default/layout";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

function MyApp({ Component, pageProps }) {
  if (Component.noLayout) {
    return (
      <>
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
