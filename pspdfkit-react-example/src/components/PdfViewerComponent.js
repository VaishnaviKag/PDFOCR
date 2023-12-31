import { useEffect, useRef } from "react";

export default function PdfViewerComponent(props) {
  const containerRef = useRef(null);
  const toolbarItems = [];
  toolbarItems.push(
    { type: "pager" },
    { type: "zoom-out" },
    { type: "zoom-in" },
    { type: "search" }
  );

  useEffect(() => {
    const container = containerRef.current;
    let instance, PSPDFKit;
    (async function () {
      PSPDFKit = await import("pspdfkit");
      PSPDFKit.unload(container);
      if (props.document != "") {
        instance = await PSPDFKit.load({
          // Container where PSPDFKit should be mounted.
          container,
          // The document to open.
          document: props.document,
          // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
          baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
          toolbarItems: toolbarItems,
        });

        props.setInstance(instance);
      }
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document]);

  return <div ref={containerRef} style={{ width: "100%", height: "60vh" }} />;
}
