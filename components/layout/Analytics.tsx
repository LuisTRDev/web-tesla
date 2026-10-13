import Script from "next/script";

/**
 * Google Analytics 4. Solo se carga si existe la variable de entorno NEXT_PUBLIC_GA_ID
 * (p. ej. "G-XXXXXXXXXX"), definida en .env.local o en el panel del hosting.
 * Sin esa variable no se carga nada.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
