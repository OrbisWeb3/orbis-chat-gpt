import '@/styles/globals.css'
import { Orbis, OrbisProvider } from "@orbisclub/components";
import "@orbisclub/components/dist/index.modern.css";

/** Set the global forum context here. You can create your context here: https://useorbis.com/dashboard */
global.orbis_context = "kjzl6cwe1jw14b06s2ppzmc62rrf4a2cmck0612il3g5ga8w9s67xu7icjo6arz";

let orbis = new Orbis({
  useLit: true,
  node: "https://node2.orbis.club"
});

export default function App({ Component, pageProps }) {
  return <OrbisProvider defaultOrbis={orbis}><Component {...pageProps} /></OrbisProvider>
}
