import Script from "next/script";

export function Analytics() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;
  const gtmId = gtm && /^GTM-[A-Z0-9]+$/.test(gtm) ? gtm : "";
  const gaId = ga && /^G-[A-Z0-9]+$/.test(ga) ? ga : "";
  const pixelId = pixel && /^\d{5,20}$/.test(pixel) ? pixel : "";
  const clarityId = clarity && /^[a-z0-9]+$/i.test(clarity) ? clarity : "";

  return (
    <>
      {gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});`}
        </Script>
      ) : null}
      {gtmId ? <Script src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} strategy="afterInteractive" /> : null}
      {gaId && !gtmId ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" /> : null}
      {gaId && !gtmId ? (
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
        </Script>
      ) : null}
      {clarityId ? (
        <Script id="clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      ) : null}
      {pixelId ? (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');`}
        </Script>
      ) : null}
    </>
  );
}
