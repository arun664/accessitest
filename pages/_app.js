import Layout from '@/components/default/layout';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }
  
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
  
  export default MyApp;
  