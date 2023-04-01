import '@/styles/globals.css'
import {Orbis, OrbisProvider} from "@orbisclub/components";
import "@orbisclub/components/dist/index.modern.css";
import Script from 'next/script'
import {ThemeProvider} from "next-themes";

/** Set the global forum context here. You can create your context here: https://useorbis.com/dashboard */
global.orbis_context = "kjzl6cwe1jw14b06s2ppzmc62rrf4a2cmck0612il3g5ga8w9s67xu7icjo6arz";
global.orbis_chat_context = "kjzl6cwe1jw14bixqvv1zj647a707e962fc39awh749lok3ivo3tfog1o2n44zd";

let orbis = new Orbis({
    useLit: true,
    node: "https://node2.orbis.club"
});

export default function App({Component, pageProps}) {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-8QVH2K5MJP"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8QVH2K5MJP');
        `}
            </Script>
            <OrbisProvider defaultOrbis={orbis}>
                <ThemeProvider defaultTheme="light" attribute="class">
                    <Component {...pageProps} />
                </ThemeProvider>
            </OrbisProvider>
        </>
    );
}
