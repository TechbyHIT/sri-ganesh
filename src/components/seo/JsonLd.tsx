type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown> | undefined>;
};

export function JsonLd({ data }: JsonLdProps) {
  const blocks = (Array.isArray(data) ? data : [data]).filter(
    (block): block is Record<string, unknown> => Boolean(block),
  );

  if (blocks.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(blocks.length === 1 ? blocks[0] : blocks).replace(/</g, "\\u003c"),
      }}
    />
  );
}
