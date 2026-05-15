import '../styles/globals.css';
import Layout from '../components/Layout';
import ThemeProvider from '../components/ThemeProvider';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}